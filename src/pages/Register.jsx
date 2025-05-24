import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/Auth.css';

const Register = () => {
  const navigate = useNavigate();

  const handleSignupClick = (type) => {
    navigate(`/${type}-signup`);
  };

  return (
    <div className="auth-page">
      <motion.div 
        className="auth-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>إنشاء حساب جديد</h1>
        <div className="signup-options">
          <button className="btn btn-signup" onClick={() => handleSignupClick('student')}>
            كطالب
          </button>
          <button className="btn btn-signup" onClick={() => handleSignupClick('teacher')}>
            كمدرس
          </button>
          <button className="btn btn-signup" onClick={() => handleSignupClick('parent')}>
            كولي أمر
          </button>
        </div>
        <p className="auth-link">
          لديك حساب بالفعل؟ <Link to="/login">تسجيل الدخول</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register; 