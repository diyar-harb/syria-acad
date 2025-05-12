import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import { subjects, exams, courses } from '../data/mockData';
import logo from '../styles/img/logo.png';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // التحقق من حالة تسجيل الدخول
    const userType = localStorage.getItem('userType');
    const loggedIn = localStorage.getItem('isLoggedIn');
    
    if (loggedIn !== 'true' || userType !== 'parent') {
      navigate('/login');
    } else {
      setIsLoggedIn(true);
    }
  }, [navigate]);

  if (!isLoggedIn) {
    return null; // أو يمكنك إظهار شاشة تحميل
  }

  const children = [
    {
      id: 1,
      name: 'أحمد',
      grade: 'الحادي عشر',
      progress: 75,
      lastActive: 'اليوم',
      subjects: subjects.map(subject => ({
        name: subject.name,
        progress: Math.floor(Math.random() * 30) + 70, // 70-100
        score: Math.floor(Math.random() * 20) + 75 // 75-95
      }))
    },
    {
      id: 2,
      name: 'سارة',
      grade: 'الحادي عشر',
      progress: 85,
      lastActive: 'أمس',
      subjects: subjects.map(subject => ({
        name: subject.name,
        progress: Math.floor(Math.random() * 30) + 70,
        score: Math.floor(Math.random() * 20) + 75
      }))
    }
  ];

  const upcomingExams = exams.map(exam => ({
    ...exam,
    studentName: Math.random() > 0.5 ? 'أحمد' : 'سارة'
  }));

  const renderContent = () => {
    switch (activeTab) {
      case 'progress':
        return (
          <div className="detailed-progress">
            {children.map(child => (
              <motion.div 
                key={child.id}
                className="progress-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2>{child.name} - تفاصيل التقدم</h2>
                <div className="subjects-progress-detailed">
                  {child.subjects.map((subject, index) => (
                    <div key={index} className="subject-progress-item">
                      <h3>{subject.name}</h3>
                      <div className="progress-details">
                        <div className="progress-stat">
                          <span>نسبة الإنجاز</span>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill"
                              style={{ width: `${subject.progress}%` }}
                            ></div>
                          </div>
                          <span>{subject.progress}%</span>
                        </div>
                        <div className="progress-stat">
                          <span>متوسط الدرجات</span>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill"
                              style={{ width: `${subject.score}%` }}
                            ></div>
                          </div>
                          <span>{subject.score}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'exams':
        return (
          <div className="upcoming-exams">
            <h2>الاختبارات القادمة</h2>
            <div className="exams-grid">
              {upcomingExams.map(exam => (
                <motion.div 
                  key={exam.id}
                  className="exam-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3>{exam.title}</h3>
                  <div className="exam-info">
                    <p>الطالب: {exam.studentName}</p>
                    <p>المادة: {exam.subject}</p>
                    <p>التاريخ: {exam.date}</p>
                    <p>المدة: {exam.duration} دقيقة</p>
                    <p>الدرجة الكلية: {exam.totalMarks}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="available-courses">
            <h2>الدورات المتاحة</h2>
            <div className="courses-grid">
              {courses.map(course => (
                <motion.div 
                  key={course.id}
                  className="course-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3>{course.title}</h3>
                  <div className="course-info">
                    <p>المدرس: {course.instructor}</p>
                    <p>المدة: {course.duration}</p>
                    <p>عدد الدروس: {course.lessons.length}</p>
                    <p className="price">{course.price}</p>
                  </div>
                  <button className="btn btn-primary">تسجيل الطلاب</button>
                </motion.div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <>
            {children.map(child => (
              <motion.div 
                key={child.id}
                className="student-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="student-header">
                  <h2>{child.name}</h2>
                  <span className="grade">{child.grade}</span>
                  <span className="last-active">آخر نشاط: {child.lastActive}</span>
                </div>

                <div className="progress-section">
                  <div className="overall-progress">
                    <h3>التقدم الكلي</h3>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${child.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{child.progress}%</span>
                  </div>

                  <div className="subjects-progress">
                    <h3>التقدم في المواد</h3>
                    {child.subjects.map((subject, index) => (
                      <div key={index} className="subject-item">
                        <div className="subject-header">
                          <span className="subject-name">{subject.name}</span>
                          <span className="subject-score">{subject.score}%</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${subject.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </>
        );
    }
  };

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="logo-container">
          <img src={logo} alt="Syria Acadime Logo" className="dashboard-logo" />
        </div>
        <nav className="dashboard-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            نظرة عامة
          </button>
          <button 
            className={`nav-item ${activeTab === 'progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('progress')}
          >
            تفاصيل التقدم
          </button>
          <button 
            className={`nav-item ${activeTab === 'exams' ? 'active' : ''}`}
            onClick={() => setActiveTab('exams')}
          >
            الاختبارات
          </button>
          <button 
            className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            الدورات المتاحة
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>مرحباً بك في لوحة تحكم ولي الأمر</h1>
        </header>

        <div className="dashboard-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard; 