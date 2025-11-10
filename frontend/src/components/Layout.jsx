import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

const Layout = ({ children }) => {
  const [language, setLanguage] = useState('zh')
  const location = useLocation()

  const text = {
    zh: {
      title: '課表查詢系統',
      classSchedule: '班級課表',
      studentSchedule: '學生課表',
    },
    en: {
      title: 'Timetable System',
      classSchedule: 'Class Schedule',
      studentSchedule: 'Student Schedule',
    }
  }

  const currentText = text[language]

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
      <header className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-accent-600 rounded-notion flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{currentText.title}</h1>
            </div>

            <nav className="flex items-center space-x-2">
              <Link
                to="/"
                className={`px-4 py-2 rounded-notion text-sm font-medium transition-colors ${
                  location.pathname === '/'
                    ? 'bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>{currentText.classSchedule}</span>
                </div>
              </Link>

              <Link
                to="/student"
                className={`px-4 py-2 rounded-notion text-sm font-medium transition-colors ${
                  location.pathname === '/student'
                    ? 'bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-300'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{currentText.studentSchedule}</span>
                </div>
              </Link>

              <div className="ml-4 flex items-center space-x-2">
                <ThemeToggle />

                <button
                  onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                  className="px-3 py-2 rounded-notion text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    <span>{language === 'zh' ? 'EN' : '中'}</span>
                  </div>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

export default Layout