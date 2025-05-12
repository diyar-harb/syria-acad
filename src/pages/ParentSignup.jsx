import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import '../styles/ParentSignup.css';

function ParentSignup() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    relationship: '',
    otp: '',
    studentCode: '',
    studentEmail: ''
  });
  const [errors, setErrors] = useState({});
  const [showOTP, setShowOTP] = useState(false);

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'الاسم الكامل مطلوب';
    if (!formData.phone) newErrors.phone = 'رقم الهاتف مطلوب';
    if (!formData.email) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (!formData.password) newErrors.password = 'كلمة المرور مطلوبة';
    if (formData.password.length < 8) newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    if (!formData.relationship) newErrors.relationship = 'صلة القرابة مطلوبة';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1 && !validateStep1()) return;
    
    if (step === 2) {
      // التحقق من صحة OTP
      if (!formData.otp) {
        setErrors({ otp: 'رمز التحقق مطلوب' });
        return;
      }
      // هنا سيتم التحقق من OTP مع الخادم
    }
    
    if (step === 3) {
      // التحقق من وجود كود الطالب أو البريد الإلكتروني
      if (!formData.studentCode && !formData.studentEmail) {
        setErrors({ studentCode: 'يجب إدخال كود الطالب أو البريد الإلكتروني' });
        return;
      }
      // هنا سيتم إرسال طلب الربط مع الطالب
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      // إرسال البيانات إلى الخادم
      try {
        // محاكاة إرسال البيانات
        console.log('Form submitted:', formData);
        navigate('/parent/dashboard');
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // مسح خطأ الحقل عند التعديل
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const sendOTP = () => {
    // محاكاة إرسال OTP
    setShowOTP(true);
    console.log('OTP sent to:', formData.phone);
  };

  return (
    <div className={`parent-signup ${theme}`}>
      <div className="signup-container">
        <h1>تسجيل ولي الأمر</h1>
        <div className="progress-bar">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="form-step">
              <div className="form-group">
                <label>الاسم الكامل</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? 'error' : ''}
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label>رقم الهاتف</label>
                <div className="phone-input">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'error' : ''}
                  />
                  <button type="button" onClick={sendOTP} className="send-otp">
                    إرسال رمز التحقق
                  </button>
                </div>
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label>البريد الإلكتروني</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>كلمة المرور</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label>صلة القرابة</label>
                <select
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleChange}
                  className={errors.relationship ? 'error' : ''}
                >
                  <option value="">اختر صلة القرابة</option>
                  <option value="father">أب</option>
                  <option value="mother">أم</option>
                  <option value="guardian">وصي</option>
                </select>
                {errors.relationship && <span className="error-message">{errors.relationship}</span>}
              </div>
            </div>
          )}

          {step === 2 && showOTP && (
            <div className="form-step">
              <div className="form-group">
                <label>رمز التحقق</label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  className={errors.otp ? 'error' : ''}
                />
                {errors.otp && <span className="error-message">{errors.otp}</span>}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-step">
              <div className="form-group">
                <label>كود الطالب</label>
                <input
                  type="text"
                  name="studentCode"
                  value={formData.studentCode}
                  onChange={handleChange}
                  placeholder="أدخل كود الطالب"
                />
              </div>
              <div className="or-divider">أو</div>
              <div className="form-group">
                <label>بريد الطالب الإلكتروني</label>
                <input
                  type="email"
                  name="studentEmail"
                  value={formData.studentEmail}
                  onChange={handleChange}
                  placeholder="أدخل بريد الطالب الإلكتروني"
                />
              </div>
            </div>
          )}

          <div className="form-actions">
            {step > 1 && (
              <button type="button" onClick={() => setStep(step - 1)} className="back-button">
                رجوع
              </button>
            )}
            <button type="submit" className="submit-button">
              {step === 3 ? 'إنشاء الحساب' : 'التالي'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ParentSignup; 