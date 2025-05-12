import React from 'react';
import '../../styles/admin/RecentActivity.css';

function RecentActivity() {
  // بيانات نموذجية للنشاطات
  const activities = [
    {
      id: 1,
      type: 'user',
      action: 'تسجيل جديد',
      user: 'أحمد محمد',
      time: 'منذ 5 دقائق',
      icon: 'fas fa-user-plus'
    },
    {
      id: 2,
      type: 'course',
      action: 'إضافة دورة جديدة',
      user: 'د. سارة أحمد',
      time: 'منذ 15 دقيقة',
      icon: 'fas fa-book'
    },
    {
      id: 3,
      type: 'payment',
      action: 'اشتراك جديد',
      user: 'محمد علي',
      time: 'منذ 30 دقيقة',
      icon: 'fas fa-credit-card'
    },
    {
      id: 4,
      type: 'exam',
      action: 'إكمال اختبار',
      user: 'نورا خالد',
      time: 'منذ ساعة',
      icon: 'fas fa-clipboard-check'
    }
  ];

  const getActivityColor = (type) => {
    switch (type) {
      case 'user':
        return 'var(--primary-color)';
      case 'course':
        return 'var(--success-color)';
      case 'payment':
        return 'var(--warning-color)';
      case 'exam':
        return 'var(--info-color)';
      default:
        return 'var(--text-secondary)';
    }
  };

  return (
    <div className="recent-activity-list">
      {activities.map(activity => (
        <div key={activity.id} className="activity-item">
          <div 
            className="activity-icon"
            style={{ backgroundColor: getActivityColor(activity.type) }}
          >
            <i className={activity.icon} />
          </div>
          <div className="activity-details">
            <div className="activity-header">
              <span className="activity-action">{activity.action}</span>
              <span className="activity-time">{activity.time}</span>
            </div>
            <div className="activity-user">{activity.user}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecentActivity; 