import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import '../styles/Header.css';
import logo from '../styles/img/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userType = localStorage.getItem('userType');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    navigate('/login');
    closeMenu();
  };

  const handleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClick = () => setIsDropdownOpen(false);
    if (isDropdownOpen) {
      window.addEventListener('click', handleClick);
    }
    return () => window.removeEventListener('click', handleClick);
  }, [isDropdownOpen]);

  return (
    <header className={`header ${theme}`}>
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/" onClick={closeMenu}>
              <img src={logo} alt="Syria Acadime Logo" className="logo-img" />
            </Link>
          </div>

          <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
            <ul>
              <li><Link to="/" onClick={closeMenu}>الرئيسية</Link></li>
              <li><Link to="/teachers" onClick={closeMenu}>المعلمين</Link></li>
              <li><Link to="/question-bank" onClick={closeMenu}>بنك الأسئلة</Link></li>
              <li><Link to="/exams" onClick={closeMenu}>الاختبارات</Link></li>
              <li><Link to="/forum" onClick={closeMenu}>المنتدى</Link></li>
              {/* Mobile actions */}
              <li className="mobile-actions">
                {!isLoggedIn && (
                  <>
                    <div className="dropdown" onClick={handleDropdown}>
                      <button className="btn btn-primary dropdown-toggle" type="button">
                        إنشاء حساب جديد <i className="fas fa-caret-down"></i>
                      </button>
                      {isDropdownOpen && (
                        <div className="dropdown-menu show">
                          <Link to="/student-signup" className="dropdown-item" onClick={closeMenu}>كطالب</Link>
                          <Link to="/teacher-signup" className="dropdown-item" onClick={closeMenu}>كمدرس</Link>
                          <Link to="/parent-signup" className="dropdown-item" onClick={closeMenu}>كولي أمر</Link>
                        </div>
                      )}
                    </div>
                    <Link to="/login" className="btn btn-secondary login-btn" onClick={closeMenu}>تسجيل الدخول</Link>
                  </>
                )}
                {isLoggedIn && (
                  <>
                    <Link to={`/${userType}-dashboard`} className="btn btn-primary dashboard-btn" onClick={closeMenu}>لوحة التحكم</Link>
                    <button onClick={handleLogout} className="logout-btn">تسجيل الخروج</button>
                  </>
                )}
                <div className="theme-toggle">
                  <button onClick={toggleTheme} className="theme-btn">
                    {theme === 'light' ? (
                      <i className="fas fa-moon"></i>
                    ) : (
                      <i className="fas fa-sun"></i>
                    )}
                  </button>
                </div>
              </li>
            </ul>
          </nav>

          {/* Desktop actions */}
          <div className="header-actions desktop-actions">
            {!isLoggedIn && (
              <>
                <div className="dropdown" onClick={handleDropdown}>
                  <button className="btn btn-primary dropdown-toggle" type="button">
                    إنشاء حساب جديد <i className="fas fa-caret-down"></i>
                  </button>
                  {isDropdownOpen && (
                    <div className="dropdown-menu show">
                      <Link to="/student-signup" className="dropdown-item" onClick={closeMenu}>كطالب</Link>
                      <Link to="/teacher-signup" className="dropdown-item" onClick={closeMenu}>كمدرس</Link>
                      <Link to="/parent-signup" className="dropdown-item" onClick={closeMenu}>كولي أمر</Link>
                    </div>
                  )}
                </div>
                <Link to="/login" className="btn btn-secondary login-btn" onClick={closeMenu}>تسجيل الدخول</Link>
              </>
            )}
            {isLoggedIn && (
              <>
                <Link to={`/${userType}-dashboard`} className="btn btn-primary dashboard-btn" onClick={closeMenu}>لوحة التحكم</Link>
                <button onClick={handleLogout} className="logout-btn">تسجيل الخروج</button>
              </>
            )}
            <div className="theme-toggle">
              <button onClick={toggleTheme} className="theme-btn">
                {theme === 'light' ? (
                  <i className="fas fa-moon"></i>
                ) : (
                  <i className="fas fa-sun"></i>
                )}
              </button>
            </div>
          </div>

          <button className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 