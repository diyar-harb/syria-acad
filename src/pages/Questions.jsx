import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Questions.css';

const Questions = () => {
  return (
    <div className="questions-page">
      <motion.section 
        className="questions-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container">
          <h1>بنك الأسئلة</h1>
          <p>اختبر معرفتك وتعلم من أخطائك</p>
        </div>
      </motion.section>

      <section className="questions-content">
        <div className="container">
          <div className="temp-message">
            <h2>قريباً</h2>
            <p>نعمل على تجهيز بنك الأسئلة. ترقبونا قريباً.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Questions; 