import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import SmartDataGrid from '../../components/SmartDataGrid';
import '../../styles/admin/ContentManagement.css';

function ContentManagement() {
  const { theme } = useTheme();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    level: 'all'
  });

  useEffect(() => {
    // محاكاة جلب البيانات من الخادم
    const fetchContent = async () => {
      try {
        // في التطبيق الحقيقي، هذا سيكون طلب API
        const mockContent = [
          {
            id: 1,
            title: 'الرياضيات المتقدمة',
            category: 'الرياضيات',
            level: 'متقدم',
            status: 'منشور',
            teacher: 'د. أحمد محمد',
            students: 150,
            rating: 4.8
          },
          {
            id: 2,
            title: 'الفيزياء الأساسية',
            category: 'الفيزياء',
            level: 'مبتدئ',
            status: 'قيد المراجعة',
            teacher: 'د. سارة أحمد',
            students: 85,
            rating: 4.5
          },
          // ... المزيد من المحتوى
        ];
        setContent(mockContent);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching content:', error);
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const columns = {
    courses: [
      { key: 'title', label: 'عنوان الدورة' },
      { key: 'category', label: 'التصنيف' },
      { key: 'level', label: 'المستوى' },
      { key: 'status', label: 'الحالة' },
      { key: 'teacher', label: 'المدرس' },
      { 
        key: 'students', 
        label: 'عدد الطلاب',
        render: (item) => `${item.students} طالب`
      },
      { 
        key: 'rating', 
        label: 'التقييم',
        render: (item) => `${item.rating} / 5`
      },
      {
        key: 'actions',
        label: 'الإجراءات',
        render: (item) => (
          <div className="actions">
            <button 
              className="action-button preview"
              title="معاينة"
              onClick={() => handlePreview(item.id)}
            >
              <i className="fas fa-eye" />
            </button>
            <button 
              className="action-button edit"
              title="تعديل"
              onClick={() => handleEdit(item.id)}
            >
              <i className="fas fa-edit" />
            </button>
            <button 
              className="action-button delete"
              title="حذف"
              onClick={() => handleDelete(item.id)}
            >
              <i className="fas fa-trash" />
            </button>
          </div>
        ),
      },
    ],
    exams: [
      { key: 'title', label: 'عنوان الاختبار' },
      { key: 'subject', label: 'المادة' },
      { key: 'duration', label: 'المدة' },
      { key: 'questions', label: 'عدد الأسئلة' },
      { key: 'status', label: 'الحالة' },
      {
        key: 'actions',
        label: 'الإجراءات',
        render: (item) => (
          <div className="actions">
            <button 
              className="action-button preview"
              title="معاينة"
              onClick={() => handlePreviewExam(item.id)}
            >
              <i className="fas fa-eye" />
            </button>
            <button 
              className="action-button edit"
              title="تعديل"
              onClick={() => handleEditExam(item.id)}
            >
              <i className="fas fa-edit" />
            </button>
          </div>
        ),
      },
    ]
  };

  const handlePreview = (id) => {
    // معالجة معاينة المحتوى
    console.log('Preview content:', id);
  };

  const handleEdit = (id) => {
    // معالجة تعديل المحتوى
    console.log('Edit content:', id);
  };

  const handleDelete = (id) => {
    // معالجة حذف المحتوى
    console.log('Delete content:', id);
  };

  const handlePreviewExam = (id) => {
    // معالجة معاينة الاختبار
    console.log('Preview exam:', id);
  };

  const handleEditExam = (id) => {
    // معالجة تعديل الاختبار
    console.log('Edit exam:', id);
  };

  return (
    <div className={`admin-layout ${theme}`}>
      <AdminSidebar />
      <div className="admin-content">
        <div className="page-header">
          <h1>إدارة المحتوى</h1>
          <div className="header-actions">
            <button className="add-content">
              <i className="fas fa-plus" /> إضافة محتوى جديد
            </button>
          </div>
        </div>

        <div className="content-tabs">
          <button 
            className={`tab-button ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            الدورات
          </button>
          <button 
            className={`tab-button ${activeTab === 'exams' ? 'active' : ''}`}
            onClick={() => setActiveTab('exams')}
          >
            الاختبارات
          </button>
        </div>

        <div className="filters-section">
          <div className="filter-group">
            <label>التصنيف:</label>
            <select 
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              <option value="all">الكل</option>
              <option value="math">الرياضيات</option>
              <option value="physics">الفيزياء</option>
              <option value="chemistry">الكيمياء</option>
            </select>
          </div>

          <div className="filter-group">
            <label>الحالة:</label>
            <select 
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">الكل</option>
              <option value="published">منشور</option>
              <option value="pending">قيد المراجعة</option>
              <option value="draft">مسودة</option>
            </select>
          </div>

          <div className="filter-group">
            <label>المستوى:</label>
            <select 
              value={filters.level}
              onChange={(e) => setFilters({...filters, level: e.target.value})}
            >
              <option value="all">الكل</option>
              <option value="beginner">مبتدئ</option>
              <option value="intermediate">متوسط</option>
              <option value="advanced">متقدم</option>
            </select>
          </div>
        </div>

        <SmartDataGrid
          data={content}
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

export default ContentManagement; 