import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import '../styles/Dashboard.css'
import logo from '../styles/img/logo.png'
import { db } from '../config/firebase'
import { collection, addDoc } from 'firebase/firestore'

const notoFont = 'Noto Sans Arabic',
  dubaiFont = 'Dubai',
  fallbackFont = 'Cairo, sans-serif'

const teacherName = localStorage.getItem('teacherName') || 'الأستاذ'

// Floating particles SVG icons
const particles = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <g>
          <rect x="8" y="12" width="16" height="8" rx="2" fill="#8c694a" />
          <rect x="10" y="10" width="12" height="2" rx="1" fill="#d9b282" />
          <rect x="10" y="20" width="12" height="2" rx="1" fill="#d9b282" />
        </g>
      </svg>
    ),
    style: { top: '10%', left: '15%' }
  }, // كتاب
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="10" fill="#80a69b" />
        <rect x="14" y="8" width="4" height="8" rx="2" fill="#fff" />
        <rect x="14" y="18" width="4" height="6" rx="2" fill="#d9b282" />
      </svg>
    ),
    style: { top: '70%', left: '80%' }
  }, // مصباح
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="12" fill="#d9b282" />
        <circle cx="16" cy="16" r="6" fill="#fff" />
        <circle cx="16" cy="16" r="2" fill="#8c694a" />
      </svg>
    ),
    style: { top: '60%', left: '30%' }
  } // ذرة
]

const TeacherDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const mainRef = useRef(null)
  const user = JSON.parse(localStorage.getItem('user'))
  const teacherSubjects = user?.subjects || []
  const teacherGrades = user?.grades || []

  useEffect(() => {
    // التحقق من حالة تسجيل الدخول
    const userType = localStorage.getItem('userType')
    const loggedIn = localStorage.getItem('isLoggedIn')

    if (loggedIn !== 'true' || userType !== 'teacher') {
      navigate('/login')
    } else {
      setIsLoggedIn(true)
    }
  }, [navigate])

  useEffect(() => {
    document.body.style.fontFamily = `${notoFont}, ${dubaiFont}, ${fallbackFont}`
    return () => {
      document.body.style.fontFamily = ''
    }
  }, [])

  if (!isLoggedIn) {
    return null // أو يمكنك إظهار شاشة تحميل
  }

  const stats = {
    totalStudents: 120,
    activeClasses: 5,
    totalQuestions: 250,
    averageScore: 85
  }

  const recentActivities = [
    {
      id: 1,
      type: 'question',
      text: 'تم إضافة 10 أسئلة جديدة في مادة الرياضيات',
      time: 'منذ ساعتين'
    },
    { id: 2, type: 'class', text: 'تم إنشاء فصل جديد: الفيزياء للصف العاشر', time: 'منذ 3 ساعات' },
    { id: 3, type: 'exam', text: 'تم تصحيح اختبار نصف الفصل', time: 'منذ 5 ساعات' }
  ]

  return (
    <div
      className="dashboard-page"
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        background: 'var(--bg-primary)'
      }}>
      {/* Geometric SVG background */}
      <svg className="dashboard-bg-svg" width="100%" height="100%" style={{ position: 'absolute', zIndex: 0, top: 0, left: 0, pointerEvents: 'none' }}>
        <defs>
          <radialGradient id="grad1" cx="50%" cy="50%" r="80%">
            <stop offset="0%" stopColor="var(--bg-primary)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--primary-light)" stopOpacity="0.2" />
          </radialGradient>
        </defs>
        <circle cx="80%" cy="20%" r="180" fill="url(#grad1)" />
        <circle cx="20%" cy="80%" r="120" fill="url(#grad1)" />
        <ellipse cx="50%" cy="60%" rx="300" ry="80" fill="var(--bg-secondary)" opacity="0.2" />
      </svg>
      {/* Floating particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="floating-particle"
          style={{
            position: 'absolute',
            ...p.style,
            zIndex: 1,
            animation: `float${i} 6s ease-in-out infinite alternate`,
            filter: 'var(--shadow-md)'
          }}>
          {p.icon}
        </div>
      ))}
      {/* شعار متحرك */}
      <img
        src={logo}
        alt="Syria Acadime Logo"
        style={{
          position: 'fixed',
          top: 24,
          left: 24,
          width: 60,
          zIndex: 10,
          animation: 'logoFloat 3s ease-in-out infinite alternate',
          filter: 'var(--shadow-md)'
        }}
      />
      <main
        ref={mainRef}
        className="dashboard-main"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          zIndex: 2
        }}>
        <h1
          style={{
            marginBottom: '2rem',
            fontFamily: `${notoFont}, ${dubaiFont}, ${fallbackFont}`,
            fontWeight: 700,
            fontSize: '2.5rem',
            color: 'var(--text-primary)',
            textAlign: 'center',
            lineHeight: 1.4,
            letterSpacing: '0.5px',
            textShadow: 'var(--shadow-md)'
          }}>
          مرحباً بك في منصة سوريا أكاديمي
          <br />
          <span
            style={{
              color: 'var(--primary-color)',
              fontSize: '2.2rem',
              display: 'block',
              marginTop: '0.5rem'
            }}>
            أستاذ {teacherName} 👋
          </span>
        </h1>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            width: '100%',
            maxWidth: 400,
            zIndex: 2
          }}>
          <DashboardButton
            onClick={() => {
              const user = JSON.parse(localStorage.getItem('user'))
              if (!user) {
                navigate('/login')
              } else {
                navigate('/teacher/profile')
              }
            }}
            icon={<ProfileIcon />}>
            الملف الشخصي
          </DashboardButton>
          <DashboardButton onClick={() => navigate('/teacher/create-exam')} icon={<ExamIcon />}>
            إنشاء اختبار
          </DashboardButton>
          <DashboardButton onClick={() => navigate('/teacher/create-question')} icon={<QuestionIcon />}>
            إضافة سؤال
          </DashboardButton>
          <DashboardButton onClick={() => navigate('/teacher/statistics')} icon={<StatsIcon />}>
            الإحصائيات
          </DashboardButton>
        </div>
      </main>
      {/* Animations & Keyframes */}
      <style>{`
        @keyframes logoFloat { 0% { transform: translateY(0); } 100% { transform: translateY(-12px); } }
        @keyframes float0 { 0% { transform: translateY(0); } 100% { transform: translateY(-18px) scale(1.1); } }
        @keyframes float1 { 0% { transform: translateY(0); } 100% { transform: translateY(12px) scale(1.08); } }
        @keyframes float2 { 0% { transform: translateY(0); } 100% { transform: translateY(-10px) scale(1.05); } }
      `}</style>
    </div>
  )
}

