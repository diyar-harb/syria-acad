import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import '../styles/Auth.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validatePassword = (password) => {
    if (password.length < 8) return 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    if (!/[A-Z]/.test(password)) return 'يجب أن تحتوي كلمة المرور على حرف كبير على الأقل';
    if (!/[a-z]/.test(password)) return 'يجب أن تحتوي كلمة المرور على حرف صغير على الأقل';
    if (!/[0-9]/.test(password)) return 'يجب أن تحتوي كلمة المرور على رقم على الأقل';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (step === 1) {
        // Request password reset
        await authService.requestPasswordReset(formData.email);
        setStep(2);
      } else if (step === 2) {
        // Verify OTP
        await authService.verifyResetOTP(formData.email, formData.otp);
        setStep(3);
      } else if (step === 3) {
        // Validate passwords
        const passwordError = validatePassword(formData.newPassword);
        if (passwordError) {
          setError(passwordError);
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          setError('كلمات المرور غير متطابقة');
          return;
        }
        // Reset password
        await authService.resetPassword(formData.email, formData.otp, formData.newPassword);
        navigate('/login', { state: { message: 'تم تغيير كلمة المرور بنجاح' } });
      }
    } catch (error) {
      setError(error.response?.data?.error || 'حدث خطأ في العملية');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>استعادة كلمة المرور</h1>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
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
          )}

          {step === 2 && (
            <div className="form-group">
              <label htmlFor="otp">رمز التحقق</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                required
                placeholder="أدخل رمز التحقق المرسل إلى بريدك الإلكتروني"
              />
            </div>
          )}

          {step === 3 && (
            <>
              <div className="form-group">
                <label htmlFor="newPassword">كلمة المرور الجديدة</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-btn"
                  >
                    {showPassword ? "إخفاء" : "إظهار"}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">تأكيد كلمة المرور</label>
                <div className="password-input-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="password-toggle-btn"
                  >
                    {showConfirmPassword ? "إخفاء" : "إظهار"}
                  </button>
                </div>
              </div>
            </>
          )}

          {error && <p className="error-message">{error}</p>}
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'جاري المعالجة...' : 
              step === 1 ? 'إرسال رمز التحقق' :
              step === 2 ? 'التحقق من الرمز' :
              'تغيير كلمة المرور'
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword; 