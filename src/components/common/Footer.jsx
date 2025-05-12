import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import '../styles/Footer.css';

function Footer() {
  const { theme } = useTheme();

  return (
    <footer className={`footer ${theme}`}>
      <div className="footer-content">
        <div className="footer-section">
          <h3>عن الموقع</h3>
          <p>منصة تعليمية متكاملة تهدف إلى تقديم تجربة تعليمية فريدة ومتميزة للطلاب والمعلمين.</p>
        </div>

        <div className="footer-section">
          <h3>روابط سريعة</h3>
          <ul>
            <li><Link to="/courses">الدورات</Link></li>
            <li><Link to="/teachers">المعلمين</Link></li>
            <li><Link to="/about">عن الموقع</Link></li>
            <li><Link to="/contact">اتصل بنا</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>تواصل معنا</h3>
          <ul>
            <li>البريد الإلكتروني: info@edumastery.com</li>
            <li>الهاتف: +963 123 456 789</li>
            <li>العنوان: دمشق، سوريا</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>تابعنا</h3>
          <div className="social-links">
            <a href="#" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} EduMastery. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
}

export default Footer; 