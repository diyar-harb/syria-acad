import React from 'react';
import '../../styles/admin/DashboardStats.css';

function DashboardStats({ stats }) {
  return (
    <div className="dashboard-stats">
      <div className="stat-card">
        <div className="stat-icon">
          <i className="fas fa-users" />
        </div>
        <div className="stat-info">
          <h3>إجمالي المستخدمين</h3>
          <p className="stat-value">{stats.totalUsers}</p>
          <p className="stat-change positive">+12% هذا الشهر</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <i className="fas fa-book" />
        </div>
        <div className="stat-info">
          <h3>الدورات النشطة</h3>
          <p className="stat-value">{stats.activeCourses}</p>
          <p className="stat-change positive">+5 دورات جديدة</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <i className="fas fa-dollar-sign" />
        </div>
        <div className="stat-info">
          <h3>الإيرادات الشهرية</h3>
          <p className="stat-value">${stats.monthlyRevenue}</p>
          <p className="stat-change positive">+8% عن الشهر الماضي</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <i className="fas fa-chalkboard-teacher" />
        </div>
        <div className="stat-info">
          <h3>المدرسون النشطون</h3>
          <p className="stat-value">{stats.activeTeachers}</p>
          <p className="stat-change positive">+3 مدرسين جدد</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardStats; 