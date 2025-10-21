import React, { useState, useEffect } from 'react'
import axios from 'axios'
import MidtermProctorModal from '../components/MidtermProctorModal'

const MidtermProctor = () => {
  const [schedule, setSchedule] = useState(null)
  const [proctors, setProctors] = useState([])
  const [classes, setClasses] = useState([])
  const [statistics, setStatistics] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedGrade, setSelectedGrade] = useState('all')
  const [viewMode, setViewMode] = useState('calendar') // calendar, table, stats
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalData, setModalData] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [initialized, setInitialized] = useState(false)

  // 載入初始資料
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [scheduleRes, classesRes] = await Promise.all([
        axios.get('/api/midterm/schedule'),
        axios.get('/api/classes')
      ])

      if (scheduleRes.data.success) {
        setSchedule(scheduleRes.data.schedule)
        setSelectedDate(scheduleRes.data.schedule.exam_dates[0]?.date)
      }

      if (classesRes.data.success) {
        setClasses(classesRes.data.classes)
      }

      await loadProctors()
      await loadStatistics()
    } catch (err) {
      setError('載入資料失敗：' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadProctors = async () => {
    try {
      const response = await axios.get('/api/midterm/proctors')
      if (response.data.success) {
        setProctors(response.data.proctors)
      }
    } catch (err) {
      console.error('Failed to load proctors:', err)
    }
  }

  const loadStatistics = async () => {
    try {
      const response = await axios.get('/api/midterm/statistics')
      if (response.data.success) {
        setStatistics(response.data.statistics)
      }
    } catch (err) {
      console.error('Failed to load statistics:', err)
    }
  }

  // 初始化監考記錄
  const handleInitialize = async () => {
    if (!window.confirm('確定要初始化監考記錄嗎？這將為所有班級建立空白的監考記錄。')) {
      return
    }

    try {
      setLoading(true)
      const response = await axios.post('/api/midterm/initialize')
      if (response.data.success) {
        alert(`初始化完成！\n新增 ${response.data.created} 筆記錄\n跳過 ${response.data.skipped} 筆已存在記錄`)
        await loadProctors()
        await loadStatistics()
        setInitialized(true)
      }
    } catch (err) {
      alert('初始化失敗：' + (err.response?.data?.error || err.message))
    } finally {
      setLoading(false)
    }
  }

  // 匯出 CSV
  const handleExport = async () => {
    try {
      const response = await axios.get('/api/midterm/proctors/export', {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'midterm_proctors.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      alert('匯出失敗：' + err.message)
    }
  }

  // 打開填寫監考Modal
  const handleOpenModal = (examDate, session, className) => {
    const dateInfo = schedule.exam_dates.find(d => d.date === examDate)
    const classGrade = className.split(' ')[0]

    // 檢查是否已有記錄
    const existing = proctors.find(
      p => p.exam_date === examDate && p.period === session.period && p.class_name === className
    )

    const data = existing || {
      exam_date: examDate,
      day_name: dateInfo.day_name,
      period: session.period,
      period_time: session.time,
      grade: classGrade,
      class_name: className,
      exam_type: session.exam_type
    }

    setModalData(data)
    setIsModalOpen(true)
  }

  const handleSaveProctor = async (updatedProctor) => {
    await loadProctors()
    await loadStatistics()
  }

  // 取得指定班級在指定時段的監考資訊
  const getProctorInfo = (examDate, period, className) => {
    return proctors.find(
      p => p.exam_date === examDate && p.period === period && p.class_name === className
    )
  }

  // 日曆視圖
  const renderCalendarView = () => {
    if (!schedule || !selectedDate) return null

    const dateInfo = schedule.exam_dates.find(d => d.date === selectedDate)
    if (!dateInfo) return null

    return (
      <div className="space-y-6">
        {/* 日期選擇器 */}
        <div className="flex gap-2">
          {schedule.exam_dates.map((date) => (
            <button
              key={date.date}
              onClick={() => setSelectedDate(date.date)}
              className={`px-4 py-2 rounded-notion transition-colors ${
                selectedDate === date.date
                  ? 'bg-accent-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {date.date} ({date.day_name})
            </button>
          ))}
        </div>

        {/* 考試時段列表 */}
        <div className="space-y-4">
          {dateInfo.exam_sessions.map((session) => {
            const sessionClasses = classes.filter(c => {
              const grade = c.split(' ')[0]
              return session.grades.includes(grade)
            })

            return (
              <div key={`${session.period}`} className="bg-white dark:bg-gray-800 rounded-notion p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      第 {session.period} 節 ({session.time})
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {session.exam_type} - 年級: {session.grades.join(', ')}
                    </p>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">班級數:</span>
                    <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                      {sessionClasses.length}
                    </span>
                  </div>
                </div>

                {/* 班級列表 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sessionClasses.map((className) => {
                    const proctorInfo = getProctorInfo(selectedDate, session.period, className)
                    const hasProctor = proctorInfo && proctorInfo.proctor_teacher

                    return (
                      <button
                        key={className}
                        onClick={() => handleOpenModal(selectedDate, session, className)}
                        className={`p-4 rounded-notion text-left transition-all border-2 ${
                          hasProctor
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-600 hover:bg-green-100 dark:hover:bg-green-900/30'
                            : 'bg-gray-50 dark:bg-gray-700/50 border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                              {className}
                            </p>
                            {hasProctor ? (
                              <>
                                <p className="text-sm text-green-700 dark:text-green-400">
                                  ✓ {proctorInfo.proctor_teacher}
                                </p>
                                {proctorInfo.classroom && (
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    教室: {proctorInfo.classroom}
                                  </p>
                                )}
                              </>
                            ) : (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                點擊填寫監考老師
                              </p>
                            )}
                          </div>
                          {hasProctor && (
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // 表格視圖
  const renderTableView = () => {
    const filteredProctors = selectedGrade === 'all'
      ? proctors
      : proctors.filter(p => p.grade === selectedGrade)

    return (
      <div className="space-y-4">
        {/* 年級篩選器 */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedGrade('all')}
            className={`px-4 py-2 rounded-notion transition-colors ${
              selectedGrade === 'all'
                ? 'bg-accent-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            全部
          </button>
          {['G1', 'G2', 'G3', 'G4', 'G5', 'G6'].map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`px-4 py-2 rounded-notion transition-colors ${
                selectedGrade === grade
                  ? 'bg-accent-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {grade}
            </button>
          ))}
        </div>

        {/* 表格 */}
        <div className="bg-white dark:bg-gray-800 rounded-notion overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    班級
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    日期
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    節次
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    考試類型
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    監考老師
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    教室
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProctors.map((proctor) => (
                  <tr key={proctor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {proctor.class_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {proctor.exam_date}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      第{proctor.period}節<br />
                      <span className="text-xs">({proctor.period_time})</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {proctor.exam_type}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {proctor.proctor_teacher ? (
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {proctor.proctor_teacher}
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">未填寫</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {proctor.classroom || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => {
                          setModalData(proctor)
                          setIsModalOpen(true)
                        }}
                        className="text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300"
                      >
                        {proctor.proctor_teacher ? '編輯' : '填寫'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // 統計視圖
  const renderStatisticsView = () => {
    if (!statistics) return null

    return (
      <div className="space-y-6">
        {/* 總體統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-notion p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">總考試時段</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {statistics.total_proctors}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-notion p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">已安排</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
              {statistics.assigned_proctors}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-notion p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">待安排</p>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">
              {statistics.unassigned_proctors}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-notion p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">完成度</p>
            <p className="text-3xl font-bold text-accent-600 dark:text-accent-400 mt-2">
              {statistics.completion_percentage}%
            </p>
          </div>
        </div>

        {/* 各年級進度 */}
        <div className="bg-white dark:bg-gray-800 rounded-notion p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            各年級監考安排進度
          </h3>
          <div className="space-y-4">
            {Object.entries(statistics.grade_stats).map(([grade, stats]) => (
              <div key={grade}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {grade}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {stats.assigned} / {stats.total} ({stats.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-accent-600 dark:bg-accent-500 h-2 rounded-full transition-all"
                    style={{ width: `${stats.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (loading && !schedule) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">載入中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={loadInitialData}
            className="mt-4 px-4 py-2 bg-accent-600 text-white rounded-notion hover:bg-accent-700"
          >
            重新載入
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 頁面標題 */}
      <div className="text-center py-6">
        <div className="w-12 h-12 mx-auto bg-accent-100 dark:bg-accent-900 rounded-notion flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          2025 期中考監考管理
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          114學年度第一學期期中評量監考老師安排
        </p>
      </div>

      {/* 工具列 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* 視圖切換 */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-notion transition-colors ${
              viewMode === 'calendar'
                ? 'bg-accent-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            📅 日曆視圖
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-notion transition-colors ${
              viewMode === 'table'
                ? 'bg-accent-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            📋 表格視圖
          </button>
          <button
            onClick={() => setViewMode('stats')}
            className={`px-4 py-2 rounded-notion transition-colors ${
              viewMode === 'stats'
                ? 'bg-accent-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            📊 統計資訊
          </button>
        </div>

        {/* 操作按鈕 */}
        <div className="flex gap-2">
          {!initialized && proctors.length === 0 && (
            <button
              onClick={handleInitialize}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-notion transition-colors"
            >
              🚀 初始化監考記錄
            </button>
          )}
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-notion transition-colors"
          >
            📥 匯出 CSV
          </button>
        </div>
      </div>

      {/* 內容區域 */}
      {viewMode === 'calendar' && renderCalendarView()}
      {viewMode === 'table' && renderTableView()}
      {viewMode === 'stats' && renderStatisticsView()}

      {/* 監考填寫 Modal */}
      <MidtermProctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        proctorData={modalData}
        onSave={handleSaveProctor}
      />
    </div>
  )
}

export default MidtermProctor
