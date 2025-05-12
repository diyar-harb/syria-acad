import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import '../styles/TeacherSignup.css';
import axios from 'axios';

function TeacherSignup() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    specialties: [],
    educationLevels: [],
    profileImage: null,
    degreeCertificate: null,
    idDocument: null,
    activationCode: ''
  });
  const [errors, setErrors] = useState({});
  const [showActivation, setShowActivation] = useState(false);

  const specialties = [
    'الرياضيات',
    'العلوم',
    'اللغة العربية',
    'اللغة الإنجليزية',
    'الفيزياء',
    'الكيمياء',
    'البيولوجيا',
    'التاريخ',
    'الجغرافيا'
  ];

  const educationLevels = [
    'الابتدائي',
    'الإعدادي',
    'الثانوي'
  ];

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'الاسم الكامل مطلوب';
    if (!formData.email) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (!formData.password) newErrors.password = 'كلمة المرور مطلوبة';
    if (formData.password.length < 8) newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    if (!/[A-Z]/.test(formData.password)) newErrors.password = 'يجب أن تحتوي كلمة المرور على حرف كبير على الأقل';
    if (!/[a-z]/.test(formData.password)) newErrors.password = 'يجب أن تحتوي كلمة المرور على حرف صغير على الأقل';
    if (!/[0-9]/.test(formData.password)) newErrors.password = 'يجب أن تحتوي كلمة المرور على رقم على الأقل';
    if (formData.specialties.length === 0) newErrors.specialties = 'يجب اختيار تخصص واحد على الأقل';
    if (formData.educationLevels.length === 0) newErrors.educationLevels = 'يجب اختيار مرحلة تعليمية واحدة على الأقل';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.profileImage) newErrors.profileImage = 'الصورة الشخصية مطلوبة';
    if (!formData.degreeCertificate) newErrors.degreeCertificate = 'شهادة التخرج مطلوبة';
    if (!formData.idDocument) newErrors.idDocument = 'الهوية الرسمية مطلوبة';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    // تسجيل وهمي بدون سيرفر
    if (step === 1) {
      localStorage.setItem('userType', 'teacher');
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('teacherName', formData.fullName);
      navigate('/teacher-dashboard');
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    }
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
    <div className={`teacher-signup ${theme}`}>
      <div className="signup-container">
        <h1>تسجيل المدرس</h1>
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
                <label>التخصصات</label>
                <div className="checkbox-group">
                  {specialties.map(specialty => (
                    <label key={specialty} className="checkbox-label">
                      <input
                        type="checkbox"
                        name="specialties"
                        value={specialty}
                        checked={formData.specialties.includes(specialty)}
                        onChange={handleChange}
                      />
                      <span>{specialty}</span>
                    </label>
                  ))}
                </div>
                {errors.specialties && <span className="error-message">{errors.specialties}</span>}
              </div>

              <div className="form-group">
                <label>المراحل التعليمية</label>
                <div className="checkbox-group">
                  {educationLevels.map(level => (
                    <label key={level} className="checkbox-label">
                      <input
                        type="checkbox"
                        name="educationLevels"
                        value={level}
                        checked={formData.educationLevels.includes(level)}
                        onChange={handleChange}
                      />
                      <span>{level}</span>
                    </label>
                  ))}
                </div>
                {errors.educationLevels && <span className="error-message">{errors.educationLevels}</span>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <div className="form-group">
                <label>الصورة الشخصية</label>
                <input
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleChange}
                  className={errors.profileImage ? 'error' : ''}
                />
                {errors.profileImage && <span className="error-message">{errors.profileImage}</span>}
              </div>

              <div className="form-group">
                <label>شهادة التخرج</label>
                <input
                  type="file"
                  name="degreeCertificate"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleChange}
                  className={errors.degreeCertificate ? 'error' : ''}
                />
                {errors.degreeCertificate && <span className="error-message">{errors.degreeCertificate}</span>}
              </div>

              <div className="form-group">
                <label>الهوية الرسمية</label>
                <input
                  type="file"
                  name="idDocument"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleChange}
                  className={errors.idDocument ? 'error' : ''}
                />
                {errors.idDocument && <span className="error-message">{errors.idDocument}</span>}
              </div>
            </div>
          )}

          {step === 3 && showActivation && (
            <div className="form-step">
              <div className="form-group">
                <label>رمز التفعيل</label>
                <input
                  type="text"
                  name="activationCode"
                  value={formData.activationCode}
                  onChange={handleChange}
                  className={errors.activationCode ? 'error' : ''}
                />
                {errors.activationCode && <span className="error-message">{errors.activationCode}</span>}
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
              {step === 3 ? 'تفعيل الحساب' : 'التالي'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TeacherSignup; 