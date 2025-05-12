import React from 'react';
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
            <li><a href="/">الرئيسية</a></li>
            <li><a href="/forum">المنتدى</a></li>
            <li><a href="/learning">المحتوى التعليمي</a></li>
            <li><a href="/courses">الدورات</a></li>
            <li><a href="/about">عن المنصة</a></li>
            <li><a href="/contact">اتصل بنا</a></li>
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