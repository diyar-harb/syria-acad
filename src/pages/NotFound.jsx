import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import '../styles/NotFound.css';

function NotFound() {
  const { theme } = useTheme();

  return (
    <div className={`not-found ${theme}`}>
      <div className="not-found-content">
        <h1>404</h1>
        <h2>الصفحة غير موجودة</h2>
        <p>عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.</p>
        <Link to="/" className="home-button">
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}

export default NotFound; 