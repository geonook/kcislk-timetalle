import React from 'react'

const StudentTimetableView = ({ studentData }) => {
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

  const getClassTypeColor = (classType) => {
    switch (classType) {
      case 'english':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ev_myreading':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'homeroom':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getClassTypeLabel = (classType) => {
    switch (classType) {
      case 'english':
        return '英文班'
      case 'ev_myreading':
        return 'EV & myReading'
      case 'homeroom':
        return 'Home Room'
      default:
        return '其他'
    }
  }

  // 如果沒有資料，顯示載入中或錯誤狀態
  if (!studentData || !student.student_id) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-gray-500">
          載入學生資料中...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 學生資訊卡片 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{student.student_name || '未知學生'}</h2>
              <p className="text-sm text-gray-500">學號: {student.student_id || 'N/A'}</p>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>英文班: {student.english_class_name || 'N/A'}</div>
              <div>Home Room: {student.home_room_class_name || 'N/A'}</div>
              {student.ev_myreading_class_name && (
                <div>EV & myReading: {student.ev_myreading_class_name}</div>
              )}
            </div>
          </div>
        </div>

        {/* 統計資訊 */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{statistics.total_classes}</div>
              <div className="text-xs text-gray-500">總課程數</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{statistics.days_with_classes}</div>
              <div className="text-xs text-gray-500">上課天數</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{statistics.english_classes}</div>
              <div className="text-xs text-gray-500">英文課程</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{statistics.ev_myreading_classes}</div>
              <div className="text-xs text-gray-500">EV & myReading</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{statistics.homeroom_classes}</div>
              <div className="text-xs text-gray-500">Home Room</div>
            </div>
          </div>
        </div>
      </div>

      {/* 週課表 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {student.student_name ? `${student.student_name} 的週課表` : '週課表'}
          </h3>
          <p className="text-sm text-gray-500">完整的一週課程安排</p>
        </div>

        <div className="p-6">
          <div className="grid gap-6">
            {days.map(day => {
              const dayClasses = timetable[day] || []

              return (
                <div key={day} className="border border-gray-200 rounded-lg">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h4 className="font-medium text-gray-900">{dayNames[day]}</h4>
                    <p className="text-sm text-gray-500">
                      {dayClasses.length > 0 ? `${dayClasses.length} 堂課` : '無課程'}
                    </p>
                  </div>

                  <div className="p-4">
                    {dayClasses.length > 0 ? (
                      <div className="space-y-3">
                        {dayClasses.map((cls, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getClassTypeColor(cls.class_type)}`}>
                                  {getClassTypeLabel(cls.class_type)}
                                </span>
                                <span className="text-sm font-medium text-gray-900">
                                  {cls.course_name || '課程名稱'}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  {cls.teacher || '未指定教師'}
                                </div>
                                <div className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                  </svg>
                                  {cls.classroom || '未指定教室'}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900">
                                {cls.time || cls.period || '時間未定'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div className="text-sm">這天沒有課程</div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentTimetableView