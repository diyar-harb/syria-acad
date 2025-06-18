import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../config/firebase'
import { collection, addDoc, doc, getDoc } from 'firebase/firestore'
import { motion, AnimatePresence } from 'framer-motion'
import logo from '../styles/img/logo.png'

const particles = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32"><g><rect x="8" y="12" width="16" height="8" rx="2" fill="#8c694a" /><rect x="10" y="10" width="12" height="2" rx="1" fill="#d9b282" /><rect x="10" y="20" width="12" height="2" rx="1" fill="#d9b282" /></g></svg>
    ), style: { top: '12%', left: '18%' }
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="10" fill="#80a69b" /><rect x="14" y="8" width="4" height="8" rx="2" fill="#fff" /><rect x="14" y="18" width="4" height="6" rx="2" fill="#d9b282" /></svg>
    ), style: { top: '75%', left: '80%' }
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="12" fill="#d9b282" /><circle cx="16" cy="16" r="6" fill="#fff" /><circle cx="16" cy="16" r="2" fill="#8c694a" /></svg>
    ), style: { top: '60%', left: '30%' }
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32"><g><rect x="10" y="14" width="12" height="6" rx="2" fill="#80a69b" /><rect x="12" y="12" width="8" height="2" rx="1" fill="#d9b282" /><rect x="12" y="20" width="8" height="2" rx="1" fill="#d9b282" /></g></svg>
    ), style: { top: '40%', left: '70%' }
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32"><g><ellipse cx="16" cy="16" rx="12" ry="8" fill="#8c694a" opacity="0.13" /><rect x="14" y="10" width="4" height="12" rx="2" fill="#d9b282" /></g></svg>
    ), style: { top: '20%', left: '60%' }
  },
]

