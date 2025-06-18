import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import '../styles/Home.css';

const Home = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="home">
      {/* Hero Section with Parallax */}
      <motion.section
        className="hero"
        style={{ opacity, scale }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-background">
          <svg className="hero-shape" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L100,100 Q50,80 0,100 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="container">
          <motion.div
            className="hero-content"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.h1 variants={fadeIn} className="hero-title">
              <span className="gradient-text">مرحباً بك في Syria Acadime</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="hero-subtitle">
              منصة التعليم الذكية التي تساعدك على تحقيق أقصى استفادة من دراستك
            </motion.p>
            <motion.div className="hero-buttons" variants={fadeIn}>
              <Link to="/register" className="btn btn-primary pulse-animation">
                ابدأ الآن
              </Link>
              <Link to="/exams" className="btn btn-secondary hover-effect">
                الاختبارات
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section with 3D Cards */}
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
            <motion.div className="feature-card" variants={fadeIn} whileHover={{ scale: 1.05 }}>
              <div className="feature-icon">
                <svg className="feature-svg" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3>بنك الأسئلة الذكي</h3>
              <p>أسئلة متنوعة مصنفة حسب المادة والمستوى والصعوبة</p>
            </motion.div>
            <motion.div className="feature-card" variants={fadeIn} whileHover={{ scale: 1.05 }}>
              <div className="feature-icon">
                <svg className="feature-svg" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h3>دروس مصغرة</h3>
              <p>فيديوهات تعليمية قصيرة مع ملخصات قابلة للتنزيل</p>
            </motion.div>
            <motion.div className="feature-card" variants={fadeIn} whileHover={{ scale: 1.05 }}>
              <div className="feature-icon">
                <svg className="feature-svg" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2V9h-2V7h4v10z" />
                </svg>
              </div>
              <h3>تعلم تكيفي</h3>
              <p>تحديد نقاط الضعف وتقديم دروس مخصصة</p>
            </motion.div>
            <motion.div className="feature-card" variants={fadeIn} whileHover={{ scale: 1.05 }}>
              <div className="feature-icon">
                <svg className="feature-svg" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2V9h-2V7h4v10z" />
                </svg>
              </div>
              <h3>اختبارات محاكاة</h3>
              <p>امتحانات تجريبية مع تقارير أداء مفصلة</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section with Animated Numbers */}
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
            <motion.div className="stat-card" variants={fadeIn} whileHover={{ scale: 1.1 }}>
              <motion.h3
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                +1000
              </motion.h3>
              <p>درس تعليمي</p>
            </motion.div>
            <motion.div className="stat-card" variants={fadeIn} whileHover={{ scale: 1.1 }}>
              <motion.h3
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                +5000
              </motion.h3>
              <p>سؤال في بنك الأسئلة</p>
            </motion.div>
            <motion.div className="stat-card" variants={fadeIn} whileHover={{ scale: 1.1 }}>
              <motion.h3
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                +10000
              </motion.h3>
              <p>طالب مسجل</p>
            </motion.div>
            <motion.div className="stat-card" variants={fadeIn} whileHover={{ scale: 1.1 }}>
              <motion.h3
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                +200
              </motion.h3>
              <p>معلم متخصص</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
