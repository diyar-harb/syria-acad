import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Exams.css';

const Exams = () => {
  return (
    <div className="exams-page">
      <motion.section 
        className="exams-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container">
          <h1>الاختبارات</h1>
          <p>اختبارات تجريبية تحاكي الامتحانات الرسمية</p>
        </div>
      </motion.section>

      <section className="exams-content">
        <div className="container">
          <div className="temp-message">
            <h2>قريباً</h2>
            <p>نعمل على تجهيز الاختبارات. ترقبونا قريباً.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Exams; 