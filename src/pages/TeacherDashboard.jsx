import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import logo from '../styles/img/logo.png';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const teacherName = localStorage.getItem('teacherName');

  useEffect(() => {
    // التحقق من حالة تسجيل الدخول
    const userType = localStorage.getItem('userType');
    const loggedIn = localStorage.getItem('isLoggedIn');
    
    if (loggedIn !== 'true' || userType !== 'teacher') {
      navigate('/login');
    } else {
      setIsLoggedIn(true);
    }
  }, [navigate]);

  if (!isLoggedIn) {
    return null; // أو يمكنك إظهار شاشة تحميل
  }

  const stats = {
    totalStudents: 120,
    activeClasses: 5,
    totalQuestions: 250,
    averageScore: 85
  };

  const recentActivities = [
    { id: 1, type: 'question', text: 'تم إضافة 10 أسئلة جديدة في مادة الرياضيات', time: 'منذ ساعتين' },
    { id: 2, type: 'class', text: 'تم إنشاء فصل جديد: الفيزياء للصف العاشر', time: 'منذ 3 ساعات' },
    { id: 3, type: 'exam', text: 'تم تصحيح اختبار نصف الفصل', time: 'منذ 5 ساعات' }
  ];

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
            className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            الطلاب
          </button>
          <button 
            className={`nav-item ${activeTab === 'questions' ? 'active' : ''}`}
            onClick={() => setActiveTab('questions')}
          >
            بنك الأسئلة
          </button>
          <button 
            className={`nav-item ${activeTab === 'exams' ? 'active' : ''}`}
            onClick={() => setActiveTab('exams')}
          >
            الاختبارات
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>مرحباً بك، أستاذ {teacherName || 'وليد'}</h1>
          <div className="header-actions">
            <button className="btn btn-secondary">الإعدادات</button>
            <button className="btn btn-primary">إضافة درس جديد</button>
          </div>
        </header>

        <div className="dashboard-content">
          <motion.div 
            className="stats-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="stat-card">
              <h3>{stats.totalStudents}</h3>
              <p>إجمالي الطلاب</p>
            </div>
            <div className="stat-card">
              <h3>{stats.activeClasses}</h3>
              <p>الفصول النشطة</p>
            </div>
            <div className="stat-card">
              <h3>{stats.totalQuestions}</h3>
              <p>عدد الأسئلة</p>
            </div>
            <div className="stat-card">
              <h3>{stats.averageScore}%</h3>
              <p>متوسط الدرجات</p>
            </div>
          </motion.div>

          <motion.div 
            className="recent-activities"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2>النشاطات الأخيرة</h2>
            <div className="activities-list">
              {recentActivities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-icon ${activity.type}`}></div>
                  <div className="activity-content">
                    <p>{activity.text}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard; 