const CreateQuestion = () => {
  const navigate = useNavigate()
  const [questionType, setQuestionType] = useState(null)
  const [questionForm, setQuestionForm] = useState({
    question: '',
    answer: '',
    explanation: '',
    subject: '',
    grade: '',
    difficulty: ''
  })
  const [savingQuestion, setSavingQuestion] = useState(false)
  const [teacherSubjects, setTeacherSubjects] = useState([])
  const [teacherGrades, setTeacherGrades] = useState([])
  const user = JSON.parse(localStorage.getItem('user'))
  const bgRef = useRef(null)

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!user?.uid) return
      const teacherDoc = await getDoc(doc(db, 'teachers', user.uid))
      if (teacherDoc.exists()) {
        const data = teacherDoc.data()
        setTeacherSubjects(Array.isArray(data.subjects) ? data.subjects : [])
        setTeacherGrades(Array.isArray(data.grades) ? data.grades : [])
      }
    }
    fetchTeacherData()
  }, [user])

  // Parallax effect for SVG background
  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        const y = window.scrollY
        bgRef.current.style.transform = `translateY(${y * 0.15}px)`
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Ripple effect for buttons
  const handleRipple = e => {
    const btn = e.currentTarget
    const circle = document.createElement('span')
    circle.className = 'btn-ripple'
    const diameter = Math.max(btn.clientWidth, btn.clientHeight)
    circle.style.width = circle.style.height = `${diameter}px`
    circle.style.left = `${e.nativeEvent.offsetX - diameter / 2}px`
    circle.style.top = `${e.nativeEvent.offsetY - diameter / 2}px`
    btn.appendChild(circle)
    setTimeout(() => circle.remove(), 600)
  }

  const handleQuestionFormChange = e => {
    setQuestionForm({ ...questionForm, [e.target.name]: e.target.value })
  }
  const handleSaveQuestion = async () => {
    setSavingQuestion(true)
    try {
      const data = {
        ...questionForm,
        teacherName: user?.fullName || user?.name || '',
        teacherId: user?.uid,
        createdAt: new Date().toISOString(),
        type: questionType
      }
      if (questionType === 'public') {
        await addDoc(collection(db, 'questionBank'), data)
      } else {
        await addDoc(collection(db, `teacherPosts/${user?.uid}/questions`), data)
      }
      navigate('/teacher-dashboard')
    } catch (err) {
      alert('فشل في حفظ السؤال')
    } finally {
      setSavingQuestion(false)
    }
  }

  return (
    <motion.div className="create-question-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', overflow: 'hidden', position: 'relative' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
      {/* خلفية SVG هندسية متداخلة مع تأثير parallax */}
      <svg ref={bgRef} className="cq-bg-svg" width="100%" height="100%" style={{ position: 'absolute', zIndex: 0, top: 0, left: 0, pointerEvents: 'none', transition: 'transform 0.3s' }}>
        <defs>
          <radialGradient id="cq-grad1" cx="50%" cy="50%" r="80%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#d9b282" stopOpacity="0.18" />
          </radialGradient>
          <linearGradient id="cq-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d9b282" />
            <stop offset="100%" stopColor="#8c694a" />
          </linearGradient>
          <linearGradient id="cq-green" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#80a69b" />
            <stop offset="100%" stopColor="#12403b" />
          </linearGradient>
        </defs>
        <circle cx="80%" cy="20%" r="180" fill="url(#cq-grad1)" />
        <circle cx="20%" cy="80%" r="120" fill="url(#cq-grad1)" />
        <ellipse cx="50%" cy="60%" rx="300" ry="80" fill="url(#cq-green)" opacity="0.08" />
        <circle cx="30%" cy="30%" r="60" fill="#12403b" opacity="0.07" />
        <circle cx="70%" cy="70%" r="90" fill="#8c694a" opacity="0.06" />
        {/* أنماط هندسية إضافية */}
        <circle cx="50%" cy="10%" r="40" fill="url(#cq-gold)" opacity="0.13" />
        <circle cx="90%" cy="90%" r="60" fill="url(#cq-green)" opacity="0.09" />
      </svg>
      {/* شعار متحرك */}
      <motion.img
        src={logo}
        alt="Syria Acadime Logo"
        className="cq-logo"
        initial={{ y: 0, opacity: 0.85 }}
        animate={{ y: [0, -10, 0], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        style={{ position: 'fixed', top: 24, left: 24, width: 60, zIndex: 10, filter: 'drop-shadow(0 2px 8px #d9b28244)' }}
      />
      {/* جزيئات تعليمية متحركة */}
      <AnimatePresence>
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="cq-particle"
            style={{ position: 'absolute', ...p.style, zIndex: 1, filter: 'drop-shadow(0 2px 8px #d9b28244)' }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 0.85, scale: 1, y: [0, -18, 0] }}
            transition={{ duration: 6 + i, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: i * 0.7 }}
            exit={{ opacity: 0 }}
          >{p.icon}</motion.div>
        ))}
      </AnimatePresence>
      <div className="create-question-container cq-glass" style={{ background: 'rgba(255,255,255,0.97)', borderRadius: 24, boxShadow: '0 8px 32px 0 #d9b28244', padding: '2.5rem 2rem', minWidth: 320, maxWidth: 440, zIndex: 2, backdropFilter: 'blur(10px)', border: '1.5px solid #d9b282' }}>
        {!questionType ? (
          <>
            <motion.h2 style={{ textAlign: 'center', marginBottom: 24, fontFamily: 'Noto Sans Arabic, Dubai, Cairo, sans-serif', fontWeight: 800, fontSize: '2rem', background: 'linear-gradient(45deg, #12403b, #d9b282)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.01em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <span style={{ fontSize: '1.3em', marginLeft: 8 }}>📚</span>اختر نوع السؤال
            </motion.h2>
            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 24 }}>
              <motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.04 }} className="modal-btn cq-btn" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: 16, background: 'linear-gradient(90deg, #d9b282 0%, #8c694a 100%)', color: '#fff', fontWeight: 800, boxShadow: '0 2px 12px #d9b28244', border: 'none', outline: 'none', cursor: 'pointer', position: 'relative', overflow: 'hidden', letterSpacing: '0.01em', fontFamily: 'Noto Sans Arabic, Dubai, Cairo, sans-serif' }} onClick={e => { handleRipple(e); setQuestionType('public') }}>سؤال عام</motion.button>
              <motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.04 }} className="modal-btn cq-btn" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: 16, background: 'linear-gradient(90deg, #80a69b 0%, #12403b 100%)', color: '#fff', fontWeight: 800, boxShadow: '0 2px 12px #8c694a44', border: 'none', outline: 'none', cursor: 'pointer', position: 'relative', overflow: 'hidden', letterSpacing: '0.01em', fontFamily: 'Noto Sans Arabic, Dubai, Cairo, sans-serif' }} onClick={e => { handleRipple(e); setQuestionType('private') }}>سؤال خاص</motion.button>
            </div>
            <motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.04 }} className="modal-close cq-btn" style={{ display: 'block', margin: '0 auto', background: 'linear-gradient(90deg, #8c694a 0%, #d9b282 100%)', color: '#fff', borderRadius: 14, padding: '0.8rem 2.2rem', fontWeight: 700, border: 'none', outline: 'none', boxShadow: '0 2px 12px #d9b28244', letterSpacing: '0.01em', fontFamily: 'Noto Sans Arabic, Dubai, Cairo, sans-serif', position: 'relative', overflow: 'hidden' }} onClick={e => { handleRipple(e); navigate(-1) }}>إلغاء</motion.button>
          </>
        ) : (
          <motion.form className="question-form" onSubmit={e => { e.preventDefault(); handleSaveQuestion() }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 style={{ textAlign: 'center', marginBottom: 18, fontFamily: 'Noto Sans Arabic, Dubai, Cairo, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#d9b282', letterSpacing: '0.01em', textShadow: '0 1px 8px #d9b28233', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><span style={{ fontSize: '1.1em', marginLeft: 8 }}>💡</span>{questionType === 'public' ? 'إضافة سؤال عام' : 'إضافة سؤال خاص'}</h2>
            <label style={{ color: '#8c694a', fontWeight: 700, fontSize: '1.08rem', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ fontSize: '1.1em' }}>📝</span>نص السؤال</label>
            <textarea name="question" value={questionForm.question} onChange={handleQuestionFormChange} required style={{ marginBottom: 10, fontFamily: 'Noto Sans Arabic, Dubai, Cairo, sans-serif', fontSize: '1.1rem', borderRadius: 12, border: '1.5px solid #d9b282', padding: '0.8rem', background: 'linear-gradient(90deg, #fffbe6 0%, #f7ecd0 100%)', boxShadow: '0 1px 6px #d9b28222', color: '#6a4a1a', fontWeight: 600, letterSpacing: '0.01em', outline: 'none', transition: 'box-shadow 0.2s' }} onFocus={e => e.target.style.boxShadow = '0 0 0 3px #d9b28255'} onBlur={e => e.target.style.boxShadow = '0 1px 6px #d9b28222'} />
            <label style={{ color: '#8c694a', fontWeight: 700, fontSize: '1.08rem', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ fontSize: '1.1em' }}>✅</span>الحل</label>
            <input name="answer" value={questionForm.answer} onChange={handleQuestionFormChange} required style={{ marginBottom: 10, fontFamily: 'Noto Sans Arabic, Dubai, Cairo, sans-serif', fontSize: '1.1rem', borderRadius: 12, border: '1.5px solid #d9b282', padding: '0.8rem', background: 'linear-gradient(90deg, #fffbe6 0%, #f7ecd0 100%)', boxShadow: '0 1px 6px #d9b28222', color: '#6a4a1a', fontWeight: 700, letterSpacing: '0.01em', outline: 'none', transition: 'box-shadow 0.2s' }} onFocus={e => e.target.style.boxShadow = '0 0 0 3px #d9b28255'} onBlur={e => e.target.style.boxShadow = '0 1px 6px #d9b28222'} />
            <label style={{ color: '#8c694a', fontWeight: 700, fontSize: '1.08rem', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ fontSize: '1.1em' }}>💡</span>التفسير</label>
            <textarea name="explanation" value={questionForm.explanation} onChange={handleQuestionFormChange} required style={{ marginBottom: 10, fontFamily: 'Noto Sans Arabic, Dubai, Cairo, sans-serif', fontSize: '1.1rem', borderRadius: 12, border: '1.5px solid #d9b282', padding: '0.8rem', background: 'linear-gradient(90deg, #fffbe6 0%, #f7ecd0 100%)', boxShadow: '0 1px 6px #d9b28222', color: '#6a4a1a', fontWeight: 600, letterSpacing: '0.01em', outline: 'none', transition: 'box-shadow 0.2s' }} onFocus={e => e.target.style.boxShadow = '0 0 0 3px #d9b28255'} onBlur={e => e.target.style.boxShadow = '0 1px 6px #d9b28222'} />
            <label style={{ color: '#8c694a', fontWeight: 700, fontSize: '1.08rem', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ fontSize: '1.1em' }}>🧪</span>المادة</label>
            <select name="subject" value={questionForm.subject} onChange={handleQuestionFormChange} required style={{ marginBottom: 10, fontFamily: 'Noto Sans Arabic, Dubai, Cairo, sans-serif', fontSize: '1.1rem', borderRadius: 12, border: '1.5px solid #d9b282', padding: '0.7rem', background: 'linear-gradient(90deg, #fffbe6 0%, #f7ecd0 100%)', boxShadow: '0 1px 6px #d9b28222', color: '#6a4a1a', fontWeight: 600, letterSpacing: '0.01em', outline: 'none', transition: 'box-shadow 0.2s' }} onFocus={e => e.target.style.boxShadow = '0 0 0 3px #d9b28255'} onBlur={e => e.target.style.boxShadow = '0 1px 6px #d9b28222'}>
              <option value="">اختر المادة</option>
              {teacherSubjects.map((sub, i) => <option key={i} value={sub}>{sub}</option>)}
            </select>
            <label style={{ color: '#8c694a', fontWeight: 700, fontSize: '1.08rem', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ fontSize: '1.1em' }}>🏫</span>الصف</label>
            <select name="grade" value={questionForm.grade} onChange={handleQuestionFormChange} required style={{ marginBottom: 10, fontFamily: 'Noto Sans Arabic, Dubai, Cairo, sans-serif', fontSize: '1.1rem', borderRadius: 12, border: '1.5px solid #d9b282', padding: '0.7rem', background: 'linear-gradient(90deg, #fffbe6 0%, #f7ecd0 100%)', boxShadow: '0 1px 6px #d9b28222', color: '#6a4a1a', fontWeight: 600, letterSpacing: '0.01em', outline: 'none', transition: 'box-shadow 0.2s' }} onFocus={e => e.target.style.boxShadow = '0 0 0 3px #d9b28255'} onBlur={e => e.target.style.boxShadow = '0 1px 6px #d9b28222'}>
              <option value="">اختر الصف</option>
              {teacherGrades.map((g, i) => <option key={i} value={g}>{g}</option>)}
            </select>
            <label style={{ color: '#8c694a', fontWeight: 700, fontSize: '1.08rem', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ fontSize: '1.1em' }}>⭐</span>درجة الصعوبة</label>
            <select name="difficulty" value={questionForm.difficulty} onChange={handleQuestionFormChange} required style={{ marginBottom: 18, fontFamily: 'Noto Sans Arabic, Dubai, Cairo, sans-serif', fontSize: '1.1rem', borderRadius: 12, border: '1.5px solid #d9b282', padding: '0.7rem', background: 'linear-gradient(90deg, #fffbe6 0%, #f7ecd0 100%)', boxShadow: '0 1px 6px #d9b28222', color: '#6a4a1a', fontWeight: 600, letterSpacing: '0.01em', outline: 'none', transition: 'box-shadow 0.2s' }} onFocus={e => e.target.style.boxShadow = '0 0 0 3px #d9b28255'} onBlur={e => e.target.style.boxShadow = '0 1px 6px #d9b28222'}>
              <option value="">اختر الصعوبة</option>
              <option value="سهل">سهل</option>
              <option value="متوسط">متوسط</option>
              <option value="صعب">صعب</option>
            </select>
            <motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.04 }} className="modal-btn cq-btn" type="submit" disabled={savingQuestion} style={{ width: '100%', marginBottom: 10, background: 'linear-gradient(90deg, #d9b282 0%, #8c694a 100%)', color: '#fff', fontWeight: 800, borderRadius: 14, fontSize: '1.1rem', boxShadow: '0 2px 12px #d9b28244', border: 'none', outline: 'none', letterSpacing: '0.01em', fontFamily: 'Noto Sans Arabic, Dubai, Cairo, sans-serif', position: 'relative', overflow: 'hidden' }} onClick={handleRipple}>{savingQuestion ? 'جاري الحفظ...' : 'حفظ السؤال'}</motion.button>
            <motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.04 }} className="modal-close cq-btn" type="button" style={{ width: '100%', background: 'linear-gradient(90deg, #8c694a 0%, #d9b282 100%)', color: '#fff', fontWeight: 700, borderRadius: 14, fontSize: '1.1rem', boxShadow: '0 2px 12px #d9b28244', border: 'none', outline: 'none', letterSpacing: '0.01em', fontFamily: 'Noto Sans Arabic, Dubai, Cairo, sans-serif', position: 'relative', overflow: 'hidden' }} onClick={e => { handleRipple(e); setQuestionType(null) }}>رجوع</motion.button>
          </motion.form>
        )}
      </div>
      {/* تأثير موجة للأزرار */}
      <style>{`
        .btn-ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(217,178,130,0.25);
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
          z-index: 2;
        }
        @keyframes ripple {
          to {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        .cq-bg-svg { pointer-events: none; position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0; }
        .cq-logo { filter: drop-shadow(0 2px 8px #d9b28244); }
        .cq-particle { animation-timing-function: ease-in-out; opacity: 0.85; }
        .cq-glass { box-shadow: 0 8px 32px 0 rgba(140, 105, 74, 0.18); }
        .cq-btn:active { background: linear-gradient(90deg, #80a69b 0%, #8c694a 100%) !important; }
        @media (max-width: 600px) { .create-question-container { padding: 1.2rem 0.5rem !important; min-width: 0 !important; } }
        body[data-theme='dark'] .create-question-container, .cq-glass { background: rgba(26,26,26,0.97) !important; color: #fff; }
      `}</style>
    </motion.div>
  )
}

export default CreateQuestion 