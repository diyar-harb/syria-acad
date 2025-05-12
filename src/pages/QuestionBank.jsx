import React from 'react';
import { motion } from 'framer-motion';
import { questions } from '../data/mockExams';
import '../styles/QuestionBank.css';

const QuestionBank = () => {
  const subjects = [...new Set(questions.map(q => q.subject))];

  return (
    <motion.div 
      className="question-bank"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>بنك الأسئلة</h1>
      
      {subjects.map(subject => (
        <div key={subject} className="subject-section">
          <h2>{subject}</h2>
          <div className="questions-grid">
            {questions
              .filter(q => q.subject === subject)
              .map(question => (
                <motion.div 
                  key={question.id}
                  className="question-card"
                  whileHover={{ scale: 1.02 }}
                >
                  <h3>{question.question}</h3>
                  <div className="question-info">
                    <span className="difficulty">الصعوبة: {question.difficulty}</span>
                    <span className="points">النقاط: {question.points}</span>
                  </div>
                  <div className="options">
                    {question.options.map((option, index) => (
                      <div key={index} className="option">
                        {option}
                      </div>
                    ))}
                  </div>
                  <div className="answer">
                    <strong>الإجابة الصحيحة:</strong> {question.correctAnswer}
                  </div>
                  <div className="explanation">
                    <strong>التفسير:</strong> {question.explanation}
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default QuestionBank; 