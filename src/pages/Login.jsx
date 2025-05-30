import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../config/firebase'; // Assuming auth is exported from your firebase config
// import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(formData.email, formData.password);
      const user = await authService.getCurrentUser();
      
      // توجيه المستخدم حسب دوره
      switch (user.role) {
        case 'student':
          navigate('/student-dashboard');
          break;
        case 'teacher':
          navigate('/teacher-dashboard');
          break;
        case 'parent':
          navigate('/parent-dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'حدث خطأ في تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      // Use signInWithPopup for web
      await signInWithPopup(auth, provider);
      
      // After successful sign-in with Google, you might need to fetch/update user role
      // and then navigate. Assuming your backend /me endpoint handles this.
      const user = await authService.getCurrentUser(); // Fetch user from backend to get role

      // توجيه المستخدم حسب دوره
      switch (user.role) {
        case 'student':
          navigate('/student-dashboard');
          break;
        case 'teacher':
          navigate('/teacher-dashboard');
          break;
        case 'parent':
          navigate('/parent-dashboard');
          break;
        default:
          navigate('/');
      }

    } catch (error) {
      console.error('Google Sign-In Error:', error);
      setError(error.message || 'فشل تسجيل الدخول باستخدام جوجل');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>تسجيل الدخول</h1>
        <form onSubmit={handleSubmit}>
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
            <div className="password-input-container" style={{ 
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
            <input
                type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
                style={{ 
                  paddingRight: '45px',
                  width: '100%',
                  transition: 'all 0.3s ease'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle-btn"
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  color: '#666',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  width: '35px',
                  height: '35px',
                  hover: {
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    color: '#333'
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.color = '#333';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#666';
                }}
                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPassword ? (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{
                      transition: 'transform 0.3s ease',
                      transform: 'scale(1.1)'
                    }}
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{
                      transition: 'transform 0.3s ease',
                      transform: 'scale(1.1)'
                    }}
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>
        
        {/* Google Sign-In Button */}
        <button 
          className="btn btn-secondary google-signin-btn"
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{ marginTop: '15px' }}
        >
          تسجيل الدخول باستخدام جوجل
        </button>

        {/* Development Button - Temporary */}
        <button 
          className="btn btn-warning"
          onClick={() => {
            localStorage.setItem('userType', 'teacher');
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('teacherName', 'مدرس تجريبي');
            navigate('/teacher-dashboard');
          }}
          style={{ 
            marginTop: '15px',
            backgroundColor: '#ffc107',
            color: '#000',
            border: '1px solid #ffc107',
            opacity: 0.8
          }}
        >
          [تطوير] الدخول كمعلم
        </button>

        <p className="auth-link">
          لا تمتلك حساب؟ <Link to="/register">إنشاء حساب جديد</Link>
        </p>
        <p className="auth-link">
          <Link to="/reset-password" className="forgot-password-link">نسيت كلمة المرور؟</Link>
        </p>
      </div>
    </div>
  );
};

export default Login; 