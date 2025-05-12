import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { questions, exams } from '../data/mockExams';
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

  const calculateScore = () => {
    if (!currentExam) return;
    
    let totalScore = 0;
    let totalPoints = 0;
    let correctAnswers = 0;
    let totalQuestions = currentExam.questions.length;

    currentExam.questions.forEach(questionId => {
      const question = questions.find(q => q.id === questionId);
      if (question) {
        totalPoints += question.points;
        if (answers[questionId] === question.correctAnswer) {
          totalScore += question.points;
          correctAnswers++;
        }
      }
    });

    const percentage = (totalScore / totalPoints) * 100;
    const passed = percentage >= currentExam.passingGrade;

    setScore(percentage);
    setFeedback({
      passed,
      correctAnswers,
      totalQuestions,
      totalScore,
      totalPoints
    });
  };

  const handleSubmit = () => {
    calculateScore();
    setShowResults(true);
  };

  useEffect(() => {
    const exam = exams.find(e => e.id === parseInt(examId));
    if (exam) {
      setCurrentExam(exam);
      setTimeLeft(exam.duration * 60);
    }
  }, [examId]);

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

  if (!currentExam) {
    return <div className="loading">جاري التحميل...</div>;
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
        <div className="answers-review">
          <h3>مراجعة الإجابات:</h3>
          {currentExam.questions.map((questionId, index) => {
            const question = questions.find(q => q.id === questionId);
            const userAnswer = answers[questionId];
            const isCorrect = userAnswer === question.correctAnswer;
            
            return (
              <div key={questionId} className={`answer-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                <h4>السؤال {index + 1}: {question.question}</h4>
                <p>إجابتك: {userAnswer || 'لم تجب'}</p>
                <p>الإجابة الصحيحة: {question.correctAnswer}</p>
                <p className="explanation">التفسير: {question.explanation}</p>
              </div>
            );
          })}
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

  const currentQuestionId = currentExam.questions[currentQuestionIndex];
  const question = questions.find(q => q.id === currentQuestionId);

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
          <h3>{question.question}</h3>
          <span className="difficulty">الصعوبة: {question.difficulty}</span>
          <span className="points">النقاط: {question.points}</span>
        </div>

        <div className="options">
          {question.options.map((option, index) => (
            <motion.div
              key={index}
              className={`option ${answers[question.id] === option ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(question.id, option)}
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