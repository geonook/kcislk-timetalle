import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const StudentSearch = ({ onStudentSelect }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem('searchHistory')
    return saved ? JSON.parse(saved) : []
  })
  const [showHistory, setShowHistory] = useState(false)
  const searchRef = useRef(null)
  const resultsRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target)
      ) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const searchStudents = async () => {
      if (query.trim().length < 2) {
        setResults([])
        setShowResults(false)
        return
      }

      setLoading(true)
      try {
        const response = await axios.get(`/api/students/search?q=${encodeURIComponent(query)}`)
        if (response.data.success) {
          setResults(response.data.students || [])
          setShowResults(true)
        } else {
          setResults([])
          setShowResults(false)
        }
      } catch (error) {
        console.error('搜尋學生時發生錯誤:', error)
        setResults([])
        setShowResults(false)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(searchStudents, 300) // 防抖動
    return () => clearTimeout(timeoutId)
  }, [query])

  const handleStudentClick = (student) => {
    setQuery(student.student_name)
    setShowResults(false)
    setShowHistory(false)

    // 更新搜尋歷史
    const newHistory = [student, ...searchHistory.filter(s => s.student_id !== student.student_id)].slice(0, 5)
    setSearchHistory(newHistory)
    localStorage.setItem('searchHistory', JSON.stringify(newHistory))

    onStudentSelect(student)
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setShowResults(false)
    setShowHistory(false)
  }

  const handleInputFocus = () => {
    if (results.length > 0) {
      setShowResults(true)
    } else if (query.length === 0 && searchHistory.length > 0) {
      setShowHistory(true)
    }
  }

  // 鍵盤快捷鍵支援
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="relative max-w-2xl mx-auto">
      <div ref={searchRef} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleInputFocus}
            placeholder="請輸入學生姓名或學號..."
            className="w-full px-4 py-3 pl-12 pr-24 bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border rounded-notion focus:outline-none focus:ring-2 focus:ring-accent-500 dark:focus:ring-accent-400 focus:border-transparent text-gray-900 dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent-600"></div>
            ) : (
              <svg className="h-5 w-5 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
          {/* 清除按鈕和快捷鍵提示 */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
            {query && (
              <button
                onClick={clearSearch}
                className="p-1 hover:bg-gray-100 dark:hover:bg-dark-hover rounded transition-colors"
              >
                <svg className="w-4 h-4 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-dark-hover rounded">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        {showResults && results.length > 0 && (
          <div
            ref={resultsRef}
            className="absolute z-10 w-full mt-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-notion shadow-notion dark:shadow-dark max-h-96 overflow-y-auto animate-slide-down"
          >
            {results.map((student) => (
              <div
                key={student.student_id}
                onClick={() => handleStudentClick(student)}
                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-hover cursor-pointer border-b border-gray-100 dark:border-dark-border last:border-b-0 transition-all hover:pl-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{student.student_name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">學號: {student.student_id}</div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-accent-600 dark:text-accent-400 font-medium">{student.english_class_name}</div>
                    <div className="text-gray-500 dark:text-gray-400">Home Room: {student.home_room_class_name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showResults && query.trim().length >= 2 && results.length === 0 && !loading && (
          <div
            ref={resultsRef}
            className="absolute z-10 w-full mt-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-notion shadow-notion dark:shadow-dark animate-slide-down"
          >
            <div className="px-4 py-6 text-center">
              <svg className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-dark-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <div className="text-sm text-gray-500 dark:text-dark-text-secondary">找不到匹配的學生</div>
              <div className="text-xs text-gray-400 dark:text-dark-text-muted mt-1">請嘗試使用不同的關鍵字</div>
            </div>
          </div>
        )}

        {/* 搜尋歷史 */}
        {showHistory && searchHistory.length > 0 && !showResults && (
          <div
            ref={resultsRef}
            className="absolute z-10 w-full mt-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-notion shadow-notion dark:shadow-dark animate-slide-down"
          >
            <div className="px-4 py-2 border-b border-gray-100 dark:border-dark-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 dark:text-dark-text-secondary">最近搜尋</span>
                <button
                  onClick={() => {
                    setSearchHistory([])
                    localStorage.removeItem('searchHistory')
                    setShowHistory(false)
                  }}
                  className="text-xs text-gray-400 dark:text-dark-text-muted hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                >
                  清除歷史
                </button>
              </div>
            </div>
            {searchHistory.map((student) => (
              <div
                key={student.student_id}
                onClick={() => handleStudentClick(student)}
                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-hover cursor-pointer border-b border-gray-50 dark:border-dark-border last:border-b-0 transition-all hover:pl-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400 dark:text-dark-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{student.student_name}</div>
                      <div className="text-xs text-gray-500 dark:text-dark-text-secondary">學號: {student.student_id}</div>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="text-accent-600 dark:text-accent-400">{student.english_class_name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentSearch