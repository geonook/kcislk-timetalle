import React, { useState, useEffect } from 'react'

const StudentWeeklyCalendarView = ({ studentData }) => {
  // 安全地取得資料，使用預設值避免錯誤
  const student = studentData?.student || {}
  const timetable = studentData?.timetable || {}
  const statistics = studentData?.statistics || {
    total_classes: 0,
    days_with_classes: 0,
    english_classes: 0,
    ev_myreading_classes: 0,
    homeroom_classes: 0
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const dayNames = {
    Monday: '星期一',
    Tuesday: '星期二',
    Wednesday: '星期三',
    Thursday: '星期四',
    Friday: '星期五'
  }

  // 固定顯示8節課
  const allPeriods = [1, 2, 3, 4, 5, 6, 7, 8]

  // 標準節次時間表
  const periodTimes = {
    1: '08:00-08:45',
    2: '08:55-09:40',
    3: '10:00-10:45',
    4: '10:55-11:40',
    5: '13:30-14:15',
    6: '14:25-15:10',
    7: '15:30-16:15',
    8: '16:25-17:10'
  }

  // 當前時間狀態
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000) // 每分鐘更新
    return () => clearInterval(timer)
  }, [])

  // 判斷當前時間是否在某個時段內
  const isCurrentPeriod = (period) => {
    const now = currentTime
    const currentDay = now.getDay() // 0=Sunday, 1=Monday, ...
    const isWeekday = currentDay >= 1 && currentDay <= 5

    if (!isWeekday) return false

    const timeStr = periodTimes[period]
    if (!timeStr) return false

    const [start, end] = timeStr.split('-')
    const [startHour, startMin] = start.split(':').map(Number)
    const [endHour, endMin] = end.split(':').map(Number)

    const currentHour = now.getHours()
    const currentMin = now.getMinutes()
    const currentTotal = currentHour * 60 + currentMin
    const startTotal = startHour * 60 + startMin
    const endTotal = endHour * 60 + endMin

    return currentTotal >= startTotal && currentTotal <= endTotal
  }

  // 獲取當前星期幾（英文）
  const getCurrentDay = () => {
    const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return dayMap[currentTime.getDay()]
  }

  // 獲取課程類型顏色
  const getCourseColor = (classType) => {
    switch (classType) {
      case 'english': return 'bg-course-english/10 border-course-english text-course-english'
      case 'ev_myreading': return 'bg-course-ev/10 border-course-ev text-course-ev'
      case 'homeroom': return 'bg-course-homeroom/10 border-course-homeroom text-course-homeroom'
      default: return 'bg-course-general/10 border-course-general text-course-general'
    }
  }

  // 獲取課程類型標籤
  const getCourseTypeLabel = (classType) => {
    switch (classType) {
      case 'english': return 'EN'
      case 'ev_myreading': return 'EV'
      case 'homeroom': return 'HR'
      default: return 'GE'
    }
  }

  // 根據星期和節次獲取課程
  const getClassForPeriod = (day, period) => {
    const dayClasses = timetable[day] || []
    return dayClasses.find(cls => {
      // 處理不同的 period 格式：純數字、"(3)10:20-11:00" 等
      const periodMatch = cls.period?.toString().match(/\((\d+)\)/) || cls.period?.toString().match(/^(\d+)$/)
      return periodMatch && parseInt(periodMatch[1]) === period
    }) || null
  }

  // 如果沒有資料，顯示載入中狀態
  if (!studentData || !student.student_id) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-notion shadow-notion p-6">
        <div className="text-center text-gray-500 dark:text-gray-400">
          載入學生資料中...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 學生資訊卡片 - Notion風格簡潔設計 */}
      <div className="bg-white dark:bg-dark-card rounded-notion shadow-notion dark:shadow-dark overflow-hidden">
        <div className="bg-gray-50 dark:bg-dark-hover px-6 py-4 border-b border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{student.student_name || '未知學生'}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">學號: {student.student_id || 'N/A'}</p>
              </div>
            </div>
            <div className="text-right text-sm space-y-1">
              <div className="text-gray-600 dark:text-gray-300">
                <span className="text-gray-500 dark:text-gray-400">英文班:</span>
                <span className="ml-2 font-medium">{student.english_class_name || 'N/A'}</span>
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                <span className="text-gray-500 dark:text-gray-400">Home Room:</span>
                <span className="ml-2 font-medium">{student.homeroom_class_name || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 統計資訊 */}
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.total_classes}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">總課程數</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.english_classes}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">英文課程</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.ev_myreading_classes}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">EV & myReading</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.homeroom_classes}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Home Room</div>
            </div>
          </div>
        </div>
      </div>

      {/* 課表區域 */}
      <div className="bg-white dark:bg-gray-800 rounded-notion shadow-notion overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">個人週課表</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">完整的一週課程安排</p>
        </div>

        {/* 響應式表格容器 */}
        <div className="overflow-hidden">
          {/* Desktop版本：完整表格 */}
          <div className="hidden lg:block">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <th className="w-20 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    節次
                  </th>
                  {days.map(day => (
                    <th key={day} className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white text-sm">{dayNames[day]}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">{day.slice(0,3)}</div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {allPeriods.map(period => (
                  <tr key={period} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 rounded-full flex items-center justify-center text-sm font-semibold">
                          {period}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{periodTimes[period]}</div>
                      </div>
                    </td>
                    {days.map(day => {
                      const classInfo = getClassForPeriod(day, period)
                      return (
                        <td key={`${day}-${period}`} className="px-4 py-4">
                          {classInfo ? (
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-notion p-3 hover:shadow-notion-hover transition-shadow">
                              <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {classInfo.subject || classInfo.teacher || '課程'}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {classInfo.teacher && classInfo.classroom ?
                                    `${classInfo.teacher} / ${classInfo.classroom}` :
                                    (classInfo.teacher || classInfo.classroom || '詳細資訊')}
                                </div>
                                {classInfo.class_type && (
                                  <div className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200">
                                    {classInfo.class_type === 'english' ? 'EN' :
                                     classInfo.class_type === 'ev_myreading' ? 'EV' :
                                     classInfo.class_type === 'homeroom' ? 'HR' : 'GE'}
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="h-16 flex items-center justify-center">
                              <div className="w-8 h-8 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-notion flex items-center justify-center">
                                <span className="text-xs text-gray-400 dark:text-gray-500">-</span>
                              </div>
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile版本：縱向卡片布局 */}
          <div className="lg:hidden">
            {days.map(day => (
              <div key={day} className="border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white">{dayNames[day]}</h4>
                </div>
                <div className="p-4 space-y-3">
                  {allPeriods.map(period => {
                    const classInfo = getClassForPeriod(day, period)
                    return (
                      <div key={period} className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold">{period}</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500 dark:text-gray-400">{periodTimes[period]}</div>
                          {classInfo ? (
                            <div className="mt-1">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {classInfo.subject || classInfo.teacher || '課程'}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {classInfo.teacher && classInfo.classroom ?
                                  `${classInfo.teacher} / ${classInfo.classroom}` :
                                  (classInfo.teacher || classInfo.classroom || '詳細資訊')}
                              </div>
                              {classInfo.class_type && (
                                <div className="mt-1">
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200">
                                    {classInfo.class_type === 'english' ? 'EN' :
                                     classInfo.class_type === 'ev_myreading' ? 'EV' :
                                     classInfo.class_type === 'homeroom' ? 'HR' : 'GE'}
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="mt-1 text-sm text-gray-400 dark:text-gray-500">空堂</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentWeeklyCalendarView