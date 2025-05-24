import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { examService } from '../services/api';
import '../styles/Exam.css';

const Exam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [currentExam, setCurrentExam] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showInstructions, setShowInstructions] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const exam = await examService.getExam(examId);
      setCurrentExam(exam);
      setTimeLeft(exam.duration * 60);
        setLoading(false);
      } catch (error) {
        setError('حدث خطأ في تحميل الاختبار');
        setLoading(false);
    }
    };

    fetchExam();
  }, [examId]);

  const handleSubmit = async () => {
    try {
      const result = await examService.submitExam(examId, answers);
      setScore(result.score);
      setFeedback({
        passed: result.passed,
        correctAnswers: result.correctAnswers,
        totalQuestions: result.totalQuestions,
        totalScore: result.totalScore,
        totalPoints: result.totalPoints
      });
      setShowResults(true);
    } catch (error) {
      setError('حدث خطأ في تقديم الاختبار');
    }
  };

  useEffect(() => {
    if (timeLeft > 0 && !showResults && !showInstructions) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !showResults && !showInstructions) {
      handleSubmit();
    }
  }, [timeLeft, showResults, showInstructions]);

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentExam.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const startExam = () => {
    setShowInstructions(false);
  };

  if (loading) {
    return <div className="loading">جاري التحميل...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!currentExam) {
    return <div className="error-message">الاختبار غير موجود</div>;
  }

  if (showInstructions) {
    return (
      <motion.div 
        className="exam-instructions"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2>{currentExam.title}</h2>
        <div className="exam-info">
          <p><strong>المادة:</strong> {currentExam.subject}</p>
          <p><strong>المدة:</strong> {currentExam.duration} دقيقة</p>
          <p><strong>الدرجة المطلوبة للنجاح:</strong> {currentExam.passingGrade}%</p>
        </div>
        <div className="instructions">
          <h3>تعليمات الاختبار:</h3>
          <ul>
            {currentExam.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </div>
        <button 
          className="btn btn-primary"
          onClick={startExam}
        >
          بدء الاختبار
        </button>
      </motion.div>
    );
  }

  if (showResults) {
    return (
      <motion.div 
        className="exam-results"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2>نتيجة الاختبار</h2>
        <div className={`score ${feedback.passed ? 'passed' : 'failed'}`}>
          {Math.round(score)}%
        </div>
        <div className="feedback">
          <p>عدد الإجابات الصحيحة: {feedback.correctAnswers} من {feedback.totalQuestions}</p>
          <p>النقاط: {feedback.totalScore} من {feedback.totalPoints}</p>
          <p>الحالة: {feedback.passed ? 'ناجح' : 'راسب'}</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/dashboard')}
        >
          العودة للرئيسية
        </button>
      </motion.div>
    );
  }

  const currentQuestion = currentExam.questions[currentQuestionIndex];

  return (
    <div className="exam-container">
      <div className="exam-header">
        <h2>{currentExam.title}</h2>
        <div className="exam-info">
          <span className="question-count">
            السؤال {currentQuestionIndex + 1} من {currentExam.questions.length}
          </span>
          <span className="timer">
            الوقت المتبقي: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="question-container">
        <div className="question">
          <h3>{currentQuestion.question}</h3>
          <span className="difficulty">الصعوبة: {currentQuestion.difficulty}</span>
          <span className="points">النقاط: {currentQuestion.points}</span>
        </div>

        <div className="options">
          {currentQuestion.options.map((option, index) => (
            <motion.div
              key={index}
              className={`option ${answers[currentQuestion.id] === option ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(currentQuestion.id, option)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {option}
            </motion.div>
          ))}
        </div>

        <div className="navigation-buttons">
          <button 
            className="btn btn-secondary"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            السابق
          </button>
          {currentQuestionIndex === currentExam.questions.length - 1 ? (
            <button 
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              إنهاء الاختبار
            </button>
          ) : (
            <button 
              className="btn btn-primary"
              onClick={handleNext}
            >
              التالي
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Exam; 