import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/parent/ParentSidebar.css';

function ParentSidebar() {
  const { theme } = useTheme();

  const menuItems = [
    {
      title: 'لوحة التحكم',
      path: '/parent/dashboard',
      icon: 'fas fa-tachometer-alt'
    },
    {
      title: 'الأداء الأكاديمي',
      path: '/parent/performance',
      icon: 'fas fa-chart-line'
    },
    {
      title: 'السلوك والمشاركة',
      path: '/parent/behavior',
      icon: 'fas fa-users'
    },
    {
      title: 'المراسلات',
      path: '/parent/messages',
      icon: 'fas fa-envelope'
    },
    {
      title: 'التقارير',
      path: '/parent/reports',
      icon: 'fas fa-file-alt'
    },
    {
      title: 'الدفع والمشتريات',
      path: '/parent/payments',
      icon: 'fas fa-money-bill-wave'
    },
    {
      title: 'الإعدادات',
      path: '/parent/settings',
      icon: 'fas fa-cog'
    }
  ];

  return (
    <div className={`parent-sidebar ${theme}`}>
      <div className="sidebar-header">
        <h2>ولي الأمر</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <i className={item.icon} />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="student-info">
          <h3>الطلاب المرتبطين</h3>
          <div className="student-list">
            <div className="student-item">
              <i className="fas fa-user-graduate" />
              <span>أحمد محمد</span>
            </div>
            <div className="student-item">
              <i className="fas fa-user-graduate" />
              <span>سارة أحمد</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParentSidebar; 