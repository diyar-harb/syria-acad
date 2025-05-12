import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import logo from '../styles/img/logo.png';

const Login = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setShowLoginForm(true);
    if (type === 'student') {
      setFormData({ email: 'Waleed@gmail.com', password: 'waleed1234' });
    } else {
      setFormData({ email: '', password: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // بيانات تسجيل الدخول
    const loginCredentials = {
      student: {
        email: 'Waleed@gmail.com',
        password: 'waleed1234'
      },
      teacher: {
        email: 'Waleed@gmail.com',
        password: 'waleed1234'
      },
      parent: {
        email: 'Waleed@gmail.com',
        password: 'waleed1234'
      }
    };

    // التحقق من صحة بيانات تسجيل الدخول
    if (userType === 'student' &&
        formData.email === loginCredentials.student.email &&
        formData.password === loginCredentials.student.password) {
      localStorage.setItem('userType', 'student');
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/student-dashboard');
    } else if (userType === 'teacher' &&
        formData.email === loginCredentials.teacher.email &&
        formData.password === loginCredentials.teacher.password) {
      localStorage.setItem('userType', 'teacher');
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/teacher-dashboard');
    } else if (userType === 'parent' &&
        formData.email === loginCredentials.parent.email &&
        formData.password === loginCredentials.parent.password) {
      localStorage.setItem('userType', 'parent');
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/parent-dashboard');
    } else {
      alert('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img src={logo} alt="Syria Acadime Logo" className="auth-logo" />
        
        {!showLoginForm ? (
          <>
            <h2>مرحباً بك في Syria Acadime</h2>
            <p className="auth-subtitle">اختر نوع حسابك للمتابعة</p>
            
            <div className="user-type-buttons">
              <motion.button
                className="btn btn-primary user-type-btn"
                onClick={() => handleUserTypeSelect('student')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-user-graduate"></i>
                تسجيل الدخول كطالب
              </motion.button>

              <motion.button
                className="btn btn-primary user-type-btn"
                onClick={() => handleUserTypeSelect('teacher')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-chalkboard-teacher"></i>
                تسجيل الدخول كمدرس
              </motion.button>

              <motion.button
                className="btn btn-primary user-type-btn"
                onClick={() => handleUserTypeSelect('parent')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-users"></i>
                تسجيل الدخول كولي أمر
              </motion.button>
            </div>
          </>
        ) : (
          <>
            <h2>تسجيل الدخول {
              userType === 'student' ? 'كطالب' :
              userType === 'teacher' ? 'كمدرس' :
              'كولي أمر'
            }</h2>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">البريد الإلكتروني</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">كلمة المرور</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  تسجيل الدخول
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowLoginForm(false)}
                >
                  تغيير نوع الحساب
                </button>
              </div>
            </form>

            <div className="auth-links">
              <a href="/forgot-password">نسيت كلمة المرور؟</a>
              <a href="/register">إنشاء حساب جديد</a>
              <a href="/student-signup">تسجيل كطالب جديد</a>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Login; 