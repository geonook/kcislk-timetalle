/**
 * 期中考監考管理頁面
 * 支援按 GradeBand 查看班級、分配監考老師、CSV 匯出
 */
import React, { useState, useEffect } from 'react';
import {
  examSessionApi,
  classExamInfoApi,
  proctorAssignmentApi,
  examStatsApi,
  examExportApi,
  type ExamSession,
  type ClassExamInfo,
  type ExamStats,
} from '../services/examApi';

const ExamProctorPage: React.FC = () => {
  // State
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [selectedGradeBand, setSelectedGradeBand] = useState<string>('');
  const [classes, setClasses] = useState<ClassExamInfo[]>([]);
  const [stats, setStats] = useState<ExamStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Form state for proctor assignment
  const [proctorAssignments, setProctorAssignments] = useState<Record<number, { proctor: string; classroom: string }>>({});

  // Load exam sessions on mount
  useEffect(() => {
    loadExamSessions();
    loadStats();
  }, []);

  // Load stats when selected grade band changes
  useEffect(() => {
    if (selectedGradeBand) {
      loadClassesByGradeBand(selectedGradeBand);
    }
  }, [selectedGradeBand]);

  const loadExamSessions = async () => {
    try {
      setLoading(true);
      const data = await examSessionApi.getAll();
      setSessions(data);
    } catch (err) {
      setError('載入考試場次失敗');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await examStatsApi.get();
      setStats(data);
    } catch (err) {
      console.error('載入統計資訊失敗', err);
    }
  };

  const loadClassesByGradeBand = async (gradeBand: string) => {
    try {
      setLoading(true);
      setError('');
      const data = await classExamInfoApi.getByGradeBand(gradeBand);
      setClasses(data.classes);

      // Initialize form state with existing proctor assignments
      const initialAssignments: Record<number, { proctor: string; classroom: string }> = {};
      data.classes.forEach((cls) => {
        initialAssignments[cls.id] = {
          proctor: cls.proctor || '',
          classroom: cls.classroom || '',
        };
      });
      setProctorAssignments(initialAssignments);
    } catch (err) {
      setError('載入班級資料失敗');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProctorChange = (classId: number, field: 'proctor' | 'classroom', value: string) => {
    setProctorAssignments((prev) => ({
      ...prev,
      [classId]: {
        ...prev[classId],
        [field]: value,
      },
    }));
  };

  const handleSaveAll = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');

      // Prepare assignments for batch update
      const assignments = classes.map((cls) => ({
        class_exam_info_id: cls.id,
        proctor_teacher: proctorAssignments[cls.id]?.proctor || '',
        classroom: proctorAssignments[cls.id]?.classroom || '',
      })).filter((a) => a.proctor_teacher && a.classroom);

      const result = await proctorAssignmentApi.batchCreateOrUpdate(assignments);

      setSuccessMessage(
        `成功儲存！新增 ${result.created} 筆，更新 ${result.updated} 筆${
          result.errors.length > 0 ? `，${result.errors.length} 筆失敗` : ''
        }`
      );

      // Reload data
      await loadClassesByGradeBand(selectedGradeBand);
      await loadStats();
    } catch (err) {
      setError('儲存失敗，請重試');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportAll = async () => {
    try {
      setLoading(true);
      const blob = await examExportApi.exportAll();
      examExportApi.downloadCSV(blob, 'midterm_exam_all_classes.csv');
      setSuccessMessage('CSV 匯出成功！');
    } catch (err) {
      setError('CSV 匯出失敗');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportGradeBand = async () => {
    if (!selectedGradeBand) {
      setError('請先選擇 GradeBand');
      return;
    }

    try {
      setLoading(true);
      const blob = await examExportApi.exportGradeBand(selectedGradeBand);
      const filename = `midterm_exam_${selectedGradeBand.replace(/\s/g, '_').replace(/'/g, '')}.csv`;
      examExportApi.downloadCSV(blob, filename);
      setSuccessMessage('CSV 匯出成功！');
    } catch (err) {
      setError('CSV 匯出失敗');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Group sessions by date
  const sessionsByDate = sessions.reduce((acc, session) => {
    if (!acc[session.exam_date]) {
      acc[session.exam_date] = [];
    }
    acc[session.exam_date].push(session);
    return acc;
  }, {} as Record<string, ExamSession[]>);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    return `${month}/${day} (${weekdays[date.getDay()]})`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">期中考監考管理系統</h1>
        <p className="text-gray-600">2025 Fall Semester Midterm Assessment - 監考老師分配</p>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium">總班級數</p>
            <p className="text-2xl font-bold text-blue-900">{stats.overall.total_classes}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">已分配</p>
            <p className="text-2xl font-bold text-green-900">{stats.overall.assigned}</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-600 font-medium">未分配</p>
            <p className="text-2xl font-bold text-orange-900">{stats.overall.unassigned}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-600 font-medium">完成進度</p>
            <p className="text-2xl font-bold text-purple-900">{stats.overall.progress_percent}%</p>
          </div>
        </div>
      )}

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {/* Exam Schedule Overview */}
      <div className="mb-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">考試日程總覽</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(sessionsByDate).sort().map(([date, dateSessions]) => (
            <div key={date} className="border rounded-lg p-4">
              <h3 className="font-bold text-lg mb-3">{formatDate(date)}</h3>
              <div className="space-y-2">
                {dateSessions
                  .sort((a, b) => a.periods.localeCompare(b.periods))
                  .map((session) => (
                    <button
                      key={session.id}
                      onClick={() => setSelectedGradeBand(session.grade_band)}
                      className={`w-full text-left px-3 py-2 rounded text-sm ${
                        selectedGradeBand === session.grade_band
                          ? 'bg-blue-100 border-2 border-blue-500 font-semibold'
                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{session.grade_band}</span>
                        <span className="text-xs text-gray-500">{session.periods}</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{session.exam_time}</div>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Class List and Proctor Assignment */}
      {selectedGradeBand && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{selectedGradeBand} - 監考分配</h2>
            <div className="space-x-2">
              <button
                onClick={handleExportGradeBand}
                disabled={loading}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-300"
              >
                匯出此組 CSV
              </button>
              <button
                onClick={handleSaveAll}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
              >
                {loading ? '儲存中...' : '儲存所有變更'}
              </button>
            </div>
          </div>

          {loading && <p className="text-center py-4">載入中...</p>}

          {!loading && classes.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">班級</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">學生數</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">班級導師</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">監考老師</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">考試教室</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">狀態</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {classes.map((cls) => (
                    <tr key={cls.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        {cls.class_name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{cls.level}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{cls.students}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {cls.teacher || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="text"
                          value={proctorAssignments[cls.id]?.proctor || ''}
                          onChange={(e) => handleProctorChange(cls.id, 'proctor', e.target.value)}
                          placeholder="輸入監考老師"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="text"
                          value={proctorAssignments[cls.id]?.classroom || ''}
                          onChange={(e) => handleProctorChange(cls.id, 'classroom', e.target.value)}
                          placeholder="輸入教室"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {cls.has_proctor ? (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                            已分配
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                            待分配
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Export All Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleExportAll}
          disabled={loading}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-300 font-medium"
        >
          匯出所有班級 CSV（完整 15 欄位格式）
        </button>
      </div>
    </div>
  );
};

export default ExamProctorPage;