function DashboardButton({ onClick, icon, children }) {
  return (
    <button
      className="dashboard-btn"
      style={{
        padding: '1.2rem',
        fontSize: '1.25rem',
        fontWeight: 600,
        borderRadius: 16,
        background: 'var(--gold-gradient)',
        color: 'var(--text-light)',
        boxShadow: 'var(--shadow-md)',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        outline: 'none',
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={e => {
        // موجة عند الضغط
        const btn = e.currentTarget
        const wave = document.createElement('span')
        wave.className = 'btn-wave'
        wave.style.position = 'absolute'
        wave.style.left = e.nativeEvent.offsetX + 'px'
        wave.style.top = e.nativeEvent.offsetY + 'px'
        wave.style.width = wave.style.height = '0px'
        wave.style.background = 'rgba(255,255,255,0.3)'
        wave.style.borderRadius = '50%'
        wave.style.transform = 'translate(-50%, -50%)'
        wave.style.pointerEvents = 'none'
        wave.style.transition = 'width 0.5s, height 0.5s, opacity 0.7s'
        btn.appendChild(wave)
        setTimeout(() => {
          wave.style.width = wave.style.height = '200px'
          wave.style.opacity = '0'
        }, 10)
        setTimeout(() => btn.removeChild(wave), 700)
        onClick()
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.04)'
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
      }}>
      <span style={{ fontSize: '1.7rem', display: 'flex', alignItems: 'center' }}>{icon}</span>
      <span>{children}</span>
    </button>
  )
}

DashboardButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired
}

function ProfileIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="9" r="5" fill="#fff" stroke="#8c694a" strokeWidth="2" />
      <ellipse cx="14" cy="20" rx="8" ry="5" fill="#fff" stroke="#8c694a" strokeWidth="2" />
    </svg>
  )
}
function ExamIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="4" y="6" width="20" height="16" rx="3" fill="#fff" stroke="#80a69b" strokeWidth="2" />
      <rect x="8" y="10" width="12" height="2" rx="1" fill="#d9b282" />
      <rect x="8" y="14" width="8" height="2" rx="1" fill="#d9b282" />
    </svg>
  )
}
function QuestionIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="4" y="4" width="20" height="20" rx="5" fill="#fff" stroke="#8c694a" strokeWidth="2" />
      <path d="M10 12a4 4 0 118 0c0 2-2 3-2 3h-4s-2-1-2-3z" stroke="#d9b282" strokeWidth="2" fill="none" />
      <circle cx="14" cy="19" r="1.5" fill="#d9b282" />
    </svg>
  )
}
function StatsIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="5" y="15" width="3" height="7" rx="1.5" fill="#80a69b" />
      <rect x="11" y="10" width="3" height="12" rx="1.5" fill="#8c694a" />
      <rect x="17" y="6" width="3" height="16" rx="1.5" fill="#d9b282" />
    </svg>
  )
}

export default TeacherDashboard
