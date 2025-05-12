import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import TeacherSidebar from '../../components/teacher/TeacherSidebar';
import SmartDataGrid from '../../components/common/SmartDataGrid';
import '../../styles/TeacherDashboard.css';

const TeacherDashboard = () => {
  const { isDarkMode } = useTheme();
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    totalEarnings: 0,
    pendingReviews: 0
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data from the server
    const fetchDashboardData = async () => {
      try {
        // Mock data - replace with actual API calls
        setStats({
          totalStudents: 150,
          activeCourses: 8,
          totalEarnings: 2500,
          pendingReviews: 12
        });

        setRecentStudents([
          { id: 1, name: 'أحمد محمد', course: 'الرياضيات', progress: 75 },
          { id: 2, name: 'سارة أحمد', course: 'الفيزياء', progress: 60 },
          { id: 3, name: 'محمد علي', course: 'الكيمياء', progress: 85 }
        ]);

        setRecentCourses([
          { id: 1, title: 'الرياضيات المتقدمة', students: 25, rating: 4.8 },
          { id: 2, title: 'الفيزياء النووية', students: 18, rating: 4.6 },
          { id: 3, title: 'الكيمياء العضوية', students: 30, rating: 4.9 }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const studentColumns = [
    { field: 'name', headerName: 'اسم الطالب', flex: 1 },
    { field: 'course', headerName: 'المادة', flex: 1 },
    {
      field: 'progress',
      headerName: 'التقدم',
      flex: 1,
      renderCell: (params) => (
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${params.value}%` }}
          />
          <span>{params.value}%</span>
        </div>
      )
    }
  ];

  const courseColumns = [
    { field: 'title', headerName: 'اسم المادة', flex: 1 },
    { field: 'students', headerName: 'عدد الطلاب', flex: 1 },
    {
      field: 'rating',
      headerName: 'التقييم',
      flex: 1,
      renderCell: (params) => (
        <div className="rating">
          <span className="stars">★★★★★</span>
          <span className="rating-value">{params.value}</span>
        </div>
      )
    }
  ];

  return (
    <div className={`teacher-dashboard ${isDarkMode ? 'dark' : ''}`}>
      <TeacherSidebar />
      <div className="dashboard-content">
        <header>
          <h1>لوحة التحكم</h1>
          <div className="date">اليوم: {new Date().toLocaleDateString('ar-SA')}</div>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>إجمالي الطلاب</h3>
              <p>{stats.totalStudents}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-info">
              <h3>المواد النشطة</h3>
              <p>{stats.activeCourses}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>إجمالي الأرباح</h3>
              <p>${stats.totalEarnings}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <h3>التقييمات المعلقة</h3>
              <p>{stats.pendingReviews}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="recent-students">
            <h2>الطلاب الجدد</h2>
            <SmartDataGrid
              rows={recentStudents}
              columns={studentColumns}
              loading={loading}
              pageSize={5}
            />
          </div>

          <div className="recent-courses">
            <h2>المواد الأخيرة</h2>
            <SmartDataGrid
              rows={recentCourses}
              columns={courseColumns}
              loading={loading}
              pageSize={5}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard; 