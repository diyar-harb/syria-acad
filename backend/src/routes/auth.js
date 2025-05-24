const express = require('express');
const router = express.Router();
const { auth, db } = require('../config/firebase');
const { authenticateUser } = require('../middleware/auth');

// تسجيل مستخدم جديد
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, profile } = req.body;

    // إنشاء المستخدم في Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
    });

    // إنشاء ملف المستخدم في Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email,
      role,
      profile,
      createdAt: new Date(),
      lastLogin: new Date()
    });

    res.status(201).json({ message: 'تم إنشاء المستخدم بنجاح', uid: userRecord.uid });
  } catch (error) {
    console.error('خطأ في التسجيل:', error);
    res.status(400).json({ error: error.message });
  }
});

// تسجيل الدخول
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userRecord = await auth.getUserByEmail(email);
    
    // تحديث آخر تسجيل دخول
    await db.collection('users').doc(userRecord.uid).update({
      lastLogin: new Date()
    });

    // إنشاء توكن مخصص
    const token = await auth.createCustomToken(userRecord.uid);
    
    res.json({ token, uid: userRecord.uid });
  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error);
    res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
  }
});

// تجديد التوكن
router.post('/refresh-token', authenticateUser, async (req, res) => {
  try {
    const userRecord = await auth.getUser(req.user.uid);
    const token = await auth.createCustomToken(userRecord.uid);
    
    res.json({ token, uid: userRecord.uid });
  } catch (error) {
    console.error('خطأ في تجديد التوكن:', error);
    res.status(401).json({ error: 'فشل تجديد التوكن' });
  }
});

// الحصول على معلومات المستخدم
router.get('/me', authenticateUser, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }

    res.json(userDoc.data());
  } catch (error) {
    console.error('خطأ في جلب بيانات المستخدم:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

module.exports = router; 