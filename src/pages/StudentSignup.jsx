import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import '../styles/StudentSignup.css';

function StudentSignup() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    educationLevel: '',
    school: '',
    interests: [],
    profileImage: null,
    activationCode: ''
  });
  const [errors, setErrors] = useState({});
  const [showActivation, setShowActivation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const educationLevels = [
    'الابتدائي',
    'الإعدادي',
    'الثانوي'
  ];

  const interests = [
    'الرياضيات',
    'العلوم',
    'اللغة العربية',
    'اللغة الإنجليزية',
    'الفيزياء',
    'الكيمياء',
    'البيولوجيا',
    'التاريخ',
    'الجغرافيا',
    'الفنون',
    'البرمجة'
  ];

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'الاسم الكامل مطلوب';
    if (!formData.email) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }
    if (!formData.password) newErrors.password = 'كلمة المرور مطلوبة';
    if (formData.password.length < 8) newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    if (!/[A-Z]/.test(formData.password)) newErrors.password = 'يجب أن تحتوي كلمة المرور على حرف كبير على الأقل';
    if (!/[a-z]/.test(formData.password)) newErrors.password = 'يجب أن تحتوي كلمة المرور على حرف صغير على الأقل';
    if (!/[0-9]/.test(formData.password)) newErrors.password = 'يجب أن تحتوي كلمة المرور على رقم على الأقل';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
    }
    if (!formData.birthDate) newErrors.birthDate = 'تاريخ الميلاد مطلوب';
    if (!formData.educationLevel) newErrors.educationLevel = 'المرحلة الدراسية مطلوبة';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (step === 1 && !validateStep1()) {
      setIsLoading(false);
      return;
    }
    
    if (step === 3) {
      if (!formData.activationCode) {
        setErrors({ activationCode: 'رمز التفعيل مطلوب' });
        setIsLoading(false);
        return;
      }
      // هنا سيتم التحقق من رمز التفعيل مع الخادم
      try {
        // محاكاة التحقق من رمز التفعيل
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (formData.activationCode === '123456') {
          // تفعيل الحساب
          localStorage.setItem('userType', 'student');
          localStorage.setItem('isLoggedIn', 'true');
          navigate('/student-dashboard');
        } else {
          setErrors({ activationCode: 'رمز التفعيل غير صحيح' });
        }
      } catch (error) {
        console.error('Error verifying activation code:', error);
        setErrors({ activationCode: 'حدث خطأ أثناء التحقق من رمز التفعيل' });
      }
    } else {
      if (step === 2) {
        setShowActivation(true);
        // محاكاة إرسال رمز التفعيل
        console.log('Activation code sent to:', formData.email);
      }
      setStep(step + 1);
    }
    
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else if (type === 'checkbox') {
      const { checked } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // مسح خطأ الحقل عند التعديل
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <motion.div 
      className={`student-signup ${theme}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="signup-container">
        <h1>تسجيل الطالب</h1>
        <div className="progress-bar">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <motion.div 
              className="form-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="form-group">
                <label>الاسم الكامل</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? 'error' : ''}
                  placeholder="أدخل اسمك الكامل"
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label>البريد الإلكتروني</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="أدخل بريدك الإلكتروني"
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
                  placeholder="أدخل كلمة المرور"
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label>تأكيد كلمة المرور</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'error' : ''}
                  placeholder="أعد إدخال كلمة المرور"
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              <div className="form-group">
                <label>تاريخ الميلاد</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className={errors.birthDate ? 'error' : ''}
                />
                {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
              </div>

              <div className="form-group">
                <label>المرحلة الدراسية</label>
                <select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  className={errors.educationLevel ? 'error' : ''}
                >
                  <option value="">اختر المرحلة</option>
                  {educationLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                {errors.educationLevel && <span className="error-message">{errors.educationLevel}</span>}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              className="form-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="form-group">
                <label>المدرسة/المؤسسة التعليمية</label>
                <input
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  placeholder="أدخل اسم مدرستك"
                />
              </div>

              <div className="form-group">
                <label>الاهتمامات التعليمية</label>
                <div className="checkbox-group">
                  {interests.map(interest => (
                    <label key={interest} className="checkbox-label">
                      <input
                        type="checkbox"
                        name="interests"
                        value={interest}
                        checked={formData.interests.includes(interest)}
                        onChange={handleChange}
                      />
                      <span>{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>الصورة الشخصية</label>
                <input
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleChange}
                  className="file-input"
                />
                <p className="file-hint">يمكنك تحميل صورة شخصية (اختياري)</p>
              </div>
            </motion.div>
          )}

          {step === 3 && showActivation && (
            <motion.div 
              className="form-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="activation-info">
                <p>تم إرسال رمز التفعيل إلى بريدك الإلكتروني</p>
                <p className="email-hint">{formData.email}</p>
              </div>
              <div className="form-group">
                <label>رمز التفعيل</label>
                <input
                  type="text"
                  name="activationCode"
                  value={formData.activationCode}
                  onChange={handleChange}
                  className={errors.activationCode ? 'error' : ''}
                  placeholder="أدخل رمز التفعيل"
                />
                {errors.activationCode && <span className="error-message">{errors.activationCode}</span>}
              </div>
            </motion.div>
          )}

          <div className="form-actions">
            {step > 1 && (
              <motion.button
                type="button"
                onClick={() => setStep(step - 1)}
                className="back-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                رجوع
              </motion.button>
            )}
            <motion.button
              type="submit"
              className="submit-button"
              disabled={isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? 'جاري المعالجة...' : step === 3 ? 'تفعيل الحساب' : 'التالي'}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default StudentSignup; 