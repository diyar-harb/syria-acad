import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaRegComment, FaRegHeart, FaShare } from 'react-icons/fa';
import '../styles/Forum.css';

const Forum = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'جميع المواضيع' },
    { id: 'math', name: 'الرياضيات' },
    { id: 'physics', name: 'الفيزياء' },
    { id: 'general', name: 'مواضيع عامة' },
    { id: 'homework', name: 'الواجبات المنزلية' }
  ];

  const discussions = [
    {
      id: 1,
      title: 'كيف يمكنني فهم التكامل بشكل أفضل؟',
      author: 'محمد أحمد',
      category: 'math',
      content: 'أواجه صعوبة في فهم مفهوم التكامل وتطبيقاته...',
      likes: 24,
      comments: 8,
      date: '2024-03-15',
      tags: ['تفاضل وتكامل', 'رياضيات متقدمة'],
      solved: true
    },
    {
      id: 2,
      title: 'مسألة في قوانين نيوتن للحركة',
      author: 'سارة محمود',
      category: 'physics',
      content: 'عندي سؤال حول تطبيق القانون الثاني لنيوتن...',
      likes: 15,
      comments: 12,
      date: '2024-03-14',
      tags: ['ميكانيكا', 'قوانين نيوتن'],
      solved: false
    }
  ];

  const filterDiscussions = () => {
    return discussions.filter(discussion => {
      const matchesCategory = activeCategory === 'all' || discussion.category === activeCategory;
      const matchesSearch = discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          discussion.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  return (
    <div className="forum-container">
      <motion.div 
        className="forum-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>المنتدى التعليمي</h1>
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="ابحث في المنتدى..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="btn btn-primary create-post-btn">
          إنشاء موضوع جديد
        </button>
      </motion.div>

      <div className="forum-content">
        <motion.div 
          className="categories-list"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        <motion.div 
          className="discussions-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {filterDiscussions().map(discussion => (
            <motion.div
              key={discussion.id}
              className="discussion-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="discussion-header">
                <h3>{discussion.title}</h3>
                {discussion.solved && (
                  <span className="solved-badge">تم الحل</span>
                )}
              </div>
              
              <div className="discussion-meta">
                <span className="author">{discussion.author}</span>
                <span className="date">{discussion.date}</span>
              </div>

              <p className="discussion-preview">{discussion.content}</p>

              <div className="tags-list">
                {discussion.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>

              <div className="discussion-actions">
                <button className="action-btn">
                  <FaRegHeart />
                  <span>{discussion.likes}</span>
                </button>
                <button className="action-btn">
                  <FaRegComment />
                  <span>{discussion.comments}</span>
                </button>
                <button className="action-btn">
                  <FaShare />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="forum-sidebar">
          <div className="trending-topics">
            <h3>المواضيع الرائجة</h3>
            <ul>
              <li>
                <span className="trend-number">#1</span>
                <span className="trend-title">أساسيات التفاضل</span>
              </li>
              <li>
                <span className="trend-number">#2</span>
                <span className="trend-title">قوانين نيوتن</span>
              </li>
              <li>
                <span className="trend-number">#3</span>
                <span className="trend-title">المتجهات</span>
              </li>
            </ul>
          </div>

          <div className="top-contributors">
            <h3>أفضل المساهمين</h3>
            <ul>
              <li>
                <img src="/img/avatar1.jpg" alt="المساهم" className="contributor-avatar" />
                <div className="contributor-info">
                  <span className="contributor-name">د. أحمد محمد</span>
                  <span className="contribution-count">45 مساهمة</span>
                </div>
              </li>
              <li>
                <img src="/img/avatar2.jpg" alt="المساهم" className="contributor-avatar" />
                <div className="contributor-info">
                  <span className="contributor-name">د. سارة أحمد</span>
                  <span className="contribution-count">38 مساهمة</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum; 