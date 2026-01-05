/**
 * 期末考監考管理頁面（唯讀模式）
 * 顯示已分配的監考老師和教室，支援 CSV 匯出
 */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  examSessionApi,
  classExamInfoApi,
  examStatsApi,
  examExportApi,
  type ExamSession,
  type ClassExamInfo,
  type ExamStats,
} from '../services/examApi';

const ExamProctorPage: React.FC = () => {
  const { t } = useTranslation();

  // State
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [selectedGradeBand, setSelectedGradeBand] = useState<string>('');
  const [classes, setClasses] = useState<ClassExamInfo[]>([]);
  const [stats, setStats] = useState<ExamStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

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
      setError(t('pages.examProctor.loadSessionsError'));
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
      console.error(t('pages.examProctor.loadStatsError'), err);
    }
  };

  const loadClassesByGradeBand = async (gradeBand: string) => {
    try {
      setLoading(true);
      setError('');
      const data = await classExamInfoApi.getByGradeBand(gradeBand);
      setClasses(data.classes);
    } catch (err) {
      setError(t('pages.examProctor.loadClassesError'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportAll = async () => {
    try {
      setLoading(true);
      const blob = await examExportApi.exportAll();
      examExportApi.downloadCSV(blob, 'final_exam_all_classes.csv');
      setSuccessMessage(t('pages.examProctor.exportSuccess'));
    } catch (err) {
      setError(t('pages.examProctor.exportError'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportGradeBand = async () => {
    if (!selectedGradeBand) {
      setError(t('pages.examProctor.selectGradeBandFirst'));
      return;
    }

    try {
      setLoading(true);
      const blob = await examExportApi.exportGradeBand(selectedGradeBand);
      const filename = `final_exam_${selectedGradeBand.replace(/\s/g, '_').replace(/'/g, '')}.csv`;
      examExportApi.downloadCSV(blob, filename);
      setSuccessMessage(t('pages.examProctor.exportSuccess'));
    } catch (err) {
      setError(t('pages.examProctor.exportError'));
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
    const weekdayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const weekday = t(`pages.examProctor.weekdays.${weekdayKeys[date.getDay()]}`);
    return `${month}/${day} (${weekday})`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('pages.examProctor.title')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('pages.examProctor.subtitle')}</p>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{t('pages.examProctor.totalClasses')}</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.overall.total_classes}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">{t('pages.examProctor.assigned')}</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.overall.assigned}</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">{t('pages.examProctor.unassigned')}</p>
            <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.overall.unassigned}</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">{t('pages.examProctor.progress')}</p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.overall.progress_percent}%</p>
          </div>
        </div>
      )}

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {/* Exam Schedule Overview */}
      <div className="mb-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('pages.examProctor.scheduleOverview')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(sessionsByDate).sort().map(([date, dateSessions]) => (
            <div key={date} className="border dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">{formatDate(date)}</h3>
              <div className="space-y-2">
                {dateSessions
                  .sort((a, b) => a.periods.localeCompare(b.periods))
                  .map((session) => (
                    <button
                      key={session.id}
                      onClick={() => setSelectedGradeBand(session.grade_band)}
                      className={`w-full text-left px-3 py-2 rounded text-sm ${
                        selectedGradeBand === session.grade_band
                          ? 'bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-500 font-semibold text-gray-900 dark:text-white'
                          : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{session.grade_band}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{session.periods}</span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{session.exam_time}</div>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Class List - Read Only */}
      {selectedGradeBand && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedGradeBand} - {t('pages.examProctor.proctorAssignment')}</h2>
            <button
              onClick={handleExportGradeBand}
              disabled={loading}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-300"
            >
              {t('pages.examProctor.exportThisGroup')}
            </button>
          </div>

          {loading && <p className="text-center py-4 text-gray-600 dark:text-gray-400">{t('pages.examProctor.loading')}</p>}

          {!loading && classes.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{t('pages.examProctor.table.class')}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{t('pages.examProctor.table.level')}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{t('pages.examProctor.table.students')}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{t('pages.examProctor.table.classTeacher')}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{t('pages.examProctor.table.proctor')}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{t('pages.examProctor.table.examRoom')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {classes.map((cls) => (
                    <tr key={cls.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {cls.class_name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{cls.level}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{cls.students}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {cls.teacher || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-700 dark:text-blue-400">
                        {cls.proctor || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-700 dark:text-green-400">
                        {cls.classroom || '-'}
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
          {t('pages.examProctor.exportAll')}
        </button>
      </div>
    </div>
  );
};

export default ExamProctorPage;
