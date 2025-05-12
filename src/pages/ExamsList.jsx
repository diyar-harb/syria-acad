import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { exams } from '../data/mockExams';
import '../styles/ExamsList.css';

const ExamsList = () => {
  const subjects = [...new Set(exams.map(exam => exam.subject))];

  return (
    <motion.div 
      className="exams-list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>الاختبارات المتاحة</h1>
      
      {subjects.map(subject => (
        <div key={subject} className="subject-section">
          <h2>{subject}</h2>
          <div className="exams-grid">
            {exams
              .filter(exam => exam.subject === subject)
              .map(exam => (
                <motion.div 
                  key={exam.id}
                  className="exam-card"
                  whileHover={{ scale: 1.02 }}
                >
                  <h3>{exam.title}</h3>
                  <div className="exam-info">
                    <p><strong>المدة:</strong> {exam.duration} دقيقة</p>
                    <p><strong>عدد الأسئلة:</strong> {exam.questions.length}</p>
                    <p><strong>درجة النجاح:</strong> {exam.passingGrade}%</p>
                  </div>
                  <div className="exam-description">
                    <p>{exam.description}</p>
                  </div>
                  <Link to={`/exam/${exam.id}`} className="btn btn-primary">
                    بدء الاختبار
                  </Link>
                </motion.div>
              ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default ExamsList; 