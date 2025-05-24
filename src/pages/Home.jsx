import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/Home.css';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <motion.section 
        className="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container">
          <motion.div 
            className="hero-content"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.h1 variants={fadeIn}>مرحباً بك في Syria Acadime</motion.h1>
            <motion.p variants={fadeIn}>منصة التعليم الذكية التي تساعدك على تحقيق أقصى استفادة من دراستك</motion.p>
            <motion.div className="hero-buttons" variants={fadeIn}>
              <Link to="/register" className="btn btn-primary">ابدأ الآن</Link>
              <Link to="/exams" className="btn btn-secondary">الاختبارات</Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            مميزات المنصة
          </motion.h2>
          <motion.div 
            className="features-grid"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div className="feature-card" variants={fadeIn}>
              <div className="feature-icon">
                <img src="/img/icons/questions.png" alt="بنك الأسئلة" />
              </div>
              <h3>بنك الأسئلة الذكي</h3>
              <p>أسئلة متنوعة مصنفة حسب المادة والمستوى والصعوبة</p>
            </motion.div>
            <motion.div className="feature-card" variants={fadeIn}>
              <div className="feature-icon">
                <img src="/img/icons/video.png" alt="دروس مصغرة" />
              </div>
              <h3>دروس مصغرة</h3>
              <p>فيديوهات تعليمية قصيرة مع ملخصات قابلة للتنزيل</p>
            </motion.div>
            <motion.div className="feature-card" variants={fadeIn}>
              <div className="feature-icon">
                <img src="/img/icons/adaptive.png" alt="تعلم تكيفي" />
              </div>
              <h3>تعلم تكيفي</h3>
              <p>تحديد نقاط الضعف وتقديم دروس مخصصة</p>
            </motion.div>
            <motion.div className="feature-card" variants={fadeIn}>
              <div className="feature-icon">
                <img src="/img/icons/exam.png" alt="اختبارات محاكاة" />
              </div>
              <h3>اختبارات محاكاة</h3>
              <p>امتحانات تجريبية مع تقارير أداء مفصلة</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <motion.section 
        className="stats"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container">
          <motion.div 
            className="stats-grid"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div className="stat-card" variants={fadeIn}>
              <h3>+1000</h3>
              <p>درس تعليمي</p>
            </motion.div>
            <motion.div className="stat-card" variants={fadeIn}>
              <h3>+5000</h3>
              <p>سؤال في بنك الأسئلة</p>
            </motion.div>
            <motion.div className="stat-card" variants={fadeIn}>
              <h3>+10000</h3>
              <p>طالب مسجل</p>
            </motion.div>
            <motion.div className="stat-card" variants={fadeIn}>
              <h3>+200</h3>
              <p>معلم متخصص</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home; 