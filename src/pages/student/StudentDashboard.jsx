import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import StudentSidebar from '../../components/student/StudentSidebar';
import SmartDataGrid from '../../components/common/SmartDataGrid';
import '../../styles/StudentDashboard.css';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { isDarkMode } = useTheme();
  const [stats, setStats] = useState({
    averageGrade: 0,
    activeCourses: 0,
    completedLessons: 0,
    upcomingExams: 0
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([
    { id: 1, subject: 'الرياضيات', teacher: 'أ. سامر', content: 'يرجى مراجعة واجب الدرس الأخير.', date: '2024-03-18' },
    { id: 2, subject: 'الفيزياء', teacher: 'أ. ليلى', content: 'تم تحديد موعد اختبار جديد.', date: '2024-03-19' }
  ]);
  const [newMessage, setNewMessage] = useState({ subject: '', teacher: '', content: '' });
  const [loading, setLoading] = useState(true);
  const studentName = localStorage.getItem('studentName');
  const [lessons, setLessons] = useState([
    { id: 1, subject: 'الرياضيات', title: 'المعادلات الخطية', homework: 'حل التمارين 1-5', due: '2024-03-22' },
    { id: 2, subject: 'الفيزياء', title: 'الطاقة الحركية', homework: 'تقرير عملي', due: '2024-03-24' }
  ]);
  const [reports, setReports] = useState([
    { id: 1, title: 'تقرير الأداء الفصلي', date: '2024-03-15', file: '#' },
    { id: 2, title: 'تقرير درجات منتصف الفصل', date: '2024-02-10', file: '#' }
  ]);

  useEffect(() => {
    // محاكاة جلب البيانات من الخادم
    const fetchDashboardData = async () => {
      try {
        // بيانات إحصائية وهمية
        setStats({
          averageGrade: 85,
          activeCourses: 4,
          completedLessons: 32,
          upcomingExams: 2
        });

        // دورات حديثة وهمية
        setRecentCourses([
          { id: 1, title: 'الرياضيات المتقدمة', progress: 75, nextLesson: '2024-03-20' },
          { id: 2, title: 'الفيزياء النووية', progress: 60, nextLesson: '2024-03-22' },
          { id: 3, title: 'الكيمياء العضوية', progress: 85, nextLesson: '2024-03-25' }
        ]);

        // اختبارات قادمة وهمية
        setUpcomingExams([
          { id: 1, title: 'اختبار الرياضيات النهائي', date: '2024-04-01', duration: 60 },
          { id: 2, title: 'اختبار العلوم الفصلي', date: '2024-03-25', duration: 45 }
        ]);

        // إشعارات وهمية
        setNotifications([
          { id: 1, title: 'واجب جديد', message: 'تم نشر واجب جديد في مادة الرياضيات', date: '2024-03-18' },
          { id: 2, title: 'تذكير بالاختبار', message: 'اختبار العلوم غداً الساعة 10 صباحاً', date: '2024-03-19' }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const courseColumns = [
    { field: 'title', headerName: 'اسم المادة', flex: 1 },
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
    },
    {
      field: 'nextLesson',
      headerName: 'الدرس القادم',
      flex: 1,
      renderCell: (params) => new Date(params.value).toLocaleDateString('ar-SA')
    }
  ];

  const examColumns = [
    { field: 'title', headerName: 'عنوان الاختبار', flex: 1 },
    {
      field: 'date',
      headerName: 'التاريخ',
      flex: 1,
      renderCell: (params) => new Date(params.value).toLocaleDateString('ar-SA')
    },
    {
      field: 'duration',
      headerName: 'المدة',
      flex: 1,
      renderCell: (params) => `${params.value} دقيقة`
    }
  ];

  const handleMessageChange = (e) => {
    setNewMessage({ ...newMessage, [e.target.name]: e.target.value });
  };
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.subject || !newMessage.teacher || !newMessage.content) return;
    setMessages([
      ...messages,
      { id: messages.length + 1, ...newMessage, date: new Date().toISOString().slice(0, 10) }
    ]);
    setNewMessage({ subject: '', teacher: '', content: '' });
  };

  return (
    <div className={`student-dashboard ${isDarkMode ? 'dark' : ''}`}>
      <StudentSidebar />
      <div className="dashboard-content">
        <header>
          <h1>مرحباً بك، {studentName || 'الطالب'} في لوحة التحكم</h1>
          <div className="date">اليوم: {new Date().toLocaleDateString('ar-SA')}</div>
        </header>

        {/* روابط سريعة */}
        <div className="quick-actions" style={{ marginBottom: '1.5rem', display: 'flex', gap: 12 }}>
          <Link to="/question-bank" className="btn btn-primary">بنك الأسئلة</Link>
          <Link to="/forum" className="btn btn-secondary">المنتدى</Link>
          <Link to="/exams" className="btn btn-primary">بدء اختبار جديد</Link>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>المعدل العام</h3>
              <p>{stats.averageGrade}%</p>
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
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>الدروس المكتملة</h3>
              <p>{stats.completedLessons}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <h3>الاختبارات القادمة</h3>
              <p>{stats.upcomingExams}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="recent-courses">
            <h2>المواد النشطة</h2>
            <SmartDataGrid
              rows={recentCourses}
              columns={courseColumns}
              loading={loading}
              pageSize={5}
            />
          </div>

          <div className="upcoming-exams">
            <h2>الاختبارات القادمة</h2>
            <SmartDataGrid
              rows={upcomingExams}
              columns={examColumns}
              loading={loading}
              pageSize={5}
            />
          </div>
        </div>

        <div className="notifications">
          <h2>الإشعارات</h2>
          <div className="notifications-list">
            {notifications.map(notification => (
              <div key={notification.id} className="notification-card">
                <div className="notification-header">
                  <h3>{notification.title}</h3>
                  <span className="notification-date">
                    {new Date(notification.date).toLocaleDateString('ar-SA')}
                  </span>
                </div>
                <p>{notification.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* قسم الرسائل */}
        <div className="messages-section">
          <h2>الرسائل مع المعلمين</h2>
          <form className="send-message-form" onSubmit={handleSendMessage} style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              name="subject"
              placeholder="المادة"
              value={newMessage.subject}
              onChange={handleMessageChange}
              style={{ marginLeft: 8 }}
            />
            <input
              type="text"
              name="teacher"
              placeholder="اسم المعلم"
              value={newMessage.teacher}
              onChange={handleMessageChange}
              style={{ marginLeft: 8 }}
            />
            <input
              type="text"
              name="content"
              placeholder="اكتب رسالتك..."
              value={newMessage.content}
              onChange={handleMessageChange}
              style={{ marginLeft: 8, width: 200 }}
            />
            <button type="submit" className="btn btn-primary">إرسال</button>
          </form>
          <div className="messages-list">
            {messages.map(msg => (
              <div key={msg.id} className="message-card">
                <div><b>{msg.subject}</b> - {msg.teacher}</div>
                <div>{msg.content}</div>
                <div className="message-date">{new Date(msg.date).toLocaleDateString('ar-SA')}</div>
              </div>
            ))}
          </div>
        </div>

        {/* قسم الدروس والواجبات */}
        <div className="lessons-section">
          <h2>الدروس والواجبات المنزلية</h2>
          <table className="lessons-table">
            <thead>
              <tr>
                <th>المادة</th>
                <th>عنوان الدرس</th>
                <th>الواجب المنزلي</th>
                <th>تاريخ التسليم</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map(lesson => (
                <tr key={lesson.id}>
                  <td>{lesson.subject}</td>
                  <td>{lesson.title}</td>
                  <td>{lesson.homework}</td>
                  <td>{new Date(lesson.due).toLocaleDateString('ar-SA')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* قسم التقارير */}
        <div className="reports-section">
          <h2>التقارير الأكاديمية</h2>
          <ul className="reports-list">
            {reports.map(report => (
              <li key={report.id}>
                <span>{report.title} ({new Date(report.date).toLocaleDateString('ar-SA')})</span>
                <a href={report.file} download className="btn btn-secondary" style={{ marginRight: 8 }}>تحميل</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 