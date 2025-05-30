import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import '../styles/TeacherSignup.css';
import { auth, db, storage } from '../config/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function TeacherSignup() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
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
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

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

  const uploadFile = async (file, path) => {
    if (!file) return null;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;

    if (step === 1) {
      setLoading(true);
      try {
        // إنشاء حساب في Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        // تحديث اسم المستخدم
        await updateProfile(userCredential.user, {
          displayName: formData.fullName
        });

        // إرسال بريد التحقق
        await sendEmailVerification(userCredential.user, {
          url: `${window.location.origin}/teacher-dashboard`,
          handleCodeInApp: true
        });

        // حفظ البيانات الأساسية في Firestore
        await setDoc(doc(db, 'teachers', userCredential.user.uid), {
          fullName: formData.fullName,
          email: formData.email,
          specialties: formData.specialties,
          educationLevels: formData.educationLevels,
          status: 'pending',
          createdAt: new Date(),
          verified: false
        });

        setVerificationSent(true);
        setShowActivation(true);
        setStep(3);
      } catch (error) {
        let errorMessage = 'حدث خطأ أثناء إنشاء الحساب';
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
            break;
          case 'auth/invalid-email':
            errorMessage = 'البريد الإلكتروني غير صالح';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'تسجيل الحساب غير مفعل حالياً';
            break;
          case 'auth/weak-password':
            errorMessage = 'كلمة المرور ضعيفة جداً';
            break;
          default:
            console.error('خطأ في التسجيل:', error);
        }
        setErrors({ submit: errorMessage });
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('لم يتم العثور على المستخدم');

        // رفع الملفات
        const [profileImageUrl, degreeCertificateUrl, idDocumentUrl] = await Promise.all([
          uploadFile(formData.profileImage, `teachers/${user.uid}/profile`),
          uploadFile(formData.degreeCertificate, `teachers/${user.uid}/degree`),
          uploadFile(formData.idDocument, `teachers/${user.uid}/id`)
        ]);

        // تحديث بيانات المدرس في Firestore
        await setDoc(doc(db, 'teachers', user.uid), {
          profileImageUrl,
          degreeCertificateUrl,
          idDocumentUrl,
          updatedAt: new Date()
        }, { merge: true });

        setStep(3);
      } catch (error) {
        console.error('خطأ في رفع الملفات:', error);
        setErrors({ submit: 'حدث خطأ أثناء رفع الملفات' });
      } finally {
        setLoading(false);
      }
    } else if (step === 3) {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('لم يتم العثور على المستخدم');

        // التحقق من حالة البريد الإلكتروني
        await user.reload();
        if (!user.emailVerified) {
          throw new Error('يرجى التحقق من بريدك الإلكتروني أولاً');
        }

        // تحديث حالة المدرس في Firestore
        await setDoc(doc(db, 'teachers', user.uid), {
          verified: true,
          status: 'active',
          verifiedAt: new Date()
        }, { merge: true });

        // تسجيل الدخول تلقائياً
        localStorage.setItem('userType', 'teacher');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('teacherName', formData.fullName);
        
        navigate('/teacher-dashboard');
      } catch (error) {
        console.error('خطأ في التحقق:', error);
        setErrors({ submit: error.message || 'حدث خطأ أثناء التحقق من الحساب' });
      } finally {
        setLoading(false);
      }
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
                <div className="password-input-container" style={{ 
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'error' : ''}
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
                      height: '35px'
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
                {verificationSent && (
                  <p className="verification-message">
                    تم إرسال رمز التحقق إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد الخاص بك.
                  </p>
                )}
              </div>
            </div>
          )}

          {errors.submit && <div className="error-message">{errors.submit}</div>}

          <div className="form-actions">
            {step > 1 && (
              <button type="button" onClick={() => setStep(step - 1)} className="back-button" disabled={loading}>
                رجوع
              </button>
            )}
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'جاري المعالجة...' : step === 3 ? 'تفعيل الحساب' : 'التالي'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TeacherSignup; 