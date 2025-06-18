import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import '../styles/QuestionBank.css'
import PropTypes from 'prop-types'

const QuestionCard = ({ q }) => {
  const [showAnswer, setShowAnswer] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  return (
    <div className="question-card">
      <h3>{q.question}</h3>
      <div className="question-meta">
        <span>المعلم: {q.teacherName}</span>
        <span>المادة: {q.subject}</span>
        <span>الصف: {q.grade}</span>
        <span>الصعوبة: {q.difficulty}</span>
      </div>
      <div className="answer">
        <strong>الحل:</strong>
        <span className={showAnswer ? 'reveal-content' : 'hide-content'}>{q.answer}</span>
        <button className="reveal-btn" aria-label={showAnswer ? 'إخفاء الحل' : 'إظهار الحل'} onClick={() => setShowAnswer(v => !v)}>{showAnswer ? '📖' : '📕'}</button>
      </div>
      <div className="explanation">
        <strong>التفسير:</strong>
        <span className={showExplanation ? 'reveal-content' : 'hide-content'}>{q.explanation}</span>
        <button className="reveal-btn" aria-label={showExplanation ? 'إخفاء التفسير' : 'إظهار التفسير'} onClick={() => setShowExplanation(v => !v)}>{showExplanation ? '📖' : '📕'}</button>
      </div>
    </div>
  )
}

QuestionCard.propTypes = {
  q: PropTypes.shape({
    question: PropTypes.string.isRequired,
    teacherName: PropTypes.string,
    subject: PropTypes.string,
    grade: PropTypes.string,
    difficulty: PropTypes.string,
    answer: PropTypes.string,
    explanation: PropTypes.string,
  }).isRequired,
}

const QuestionBank = () => {
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    const fetchQuestions = async () => {
      const snapshot = await getDocs(collection(db, 'questionBank'))
      setQuestions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    }
    fetchQuestions()
  }, [])

  const subjects = [...new Set(questions.map(q => q.subject))]

  return (
    <motion.div className="question-bank" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h1>بنك الأسئلة</h1>
      {subjects.map(subject => (
        <div key={subject} className="subject-section">
          <h2>{subject}</h2>
          <div className="questions-grid">
            {questions
              .filter(q => q.subject === subject)
              .map(q => (
                <QuestionCard key={q.id} q={q} />
              ))}
          </div>
        </div>
      ))}
    </motion.div>
  )
}

export default QuestionBank
