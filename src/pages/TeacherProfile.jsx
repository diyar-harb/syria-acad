import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../styles/TeacherProfile.css';

const TeacherProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [teacherData, setTeacherData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      qualification: '',
      experience: '',
      specialization: '',
    },
    professionalInfo: {
      subjects: [],
      certificates: [],
      courses: [],
      achievements: [],
      grades: [],
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const uid = user?.uid;

  const fetchTeacherData = async () => {
    if (!user || user.role !== 'teacher' || !uid) {
      setError('يجب تسجيل الدخول كمدرس للوصول إلى هذه الصفحة');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const teacherDoc = await getDoc(doc(db, 'teachers', uid));
      if (teacherDoc.exists()) {
        const data = teacherDoc.data();
        setTeacherData({
          personalInfo: {
            fullName: data.fullName || '',
            email: data.email || '',
            phone: data.phone || '',
            qualification: data.qualification || '',
            experience: data.experience || '',
            specialization: data.specialization || '',
          },
          professionalInfo: {
            subjects: Array.isArray(data.subjects) ? data.subjects : [],
            certificates: Array.isArray(data.certificates) ? data.certificates : [],
            courses: Array.isArray(data.courses) ? data.courses : [],
            achievements: Array.isArray(data.achievements) ? data.achievements : [],
            grades: Array.isArray(data.grades) ? data.grades : [],
          },
        });
      } else {
        setError('لم يتم العثور على بيانات المدرس');
      }
    } catch (error) {
      setError('فشل في جلب البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherData();
    // eslint-disable-next-line
  }, [uid]);

  const handleInputChange = (section, field, value) => {
    setTeacherData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleArrayInputChange = (section, field, value) => {
    const array = value.split(',').map(item => item.trim());
    setTeacherData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: array,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const docRef = doc(db, 'teachers', uid);
      const dataToSave = {
        ...teacherData.personalInfo,
        ...teacherData.professionalInfo,
      };
      await setDoc(docRef, dataToSave, { merge: true });
      setIsEditing(false);
    } catch (error) {
      setError('فشل في حفظ البيانات');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">جاري التحميل...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="teacher-profile">
      <div className="profile-header">
        <h1>الملف الشخصي</h1>
        <button className="refresh-button" onClick={fetchTeacherData} disabled={loading}>
          تحديث البيانات
        </button>
      </div>

      <div className="edit-button-container">
        <button
          className={`edit-button ${isEditing ? 'save' : ''}`}
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          disabled={saving}
        >
          {saving ? 'جاري الحفظ...' : isEditing ? 'حفظ التغييرات' : 'تعديل الملف'}
        </button>
      </div>

      <div className="profile-sections">
        {/* البيانات الشخصية */}
        <section className="profile-section">
          <h2>البيانات الشخصية</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>الاسم الكامل</label>
              {isEditing ? (
                <input
                  type="text"
                  value={teacherData?.personalInfo?.fullName || ''}
                  onChange={e => handleInputChange('personalInfo', 'fullName', e.target.value)}
                />
              ) : (
                <p>{teacherData?.personalInfo?.fullName || ''}</p>
              )}
            </div>

            <div className="info-item">
              <label>البريد الإلكتروني</label>
              <p>{teacherData?.personalInfo?.email || ''}</p>
            </div>

            <div className="info-item">
              <label>رقم الهاتف</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={teacherData?.personalInfo?.phone || ''}
                  onChange={e => handleInputChange('personalInfo', 'phone', e.target.value)}
                />
              ) : (
                <p>{teacherData?.personalInfo?.phone || ''}</p>
              )}
            </div>

            <div className="info-item">
              <label>المؤهل العلمي</label>
              {isEditing ? (
                <input
                  type="text"
                  value={teacherData?.personalInfo?.qualification || ''}
                  onChange={e => handleInputChange('personalInfo', 'qualification', e.target.value)}
                />
              ) : (
                <p>{teacherData?.personalInfo?.qualification || ''}</p>
              )}
            </div>

            <div className="info-item">
              <label>سنوات الخبرة</label>
              {isEditing ? (
                <input
                  type="number"
                  value={teacherData?.personalInfo?.experience || ''}
                  onChange={e => handleInputChange('personalInfo', 'experience', e.target.value)}
                />
              ) : (
                <p>{teacherData?.personalInfo?.experience || ''} سنوات</p>
              )}
            </div>

            <div className="info-item">
              <label>التخصص</label>
              {isEditing ? (
                <input
                  type="text"
                  value={teacherData?.personalInfo?.specialization || ''}
                  onChange={e =>
                    handleInputChange('personalInfo', 'specialization', e.target.value)
                  }
                />
              ) : (
                <p>{teacherData?.personalInfo?.specialization || ''}</p>
              )}
            </div>
          </div>
        </section>

        {/* البيانات المهنية */}
        <section className="profile-section">
          <h2>البيانات المهنية</h2>
          <div className="info-grid">
            <div className="info-item full-width">
              <label>المواد التي يدرسها</label>
              {isEditing ? (
                <textarea
                  value={teacherData?.professionalInfo?.subjects?.join(', ') || ''}
                  onChange={e =>
                    handleArrayInputChange('professionalInfo', 'subjects', e.target.value)
                  }
                  placeholder="أدخل المواد مفصولة بفواصل"
                />
              ) : (
                <div className="tags">
                  {teacherData?.professionalInfo?.subjects?.map((subject, index) => (
                    <span key={index} className="tag">
                      {subject}
                    </span>
                  )) || []}
                </div>
              )}
            </div>

            <div className="info-item full-width">
              <label>الشهادات العلمية</label>
              {isEditing ? (
                <textarea
                  value={teacherData?.professionalInfo?.certificates?.join(', ') || ''}
                  onChange={e =>
                    handleArrayInputChange('professionalInfo', 'certificates', e.target.value)
                  }
                  placeholder="أدخل الشهادات مفصولة بفواصل"
                />
              ) : (
                <div className="tags">
                  {teacherData?.professionalInfo?.certificates?.map((cert, index) => (
                    <span key={index} className="tag">
                      {cert}
                    </span>
                  )) || []}
                </div>
              )}
            </div>

            <div className="info-item full-width">
              <label>الدورات التدريبية</label>
              {isEditing ? (
                <textarea
                  value={teacherData?.professionalInfo?.courses?.join(', ') || ''}
                  onChange={e =>
                    handleArrayInputChange('professionalInfo', 'courses', e.target.value)
                  }
                  placeholder="أدخل الدورات مفصولة بفواصل"
                />
              ) : (
                <div className="tags">
                  {teacherData?.professionalInfo?.courses?.map((course, index) => (
                    <span key={index} className="tag">
                      {course}
                    </span>
                  )) || []}
                </div>
              )}
            </div>

            <div className="info-item full-width">
              <label>الصفوف التي يدرسها</label>
              {isEditing ? (
                <textarea
                  value={teacherData?.professionalInfo?.grades?.join(', ') || ''}
                  onChange={e =>
                    handleArrayInputChange('professionalInfo', 'grades', e.target.value)
                  }
                  placeholder="أدخل الصفوف مفصولة بفواصل"
                />
              ) : (
                <div className="tags">
                  {teacherData?.professionalInfo?.grades?.map((grade, index) => (
                    <span key={index} className="tag">
                      {grade}
                    </span>
                  )) || []}
                </div>
              )}
            </div>

            <div className="info-item full-width">
              <label>الإنجازات</label>
              {isEditing ? (
                <textarea
                  value={teacherData?.professionalInfo?.achievements?.join(', ') || ''}
                  onChange={e =>
                    handleArrayInputChange('professionalInfo', 'achievements', e.target.value)
                  }
                  placeholder="أدخل الإنجازات مفصولة بفواصل"
                />
              ) : (
                <div className="tags">
                  {teacherData?.professionalInfo?.achievements?.map((achievement, index) => (
                    <span key={index} className="tag">
                      {achievement}
                    </span>
                  )) || []}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TeacherProfile;
