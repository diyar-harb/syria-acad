import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/admin/AdminSidebar.css';

function AdminSidebar() {
  const { theme } = useTheme();

  const menuItems = [
    {
      title: 'لوحة التحكم',
      path: '/admin/dashboard',
      icon: 'fas fa-tachometer-alt'
    },
    {
      title: 'إدارة المستخدمين',
      path: '/admin/users',
      icon: 'fas fa-users'
    },
    {
      title: 'إدارة المحتوى',
      path: '/admin/content',
      icon: 'fas fa-book'
    },
    {
      title: 'النظام المالي',
      path: '/admin/finance',
      icon: 'fas fa-money-bill-wave'
    },
    {
      title: 'إدارة الأكواد',
      path: '/admin/codes',
      icon: 'fas fa-key'
    },
    {
      title: 'التقارير',
      path: '/admin/reports',
      icon: 'fas fa-chart-bar'
    },
    {
      title: 'إعدادات النظام',
      path: '/admin/settings',
      icon: 'fas fa-cog'
    },
    {
      title: 'الدعم الفني',
      path: '/admin/support',
      icon: 'fas fa-headset'
    }
  ];

  return (
    <div className={`admin-sidebar ${theme}`}>
      <div className="sidebar-header">
        <h2>لوحة التحكم</h2>
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
    </div>
  );
}

export default AdminSidebar; 