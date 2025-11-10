import React, { useState } from 'react'
import useApi from '../hooks/useApi'
import WeeklyCalendarView from '../components/WeeklyCalendarView'

const ClassTimetable = () => {
  const [selectedClass, setSelectedClass] = useState('')
  const { data: classesData, loading: classesLoading } = useApi('/api/classes')
  const { data: timetableData, loading: timetableLoading } = useApi(
    selectedClass ? `/api/timetable/${encodeURIComponent(selectedClass)}` : null,
    [selectedClass]
  )

  const classes = classesData?.classes || []
  const timetable = timetableData?.timetable || {}

  return (
    <div className="space-y-6">
      {/* 頁面標題 */}
      <div className="text-center py-6">
        <div className="w-12 h-12 mx-auto bg-accent-100 dark:bg-accent-900 rounded-notion flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">班級課表查詢</h1>
        <p className="text-gray-600 dark:text-gray-400">選擇班級查看完整的一週課表安排</p>
      </div>

      {/* 班級選擇器 */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-notion focus:outline-none focus:ring-2 focus:ring-accent-500 dark:focus:ring-accent-400 focus:border-transparent text-gray-900 dark:text-white appearance-none transition-colors"
            disabled={classesLoading}
          >
            <option value="">請選擇班級...</option>
            {classes.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {classesLoading && (
          <div className="flex justify-center mt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">載入班級列表中...</div>
          </div>
        )}
      </div>

      {/* 課表顯示 */}
      {selectedClass && (
        <>
          {timetableLoading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-accent-200 border-t-accent-600 rounded-full animate-spin mx-auto mb-4"></div>
                <div className="text-sm text-gray-500 dark:text-gray-400">載入課表中...</div>
              </div>
            </div>
          ) : (
            <WeeklyCalendarView
              timetableData={timetable}
              title={`${selectedClass} 週課表`}
              subtitle="一週課程安排"
            />
          )}
        </>
      )}

      {/* 歡迎畫面 */}
      {!selectedClass && !classesLoading && (
        <div className="text-center py-16">
          <div className="max-w-lg mx-auto">
            <div className="w-24 h-24 mx-auto mb-8 bg-gray-100 dark:bg-gray-700 rounded-notion flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">歡迎使用班級課表查詢</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">請在上方選擇班級以查看該班級的完整週課表安排</p>

            {/* 功能介紹 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-notion p-6 shadow-notion">
                <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">完整時間表</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">顯示完整8節課程安排和準確時間</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-notion p-6 shadow-notion">
                <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">教師資訊</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">顯示任課教師和教室位置</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-notion p-6 shadow-notion">
                <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">清晰設計</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">簡潔明瞭的設計，資訊一目瞭然</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClassTimetable