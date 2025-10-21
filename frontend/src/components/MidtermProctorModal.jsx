import React, { useState, useEffect } from 'react'
import axios from 'axios'

const MidtermProctorModal = ({ isOpen, onClose, proctorData, onSave }) => {
  const [formData, setFormData] = useState({
    proctor_teacher: '',
    classroom: '',
    notes: ''
  })
  const [teachers, setTeachers] = useState([])
  const [classrooms, setClassrooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // 載入教師和教室列表
  useEffect(() => {
    if (isOpen) {
      fetchTeachers()
      fetchClassrooms()

      // 如果是編輯模式，載入現有資料
      if (proctorData && proctorData.id) {
        setFormData({
          proctor_teacher: proctorData.proctor_teacher || '',
          classroom: proctorData.classroom || '',
          notes: proctorData.notes || ''
        })
      } else {
        setFormData({
          proctor_teacher: '',
          classroom: '',
          notes: ''
        })
      }
    }
  }, [isOpen, proctorData])

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('/api/teachers')
      if (response.data.success) {
        setTeachers(response.data.teachers)
      }
    } catch (err) {
      console.error('Failed to fetch teachers:', err)
    }
  }

  const fetchClassrooms = async () => {
    try {
      const response = await axios.get('/api/classrooms')
      if (response.data.success) {
        setClassrooms(response.data.classrooms)
      }
    } catch (err) {
      console.error('Failed to fetch classrooms:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let response

      if (proctorData && proctorData.id) {
        // 更新現有記錄
        response = await axios.put(`/api/midterm/proctors/${proctorData.id}`, formData)
      } else {
        // 新增記錄
        const newData = {
          ...proctorData,
          ...formData
        }
        response = await axios.post('/api/midterm/proctors', newData)
      }

      if (response.data.success) {
        onSave(response.data.proctor)
        onClose()
      }
    } catch (err) {
      setError(err.response?.data?.error || '儲存失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal 內容 */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-notion shadow-xl max-w-md w-full p-6">
          {/* 標題 */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {proctorData && proctorData.id ? '編輯監考資訊' : '填寫監考資訊'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {proctorData?.class_name} - {proctorData?.exam_date} 第{proctorData?.period}節
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 考試資訊卡片 */}
          <div className="bg-accent-50 dark:bg-accent-900/20 rounded-notion p-4 mb-6">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">日期：</span>
                <span className="text-gray-900 dark:text-white font-medium">{proctorData?.exam_date}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">星期：</span>
                <span className="text-gray-900 dark:text-white font-medium">{proctorData?.day_name}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">時段：</span>
                <span className="text-gray-900 dark:text-white font-medium">第{proctorData?.period}節 ({proctorData?.period_time})</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">考試類型：</span>
                <span className="text-gray-900 dark:text-white font-medium">{proctorData?.exam_type}</span>
              </div>
            </div>
          </div>

          {/* 錯誤訊息 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-notion">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* 表單 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 監考老師 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                監考老師 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.proctor_teacher}
                onChange={(e) => setFormData({ ...formData, proctor_teacher: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-notion focus:outline-none focus:ring-2 focus:ring-accent-500 dark:focus:ring-accent-400 text-gray-900 dark:text-white"
                required
              >
                <option value="">請選擇監考老師...</option>
                {teachers.map((teacher) => (
                  <option key={teacher} value={teacher}>
                    {teacher}
                  </option>
                ))}
              </select>
            </div>

            {/* 考場教室 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                考場教室
              </label>
              <select
                value={formData.classroom}
                onChange={(e) => setFormData({ ...formData, classroom: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-notion focus:outline-none focus:ring-2 focus:ring-accent-500 dark:focus:ring-accent-400 text-gray-900 dark:text-white"
              >
                <option value="">請選擇考場教室...</option>
                {classrooms.map((classroom) => (
                  <option key={classroom} value={classroom}>
                    {classroom}
                  </option>
                ))}
              </select>
            </div>

            {/* 備註 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                備註
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-notion focus:outline-none focus:ring-2 focus:ring-accent-500 dark:focus:ring-accent-400 text-gray-900 dark:text-white resize-none"
                placeholder="可填寫特殊說明..."
              />
            </div>

            {/* 按鈕 */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-notion transition-colors"
                disabled={loading}
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-notion transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? '儲存中...' : '儲存'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default MidtermProctorModal
