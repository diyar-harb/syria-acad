import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { testFirebaseConnection } from './services/firebaseTest';
import { testBackendConnection } from './services/testConnection';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherDashboard from './pages/TeacherDashboard';
import ParentDashboard from './pages/ParentDashboard';
import Exam from './pages/Exam';
import Forum from './pages/Forum';
import LearningContent from './pages/LearningContent';
import QuestionBank from './pages/QuestionBank';
import ExamsList from './pages/ExamsList';
import StudentSignup from './pages/StudentSignup';
import TeacherSignup from './pages/TeacherSignup';
import ParentSignup from './pages/ParentSignup';
import About from './pages/About';
import Contact from './pages/Contact';
import Courses from './pages/Courses';
import ResetPassword from './pages/ResetPassword';
import './styles/global.css';

const App = () => {
  useEffect(() => {
    // اختبار الاتصال بـ Firebase عند بدء التطبيق
    testFirebaseConnection();
    
    // اختبار الاتصال بالخادم
    testBackendConnection();
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/student-signup" element={<StudentSignup />} />
              <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
              <Route path="/parent-dashboard" element={<ParentDashboard />} />
              <Route path="/parent-signup" element={<ParentSignup />} />
              <Route path="/exam/:examId" element={<Exam />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/learning" element={<LearningContent />} />
              <Route path="/question-bank" element={<QuestionBank />} />
              <Route path="/exams" element={<ExamsList />} />
              <Route path="/teacher-signup" element={<TeacherSignup />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App; 