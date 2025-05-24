const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { authenticateUser, checkRole } = require('../middleware/auth');

// الحصول على جميع الاختبارات
router.get('/', authenticateUser, async (req, res) => {
  try {
    const examsSnapshot = await db.collection('exams')
      .where('isActive', '==', true)
      .get();

    const exams = [];
    examsSnapshot.forEach(doc => {
      exams.push({ id: doc.id, ...doc.data() });
    });

    res.json(exams);
  } catch (error) {
    console.error('خطأ في جلب الاختبارات:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// إنشاء اختبار جديد
router.post('/', authenticateUser, checkRole(['teacher']), async (req, res) => {
  try {
    const { title, subject, duration, passingGrade, instructions, questions } = req.body;

    const examRef = await db.collection('exams').add({
      title,
      subject,
      duration,
      passingGrade,
      instructions,
      questions,
      createdBy: req.user.uid,
      createdAt: new Date(),
      isActive: true
    });

    res.status(201).json({ id: examRef.id, message: 'تم إنشاء الاختبار بنجاح' });
  } catch (error) {
    console.error('خطأ في إنشاء الاختبار:', error);
    res.status(400).json({ error: error.message });
  }
});

// الحصول على اختبار محدد
router.get('/:examId', authenticateUser, async (req, res) => {
  try {
    const examDoc = await db.collection('exams').doc(req.params.examId).get();
    
    if (!examDoc.exists) {
      return res.status(404).json({ error: 'الاختبار غير موجود' });
    }

    res.json({ id: examDoc.id, ...examDoc.data() });
  } catch (error) {
    console.error('خطأ في جلب الاختبار:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// تقديم إجابات الاختبار
router.post('/:examId/submit', authenticateUser, checkRole(['student']), async (req, res) => {
  try {
    const { answers } = req.body;
    const examDoc = await db.collection('exams').doc(req.params.examId).get();
    
    if (!examDoc.exists) {
      return res.status(404).json({ error: 'الاختبار غير موجود' });
    }

    const exam = examDoc.data();
    let totalScore = 0;
    let totalPoints = 0;

    // حساب النتيجة
    for (const questionId of exam.questions) {
      const questionDoc = await db.collection('questions').doc(questionId).get();
      const question = questionDoc.data();
      
      totalPoints += question.points;
      if (answers[questionId] === question.correctAnswer) {
        totalScore += question.points;
      }
    }

    const percentage = (totalScore / totalPoints) * 100;
    const passed = percentage >= exam.passingGrade;

    // حفظ النتيجة
    const resultRef = await db.collection('results').add({
      examId: req.params.examId,
      studentId: req.user.uid,
      answers,
      score: percentage,
      totalPoints,
      passed,
      completedAt: new Date()
    });

    res.json({
      id: resultRef.id,
      score: percentage,
      passed,
      totalScore,
      totalPoints
    });
  } catch (error) {
    console.error('خطأ في تقديم الاختبار:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 