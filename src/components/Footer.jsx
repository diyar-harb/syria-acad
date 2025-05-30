import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Syria Acadime</h3>
          <p>منصة تعليمية متكاملة للطلاب والمعلمين وأولياء الأمور</p>
        </div>
        <div className="footer-section">
          <h3>روابط سريعة</h3>
          <ul>
            <li><Link to="/">الرئيسية</Link></li>
            <li><Link to="/forum">المنتدى</Link></li>
            <li><Link to="/learning">المحتوى التعليمي</Link></li>
            <li><Link to="/courses">الدورات</Link></li>
            <li><Link to="/about">عن المنصة</Link></li>
            <li><Link to="/contact">اتصل بنا</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>تواصل معنا</h3>
          <p>البريد الإلكتروني: info@syriaacadime.com</p>
          <p>الهاتف: +963 123 456 789</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Syria Acadime. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
};

export default Footer; 