import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/admin/Dashboard.css';

// مكونات لوحة التحكم
import DashboardStats from '../../components/admin/DashboardStats';
import UserActivityChart from '../../components/admin/UserActivityChart';
import RevenueChart from '../../components/admin/RevenueChart';
import RecentActivity from '../../components/admin/RecentActivity';

function Dashboard() {
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeCourses: 0,
    monthlyRevenue: 0,
    activeTeachers: 0
  });

  useEffect(() => {
    // محاكاة جلب البيانات من الخادم
    const fetchDashboardData = async () => {
      try {
        // في التطبيق الحقيقي، هذا سيكون طلب API
        const mockData = {
          totalUsers: 1250,
          activeCourses: 45,
          monthlyRevenue: 15000,
          activeTeachers: 35
        };
        setStats(mockData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className={`admin-dashboard ${theme}`}>
      <div className="dashboard-header">
        <h1>لوحة التحكم</h1>
        <div className="dashboard-actions">
          <button className="refresh-btn">
            <i className="fas fa-sync-alt" /> تحديث البيانات
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="stats-grid">
          <DashboardStats stats={stats} />
        </div>

        <div className="charts-grid">
          <div className="chart-container">
            <h2>نشاط المستخدمين</h2>
            <UserActivityChart />
          </div>
          <div className="chart-container">
            <h2>الإيرادات الشهرية</h2>
            <RevenueChart />
          </div>
        </div>

        <div className="recent-activity">
          <h2>النشاطات الأخيرة</h2>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 