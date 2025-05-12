import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/Courses.css';

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'جميع الدورات' },
    { id: 'math', name: 'الرياضيات' },
    { id: 'science', name: 'العلوم' },
    { id: 'arabic', name: 'اللغة العربية' },
    { id: 'english', name: 'اللغة الإنجليزية' }
  ];

  const courses = [
    { id: 1, title: 'الرياضيات المتقدمة', teacher: 'أ. سامر', description: 'دورة شاملة في الرياضيات للمرحلة الثانوية.' },
    { id: 2, title: 'الفيزياء النووية', teacher: 'أ. ليلى', description: 'مفاهيم الفيزياء النووية والتطبيقات العملية.' },
    { id: 3, title: 'اللغة الإنجليزية', teacher: 'أ. أحمد', description: 'تطوير مهارات اللغة الإنجليزية لجميع المستويات.' }
  ];

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  return (
    <div className="courses-page">
      <motion.section 
        className="courses-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            استكشف دوراتنا التعليمية
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            اختر من بين مجموعة متنوعة من الدورات عالية الجودة
          </motion.p>
        </div>
      </motion.section>

      <section className="courses-content">
        <div className="container">
          <motion.div 
            className="categories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </motion.div>

          <motion.div 
            className="courses-list"
            initial="initial"
            animate="animate"
            variants={{
              animate: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {filteredCourses.map(course => (
              <motion.div 
                key={course.id}
                className="course-card"
                variants={fadeIn}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <h2>{course.title}</h2>
                <p>{course.description}</p>
                <div>المعلم: {course.teacher}</div>
                <button className="btn btn-primary">استكشاف</button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Courses; 