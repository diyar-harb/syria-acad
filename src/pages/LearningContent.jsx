import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaBook, FaClipboard, FaDownload } from 'react-icons/fa';
import '../styles/LearningContent.css';
import { subjects, courses } from '../data/mockData';

const LearningContent = () => {
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [activeTab, setActiveTab] = useState('lessons');

  const subjectCourses = courses.filter(course => course.subject === selectedSubject.name);

  const resources = [
    {
      id: 1,
      title: 'ملخص التفاضل والتكامل',
      type: 'pdf',
      size: '2.5 MB',
      downloads: 234
    },
    {
      id: 2,
      title: 'تمارين محلولة - المتجهات',
      type: 'pdf',
      size: '1.8 MB',
      downloads: 156
    },
    {
      id: 3,
      title: 'شرح قوانين نيوتن',
      type: 'video',
      duration: '15:30',
      views: 789
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'lessons':
        return (
          <div className="lessons-grid">
            {subjectCourses.map(course => (
              <motion.div
                key={course.id}
                className="lesson-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="lesson-thumbnail">
                  <img src={course.image} alt={course.title} />
                  <div className="lesson-overlay">
                    <FaPlay className="play-icon" />
                  </div>
                </div>
                <div className="lesson-content">
                  <h3>{course.title}</h3>
                  <p className="instructor">المدرس: {course.instructor}</p>
                  <div className="lesson-meta">
                    <span>{course.duration}</span>
                    <span>{course.lessons.length} دروس</span>
                  </div>
                  <button className="btn btn-primary">ابدأ التعلم</button>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'resources':
        return (
          <div className="resources-list">
            {resources.map(resource => (
              <motion.div
                key={resource.id}
                className="resource-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="resource-icon">
                  {resource.type === 'pdf' ? <FaBook /> : <FaPlay />}
                </div>
                <div className="resource-content">
                  <h3>{resource.title}</h3>
                  <div className="resource-meta">
                    <span>{resource.type.toUpperCase()}</span>
                    {resource.size && <span>{resource.size}</span>}
                    {resource.duration && <span>{resource.duration}</span>}
                  </div>
                </div>
                <button className="btn btn-secondary">
                  <FaDownload />
                  <span>تحميل</span>
                </button>
              </motion.div>
            ))}
          </div>
        );

      case 'notes':
        return (
          <div className="notes-section">
            <div className="notes-header">
              <h2>ملاحظاتي</h2>
              <button className="btn btn-primary">
                <FaClipboard />
                <span>إضافة ملاحظة</span>
              </button>
            </div>
            <div className="notes-grid">
              {[1, 2, 3].map(index => (
                <motion.div
                  key={index}
                  className="note-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="note-header">
                    <span className="note-date">15 مارس 2024</span>
                    <div className="note-actions">
                      <button className="action-btn">تعديل</button>
                      <button className="action-btn">حذف</button>
                    </div>
                  </div>
                  <h3>ملاحظات حول التفاضل</h3>
                  <p>النقاط الرئيسية في درس اليوم...</p>
                  <div className="note-tags">
                    <span className="tag">التفاضل</span>
                    <span className="tag">الرياضيات</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="learning-container">
      <aside className="subjects-sidebar">
        <h2>المواد الدراسية</h2>
        <div className="subjects-list">
          {subjects.map(subject => (
            <button
              key={subject.id}
              className={`subject-btn ${selectedSubject.id === subject.id ? 'active' : ''}`}
              onClick={() => setSelectedSubject(subject)}
            >
              <img src={subject.image} alt={subject.name} className="subject-icon" />
              <span>{subject.name}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="learning-main">
        <header className="content-header">
          <div className="subject-info">
            <h1>{selectedSubject.name}</h1>
            <p>{selectedSubject.description}</p>
          </div>
          <div className="content-tabs">
            <button
              className={`tab-btn ${activeTab === 'lessons' ? 'active' : ''}`}
              onClick={() => setActiveTab('lessons')}
            >
              الدروس
            </button>
            <button
              className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
              onClick={() => setActiveTab('resources')}
            >
              الموارد
            </button>
            <button
              className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              ملاحظاتي
            </button>
          </div>
        </header>

        <div className="content-body">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default LearningContent; 