import React, { useState } from 'react'
import useApi from '../hooks/useApi'
import StudentSearch from '../components/StudentSearch'
import StudentWeeklyCalendarView from '../components/StudentWeeklyCalendarView'
import LoadingSkeleton from '../components/LoadingSkeleton'

const StudentTimetable = () => {
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [studentData, setStudentData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleStudentSelect = async (student) => {
    setSelectedStudent(student)
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/students/${student.student_id}`)
      const data = await response.json()

      if (data.success) {
        setStudentData(data)
      } else {
        setError(data.error || '無法載入學生課表')
      }
    } catch (err) {
      setError('網路錯誤，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 頁面標題 */}
      <div className="text-center py-6">
        <div className="w-12 h-12 mx-auto bg-accent-100 dark:bg-accent-900 rounded-notion flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">學生課表查詢系統</h1>
        <p className="text-gray-600 dark:text-gray-400">搜尋學生姓名或學號來查看完整的課表安排</p>
      </div>

      {/* 學生搜尋 */}
      <div>
        <StudentSearch onStudentSelect={handleStudentSelect} />
      </div>

      {/* 載入狀態 */}
      {loading && (
        <div className="space-y-6 animate-slide-up">
          <LoadingSkeleton type="student-info" />
          <LoadingSkeleton type="timetable" />
        </div>
      )}

      {/* 錯誤狀態 */}
      {error && (
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-notion p-4 animate-slide-down">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">發生錯誤</h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 學生課表顯示 */}
      {studentData && !loading && !error && (
        <StudentWeeklyCalendarView studentData={studentData} />
      )}

      {/* 歡迎畫面 */}
      {!selectedStudent && !loading && !error && (
        <div className="text-center py-16">
          <div className="max-w-2xl mx-auto">
            <div className="w-24 h-24 mx-auto mb-8 bg-gray-100 dark:bg-gray-700 rounded-notion flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">歡迎使用學生課表查詢</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-12">請在上方搜尋框中輸入學生姓名或學號來查看完整課表</p>

            {/* 功能特色 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-notion p-6 shadow-notion">
                <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">智能搜尋</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">支援中文姓名和英文姓名搜尋</p>
                <div className="flex justify-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200">
                    雙語支援
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-notion p-6 shadow-notion">
                <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">完整課表</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">顯示英文班級、EV & myReading 和 Home Room 課程</p>
                <div className="flex justify-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200">
                    多課程類型
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-notion p-6 shadow-notion">
                <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">詳細資訊</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">提供完整的週課表資訊和統計數據</p>
                <div className="flex justify-center">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200">
                    資訊豐富
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentTimetable