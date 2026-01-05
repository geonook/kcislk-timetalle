/**
 * 期末考監考管理頁面（唯讀模式）
 * 顯示已分配的監考老師和教室，支援 CSV 匯出
 * RWD 優化：手機版使用卡片式佈局和 Tab 選擇器
 */
import React, { useState, useEffect, useMemo } from 'react';
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
  const [activeDate, setActiveDate] = useState<string>('');

  // Group sessions by date
  const sessionsByDate = useMemo(() => {
    return sessions.reduce((acc, session) => {
      if (!acc[session.exam_date]) {
        acc[session.exam_date] = [];
      }
      acc[session.exam_date].push(session);
      return acc;
    }, {} as Record<string, ExamSession[]>);
  }, [sessions]);

  // Load exam sessions on mount
  useEffect(() => {
    loadExamSessions();
    loadStats();
  }, []);

  // Initialize activeDate when sessions load
  useEffect(() => {
    if (sessions.length > 0 && !activeDate) {
      const dates = Object.keys(sessionsByDate).sort();
      if (dates.length > 0) {
        setActiveDate(dates[0]);
      }
    }
  }, [sessions, sessionsByDate, activeDate]);

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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const weekday = t(`pages.examProctor.weekdays.${weekdayKeys[date.getDay()]}`);
    return `${month}/${day} (${weekday})`;
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
      {/* Header - 響應式標題 */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
          {t('pages.examProctor.title')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {t('pages.examProctor.subtitle')}
        </p>
      </div>

      {/* Statistics - 手機版 2x2，桌面版 4 欄 */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium">
              {t('pages.examProctor.totalClasses')}
            </p>
            <p className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-100">
              {stats.overall.total_classes}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium">
              {t('pages.examProctor.assigned')}
            </p>
            <p className="text-xl sm:text-2xl font-bold text-green-900 dark:text-green-100">
              {stats.overall.assigned}
            </p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-orange-600 dark:text-orange-400 font-medium">
              {t('pages.examProctor.unassigned')}
            </p>
            <p className="text-xl sm:text-2xl font-bold text-orange-900 dark:text-orange-100">
              {stats.overall.unassigned}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 font-medium">
              {t('pages.examProctor.progress')}
            </p>
            <p className="text-xl sm:text-2xl font-bold text-purple-900 dark:text-purple-100">
              {stats.overall.progress_percent}%
            </p>
          </div>
        </div>
      )}

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded text-sm sm:text-base">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded text-sm sm:text-base">
          {successMessage}
        </div>
      )}

      {/* Exam Schedule Overview */}
      <div className="mb-4 sm:mb-8 bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
          {t('pages.examProctor.scheduleOverview')}
        </h2>

        {/* 手機版：橫向滑動日期 Tab 選擇器 */}
        <div className="md:hidden">
          {/* 日期 Tab */}
          <div className="flex overflow-x-auto pb-3 mb-3 -mx-1 px-1 gap-2 scrollbar-hide">
            {Object.keys(sessionsByDate).sort().map((date) => (
              <button
                key={date}
                onClick={() => setActiveDate(date)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all
                  ${activeDate === date
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 active:bg-gray-200 dark:active:bg-gray-600'
                  }`}
              >
                {formatDate(date)}
              </button>
            ))}
          </div>

          {/* 選中日期的 GradeBand 列表 - 手機單欄，小平板雙欄 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activeDate && sessionsByDate[activeDate]
              ?.sort((a, b) => a.periods.localeCompare(b.periods))
              .map((session) => (
                <button
                  key={session.id}
                  onClick={() => setSelectedGradeBand(session.grade_band)}
                  className={`w-full text-left p-4 rounded-lg transition-all min-h-[56px] ${
                    selectedGradeBand === session.grade_band
                      ? 'bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-500 font-semibold text-gray-900 dark:text-white'
                      : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 active:bg-gray-100 dark:active:bg-gray-600 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium">{session.grade_band}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                      {session.periods}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{session.exam_time}</div>
                </button>
              ))}
          </div>
        </div>

        {/* iPad/桌面版：三欄並排 */}
        <div className="hidden md:grid md:grid-cols-3 gap-4">
          {Object.entries(sessionsByDate).sort().map(([date, dateSessions]) => (
            <div key={date} className="border dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-bold text-base lg:text-lg text-gray-900 dark:text-white mb-3">{formatDate(date)}</h3>
              <div className="space-y-2">
                {dateSessions
                  .sort((a, b) => a.periods.localeCompare(b.periods))
                  .map((session) => (
                    <button
                      key={session.id}
                      onClick={() => setSelectedGradeBand(session.grade_band)}
                      className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-all ${
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
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6">
          {/* 標題和按鈕 - 手機版堆疊，桌面版並排 */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {selectedGradeBand} - {t('pages.examProctor.proctorAssignment')}
            </h2>
            <button
              onClick={handleExportGradeBand}
              disabled={loading}
              className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 font-medium text-sm transition-all active:scale-[0.98]"
            >
              {t('pages.examProctor.exportThisGroup')}
            </button>
          </div>

          {loading && (
            <p className="text-center py-4 text-gray-600 dark:text-gray-400">
              {t('pages.examProctor.loading')}
            </p>
          )}

          {!loading && classes.length > 0 && (
            <>
              {/* 手機/iPad 版：卡片式佈局（手機單欄，iPad 雙欄） */}
              <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
                {classes.map((cls) => (
                  <div
                    key={cls.id}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-100 dark:border-gray-600"
                  >
                    <div className="mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                        {cls.class_name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {cls.level} · {cls.students} {t('pages.examProctor.table.students')}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                          {t('pages.examProctor.table.proctor')}
                        </p>
                        <p className="font-medium text-blue-700 dark:text-blue-400 text-sm">
                          {cls.proctor || '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                          {t('pages.examProctor.table.examRoom')}
                        </p>
                        <p className="font-medium text-green-700 dark:text-green-400 text-sm">
                          {cls.classroom || '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 桌面版：表格佈局（≥1024px） */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        {t('pages.examProctor.table.class')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        {t('pages.examProctor.table.level')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        {t('pages.examProctor.table.students')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        {t('pages.examProctor.table.classTeacher')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        {t('pages.examProctor.table.proctor')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        {t('pages.examProctor.table.examRoom')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {classes.map((cls) => (
                      <tr key={cls.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {cls.class_name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {cls.level}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {cls.students}
                        </td>
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
            </>
          )}
        </div>
      )}

      {/* Export All Button - 手機版全寬，桌面版置中 */}
      <div className="mt-4 sm:mt-8">
        <button
          onClick={handleExportAll}
          disabled={loading}
          className="w-full sm:w-auto sm:mx-auto sm:block px-6 py-4 sm:py-3 bg-green-600 text-white rounded-xl sm:rounded-lg hover:bg-green-700 disabled:bg-green-300 font-medium text-base sm:text-sm transition-all active:scale-[0.98]"
        >
          {t('pages.examProctor.exportAll')}
        </button>
      </div>
    </div>
  );
};

export default ExamProctorPage;
