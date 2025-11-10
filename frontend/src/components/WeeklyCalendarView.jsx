import React from 'react'

const WeeklyCalendarView = ({ timetableData, title, subtitle }) => {
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

  // 根據星期和節次獲取課程
  const getClassForPeriod = (day, period) => {
    const dayClasses = timetableData[day] || []
    return dayClasses.find(cls => cls.period === period) || null
  }

  if (!timetableData || Object.keys(timetableData).length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-notion shadow-notion overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-notion flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">暫無課程資料</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">請選擇班級以查看課表安排</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-notion shadow-notion overflow-hidden">
      {/* 標題區域 - Notion風格簡潔設計 */}
      <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
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
                                {classInfo.teacher || '未指定教師'}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {classInfo.classroom || '未指定教室'}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="h-12 flex items-center justify-center">
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
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">{dayNames[day]}</h3>
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
                              {classInfo.teacher || '未指定教師'}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {classInfo.classroom || '未指定教室'}
                            </div>
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
  )
}

export default WeeklyCalendarView