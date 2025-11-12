import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiService } from '../services/api';
import SearchBox from '../components/ui/SearchBox';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import TeacherCard from '../components/ui/TeacherCard';
import PrintButton from '../components/ui/PrintButton';
import UnifiedTimetableGrid from '../components/timetable/UnifiedTimetableGrid';
import PrintableTimetable from '../components/print/PrintableTimetable';
import { mergeStudentTimetables, hasAnyTimetableData } from '../utils/timetableUtils';
import { AcademicCapIcon, ArrowLeftIcon, PrinterIcon } from '@heroicons/react/24/outline';
import type { Teacher, TeacherTimetableResponse } from '../types';

export default function TeacherPage() {
  const { t } = useTranslation();
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [teacherTimetable, setTeacherTimetable] = useState<TeacherTimetableResponse | null>(null);
  const [timetableError, setTimetableError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all teachers once (like StudentPage pattern)
  const { data: allTeachers = [], isLoading: isLoadingTeachers } = useQuery({
    queryKey: ['teachers'],
    queryFn: apiService.getAllTeachers,
    staleTime: 5 * 60 * 1000, // 5 分鐘內不重新請求
  });

  // Client-side filtering (instant response)
  const filteredTeachers = useMemo(() => {
    if (!searchQuery.trim()) return allTeachers;

    const query = searchQuery.toLowerCase().trim();
    return allTeachers.filter(teacher =>
      teacher?.teacher_name && teacher.teacher_name.toLowerCase().includes(query)
    );
  }, [searchQuery, allTeachers]);

  // Get teacher timetable mutation
  const timetableMutation = useMutation({
    mutationFn: apiService.getTeacherTimetable,
    onMutate: () => {
      console.log('開始載入教師課表...');
      setTimetableError(null);
      setTeacherTimetable(null);
    },
    onSuccess: (data) => {
      console.log('教師課表載入成功:', data);
      setTeacherTimetable(data);
      setTimetableError(null);
    },
    onError: (error) => {
      console.error('教師課表載入失敗:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : '無法載入教師課表，請檢查網路連接或稍後再試';
      setTimetableError(errorMessage);
      setTeacherTimetable(null);
    },
  });

  // Handle search (now just updates state, filtering is instant)
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle back to teacher list
  const handleBackToList = () => {
    setSelectedTeacher(null);
    setTeacherTimetable(null);
    setTimetableError(null);
  };

  const handleTeacherClick = (teacher: Teacher) => {
    console.log('用戶點擊教師卡片:', teacher);

    // 防止重複點擊
    if (timetableMutation.isPending) {
      console.log('課表載入中，忽略重複點擊');
      return;
    }

    try {
      setSelectedTeacher(teacher);
      setTeacherTimetable(null);
      setTimetableError(null);

      console.log('發送課表請求，教師名稱:', teacher.teacher_name);
      timetableMutation.mutate(teacher.teacher_name);
    } catch (error) {
      console.error('處理教師點擊時發生錯誤:', error);
      setTimetableError('處理請求時發生錯誤，請重試');
    }
  };

  const handleClearSearch = () => {
    console.log('用戶點擊清除搜尋');
    setSearchQuery('');
    setTeacherTimetable(null);
    setTimetableError(null);
    timetableMutation.reset();
  };

  const handleRetryTimetable = () => {
    if (selectedTeacher) {
      console.log('用戶點擊重試載入課表');
      setTimetableError(null);
      timetableMutation.mutate(selectedTeacher.teacher_name);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb Navigation */}
      {selectedTeacher && (
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm font-medium mb-6">
            <button
              onClick={handleBackToList}
              className="inline-flex items-center px-4 py-2 rounded-xl text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 transition-all duration-200"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              {t('pages.teacher.backToTeacherList')}
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-400">{selectedTeacher.teacher_name}</span>
          </nav>
        </div>
      )}

      {/* Premium Hero Section */}
      <div className="text-center mb-12">
        <div className="relative mb-8">
          {/* Background decoration */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-200 to-purple-300 dark:from-purple-800 dark:to-purple-700 rounded-full opacity-20 blur-2xl"></div>
          </div>

          {/* Main icon */}
          <div className="relative flex justify-center">
            <div className="group relative z-0">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-glow pointer-events-none"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300 z-0">
                <AcademicCapIcon className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-gray-900 via-purple-700 to-purple-600 dark:from-white dark:via-purple-300 dark:to-purple-200 bg-clip-text text-transparent">
            {t('pages.teacher.title')}
          </span>
        </h1>

        <p className="text-xl font-medium text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          {selectedTeacher ? t('pages.teacher.viewingTimetable', { name: selectedTeacher.teacher_name }) : t('pages.teacher.searchSubtitle')}
        </p>

        {/* Decorative elements */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>

      {/* Search Section */}
      {!selectedTeacher && (
        <div className="mb-12">
          <div className="max-w-lg mx-auto">
            <div className="relative">
              {/* Search background decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-750 dark:to-gray-800 rounded-2xl shadow-lg opacity-80 pointer-events-none"></div>
              <div className="relative p-6 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                  🔍 {t('pages.teacher.searchTeachers')}
                </h2>
                <SearchBox
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder={t('pages.teacher.searchPlaceholder')}
                  loading={isLoadingTeachers}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {!selectedTeacher && (
        <div className="mb-12">
          {isLoadingTeachers ? (
            <div className="py-12">
              <LoadingSpinner
                size="lg"
                text={t('pages.teacher.searching')}
                className="justify-center"
              />
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="text-center py-12">
              <div className="card p-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 max-w-md mx-auto">
                <div className="text-yellow-500 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t('pages.teacher.noResults')}
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                  找不到符合「{searchQuery}」的教師，請嘗試其他關鍵字
                </p>
                <button
                  onClick={handleClearSearch}
                  className="btn-primary"
                >
                  {t('common.clear')}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('pages.teacher.searchResults')} ({filteredTeachers.length})
                </h2>
                <button
                  onClick={handleClearSearch}
                  className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 text-sm font-medium"
                >
                  {t('common.clear')}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTeachers.map((teacher) => (
                  <TeacherCard
                    key={teacher.id}
                    teacher={teacher}
                    onClick={handleTeacherClick}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected Teacher Timetable */}
      {selectedTeacher && (
        <div>
          {/* Premium Teacher Info Panel */}
          <div className="mb-8">
            <div className="card p-8 bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-800 dark:via-gray-750 dark:to-gray-800 shadow-xl border border-gray-200 dark:border-gray-700">
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-50/30 dark:to-purple-900/10 opacity-50 rounded-lg pointer-events-none"></div>

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-6 flex-1">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="relative z-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl blur opacity-75 pointer-events-none"></div>
                        <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg z-0">
                          <AcademicCapIcon className="h-9 w-9 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Teacher Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-purple-700 to-purple-600 dark:from-white dark:via-purple-300 dark:to-purple-200 bg-clip-text text-transparent">
                          {selectedTeacher.teacher_name}
                        </h2>
                      </div>

                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <span className="mr-2">👨‍🏫</span>
                        <span className="font-medium">{t('teacher.info.teacher')}:</span>
                        <span className="ml-2 font-mono bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded text-purple-600 dark:text-purple-400">
                          {selectedTeacher.teacher_name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Loading Indicator */}
                  {timetableMutation.isPending && (
                    <div className="flex flex-col items-center">
                      <LoadingSpinner size="md" variant="modern" />
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">{t('common.loading')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Timetable Loading */}
          {timetableMutation.isPending && (
            <div className="py-12">
              <LoadingSpinner
                size="lg"
                text={t('pages.class.loading')}
                className="justify-center"
              />
            </div>
          )}

          {/* Timetable Error */}
          {(timetableMutation.error || timetableError) && (
            <div className="mb-8">
              <div className="card p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div className="text-center">
                  <div className="text-red-500 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    載入課表失敗
                  </h3>
                  <p className="text-red-700 dark:text-red-300 mb-6">
                    {timetableError || (timetableMutation.error instanceof Error
                      ? timetableMutation.error.message
                      : '無法載入教師課表')}
                  </p>
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={handleRetryTimetable}
                      disabled={timetableMutation.isPending}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {timetableMutation.isPending ? '載入中...' : '重試載入'}
                    </button>
                    <button
                      onClick={handleClearSearch}
                      className="btn-secondary"
                    >
                      返回搜尋
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timetables */}
          {teacherTimetable && (
            <div className="space-y-8">
              {/* Premium Statistics Dashboard */}
              {teacherTimetable.statistics && (
                <div className="card p-8 shadow-xl bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-800 dark:via-gray-750 dark:to-gray-800 border border-gray-200 dark:border-gray-700">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-purple-700 to-purple-600 dark:from-white dark:via-purple-300 dark:to-purple-200 bg-clip-text text-transparent">
                        📊 {t('pages.teacher.statistics')}
                      </h3>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <PrinterIcon className="h-5 w-5 mr-2" />
                      列印課表
                    </button>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                    <div className="group">
                      <div className="relative p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 rounded-2xl border border-purple-200 dark:border-purple-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <div className="relative text-center">
                          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 animate-pulse">{teacherTimetable.statistics.total_classes}</div>
                          <div className="text-xs font-medium text-purple-700 dark:text-purple-300 mt-1">{t('teacher.statistics.totalClasses')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <div className="relative p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 rounded-2xl border border-green-200 dark:border-green-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <div className="relative text-center">
                          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{teacherTimetable.statistics.english_classes}</div>
                          <div className="text-xs font-medium text-green-700 dark:text-green-300 mt-1">{t('teacher.statistics.englishClasses')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <div className="relative p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 rounded-2xl border border-blue-200 dark:border-blue-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <div className="relative text-center">
                          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{teacherTimetable.statistics.homeroom_classes}</div>
                          <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mt-1">{t('teacher.statistics.homeroomClasses')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <div className="relative p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30 rounded-2xl border border-orange-200 dark:border-orange-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <div className="relative text-center">
                          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{teacherTimetable.statistics.ev_myreading_classes}</div>
                          <div className="text-xs font-medium text-orange-700 dark:text-orange-300 mt-1">{t('teacher.statistics.evClasses')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <div className="relative p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/30 rounded-2xl border border-indigo-200 dark:border-indigo-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-indigo-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <div className="relative text-center">
                          <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{teacherTimetable.statistics.days_with_classes}</div>
                          <div className="text-xs font-medium text-indigo-700 dark:text-indigo-300 mt-1">{t('teacher.statistics.daysWithClasses')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <div className="relative p-4 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/30 rounded-2xl border border-pink-200 dark:border-pink-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-pink-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <div className="relative text-center">
                          <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">{teacherTimetable.statistics.unique_classes}</div>
                          <div className="text-xs font-medium text-pink-700 dark:text-pink-300 mt-1">{t('teacher.statistics.uniqueClasses')}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Unified Timetable */}
              {(() => {
                const unifiedTimetable = mergeStudentTimetables(teacherTimetable.timetables);
                return hasAnyTimetableData(unifiedTimetable) ? (
                  <UnifiedTimetableGrid
                    timetableData={unifiedTimetable}
                    title={t('pages.teacher.unifiedTimetable')}
                    subtitle={t('pages.teacher.completeTimetable', { name: selectedTeacher.teacher_name })}
                  />
                ) : (
                  <div className="card p-8 text-center shadow-lg">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center">
                      <span className="text-4xl">📅</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('messages.noTimetableData')}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{t('messages.tryLaterOrContact')}</p>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* Hidden Print Component - Using Portal to render outside #root */}
      {selectedTeacher && teacherTimetable && (() => {
        const unifiedTimetable = mergeStudentTimetables(teacherTimetable.timetables);
        return hasAnyTimetableData(unifiedTimetable)
          ? createPortal(
              <PrintableTimetable
                timetableData={unifiedTimetable}
                teacherName={selectedTeacher.teacher_name}
              />,
              document.body
            )
          : null;
      })()}

    </div>
  );
}
