import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout'
import ClassTimetable from './pages/ClassTimetable'
import StudentTimetable from './pages/StudentTimetable'
import MidtermProctor from './pages/MidtermProctor'

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<ClassTimetable />} />
          <Route path="/student" element={<StudentTimetable />} />
          <Route path="/midterm" element={<MidtermProctor />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  )
}

export default App