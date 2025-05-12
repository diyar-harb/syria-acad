import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ParentSidebar from '../../components/parent/ParentSidebar';
import SmartDataGrid from '../../components/SmartDataGrid';
import '../../styles/parent/ParentDashboard.css';

function ParentDashboard() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // محاكاة جلب بيانات الطلاب
    const fetchStudents = async () => {
      try {
        // في التطبيق الحقيقي، هذا سيكون طلب API
        const mockStudents = [
          {
            id: 1,
            name: 'أحمد محمد',
            grade: 'الصف العاشر',
            attendance: 95,
            average: 85,
            subjects: [
              { name: 'الرياضيات', grade: 90, trend: 'up' },
              { name: 'العلوم', grade: 85, trend: 'stable' },
              { name: 'اللغة العربية', grade: 80, trend: 'down' }
            ]
          }
        ];
        setStudents(mockStudents);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const columns = {
    overview: [
      { key: 'name', label: 'اسم الطالب' },
      { key: 'grade', label: 'الصف' },
      { 
        key: 'attendance', 
        label: 'معدل الحضور',
        render: (item) => `${item.attendance}%`
      },
      { 
        key: 'average', 
        label: 'المتوسط العام',
        render: (item) => `${item.average}%`
      },
      {
        key: 'actions',
        label: 'الإجراءات',
        render: (item) => (
          <div className="actions">
            <button 
              className="action-button view"
              title="عرض التفاصيل"
              onClick={() => handleViewDetails(item.id)}
            >
              <i className="fas fa-eye" />
            </button>
            <button 
              className="action-button message"
              title="مراسلة المدرسين"
              onClick={() => handleMessageTeachers(item.id)}
            >
              <i className="fas fa-envelope" />
            </button>
          </div>
        ),
      },
    ],
    performance: [
      { key: 'subject', label: 'المادة' },
      { key: 'grade', label: 'الدرجة' },
      { 
        key: 'trend', 
        label: 'التوجه',
        render: (item) => (
          <span className={`trend ${item.trend}`}>
            {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'}
          </span>
        )
      },
      { key: 'comments', label: 'ملاحظات المدرس' }
    ]
  };

  const handleViewDetails = (studentId) => {
    // معالجة عرض تفاصيل الطالب
    console.log('View student details:', studentId);
  };

  const handleMessageTeachers = (studentId) => {
    // معالجة مراسلة المدرسين
    console.log('Message teachers for student:', studentId);
  };

  return (
    <div className={`parent-dashboard ${theme}`}>
      <ParentSidebar />
      <div className="dashboard-content">
        <div className="page-header">
          <h1>لوحة تحكم ولي الأمر</h1>
          <div className="header-actions">
            <button className="export-report">
              <i className="fas fa-file-export" /> تصدير التقرير
            </button>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            نظرة عامة
          </button>
          <button 
            className={`tab-button ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            الأداء الأكاديمي
          </button>
          <button 
            className={`tab-button ${activeTab === 'behavior' ? 'active' : ''}`}
            onClick={() => setActiveTab('behavior')}
          >
            السلوك والمشاركة
          </button>
          <button 
            className={`tab-button ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            المراسلات
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="summary-cards">
              <div className="summary-card">
                <h3>معدل الحضور</h3>
                <p className="amount">95%</p>
                <p className="change positive">+5% عن الشهر الماضي</p>
              </div>
              <div className="summary-card">
                <h3>المتوسط العام</h3>
                <p className="amount">85%</p>
                <p className="change stable">مستقر</p>
              </div>
              <div className="summary-card">
                <h3>الواجبات المعلقة</h3>
                <p className="amount">3</p>
                <p className="change negative">+1 عن الأسبوع الماضي</p>
              </div>
            </div>

            <div className="notifications">
              <h2>الإشعارات المهمة</h2>
              <div className="notification-list">
                <div className="notification">
                  <i className="fas fa-bell" />
                  <div className="notification-content">
                    <h4>اختبار الرياضيات</h4>
                    <p>موعد الاختبار: 15 أبريل 2024</p>
                  </div>
                </div>
                <div className="notification">
                  <i className="fas fa-book" />
                  <div className="notification-content">
                    <h4>واجب منزلي جديد</h4>
                    <p>مادة العلوم - موعد التسليم: 10 أبريل 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <SmartDataGrid
          data={activeTab === 'overview' ? students : students[0]?.subjects || []}
          columns={columns[activeTab]}
          loading={loading}
          pageSize={10}
          sortable={true}
          filterable={true}
        />
      </div>
    </div>
  );
}

export default ParentDashboard; 