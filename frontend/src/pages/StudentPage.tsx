import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import SearchBox from '../components/ui/SearchBox';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StudentCard from '../components/ui/StudentCard';
import PrintButton from '../components/ui/PrintButton';
import UnifiedTimetableGrid from '../components/timetable/UnifiedTimetableGrid';
import PrintableTimetable from '../components/print/PrintableTimetable';
import { mergeStudentTimetables, hasAnyTimetableData } from '../utils/timetableUtils';
import { UserIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import type { Student, StudentTimetableResponse } from '../types';

export default function StudentPage() {
  const { t } = useTranslation();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [studentTimetable, setStudentTimetable] = useState<StudentTimetableResponse | null>(null);
  const [timetableError, setTimetableError] = useState<string | null>(null);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Optimized search filtering with useMemo (prevents 1,036+ student re-filtering on every render)
  const filteredStudents = useMemo(() => {
    if (searchQuery.trim() === '') {
      return allStudents;
    }

    const queryLower = searchQuery.toLowerCase();
    return allStudents.filter(student =>
      student.student_name.toLowerCase().includes(queryLower) ||
      student.student_id.toLowerCase().includes(queryLower) ||
      student.english_class_name.toLowerCase().includes(queryLower) ||
      student.home_room_class_name.toLowerCase().includes(queryLower)
    );
  }, [allStudents, searchQuery]);

  // Handle search filtering (now just updates search query, memo does the rest)
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Fetch all students
  const {
    data: studentsData,
    isLoading: isLoadingAllStudents,
    error: studentsError
  } = useQuery({
    queryKey: ['all-students'],
    queryFn: apiService.getAllStudents,
  });

  // Update allStudents when data arrives (filteredStudents computed by useMemo)
  useEffect(() => {
    if (studentsData) {
      setAllStudents(studentsData);
    }
  }, [studentsData]);

  // Get student timetable mutation

  const timetableMutation = useMutation({
    mutationFn: apiService.getStudentTimetable,
    onMutate: () => {
      console.log('開始載入學生課表...');
      setTimetableError(null);
      setStudentTimetable(null);
    },
    onSuccess: (data) => {
      console.log('學生課表載入成功:', data);
      setStudentTimetable(data);
      setTimetableError(null);
    },
    onError: (error) => {
      console.error('學生課表載入失敗:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : '無法載入學生課表，請檢查網路連接或稍後再試';
      setTimetableError(errorMessage);
      setStudentTimetable(null);
    },
  });


  // Handle back to student list
  const handleBackToList = () => {
    setSelectedStudent(null);
    setStudentTimetable(null);
    setTimetableError(null);
  };

  const handleStudentClick = (student: Student) => {
    console.log('用戶點擊學生卡片:', student);

    // 防止重複點擊
    if (timetableMutation.isPending) {
      console.log('課表載入中，忽略重複點擊');
      return;
    }

    try {
      setSelectedStudent(student);
      setStudentTimetable(null);
      setTimetableError(null);

      console.log('發送課表請求，學生ID:', student.student_id);
      timetableMutation.mutate(student.student_id);
    } catch (error) {
      console.error('處理學生點擊時發生錯誤:', error);
      setTimetableError('處理請求時發生錯誤，請重試');
    }
  };

  const handleClearSearch = () => {
    console.log('用戶點擊清除搜尋');
    setSearchQuery(''); // useMemo will automatically recalculate filteredStudents
    setStudentTimetable(null);
    setTimetableError(null);
    timetableMutation.reset();
  };

  const handleRetryTimetable = () => {
    if (selectedStudent) {
      console.log('用戶點擊重試載入課表');
      setTimetableError(null);
      timetableMutation.mutate(selectedStudent.student_id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb Navigation */}
      {selectedStudent && (
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm font-medium mb-6">
            <button
              onClick={handleBackToList}
              className="inline-flex items-center px-4 py-2 rounded-xl text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 bg-accent-50 hover:bg-accent-100 dark:bg-accent-900/20 dark:hover:bg-accent-900/30 transition-all duration-200"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              {t('pages.student.backToStudentList')}
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-400">{selectedStudent.student_name}</span>
          </nav>
        </div>
      )}

      {/* Premium Hero Section */}
      <div className="text-center mb-12">
        <div className="relative mb-8">
          {/* Background decoration */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-accent-200 to-accent-300 dark:from-accent-800 dark:to-accent-700 rounded-full opacity-20 blur-2xl"></div>
          </div>

          {/* Main icon */}
          <div className="relative flex justify-center">
            <div className="group relative z-0">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-500 to-accent-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-glow pointer-events-none"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-3xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300 z-0">
                <UserIcon className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-gray-900 via-accent-700 to-accent-600 dark:from-white dark:via-accent-300 dark:to-accent-200 bg-clip-text text-transparent">
            {t('pages.student.title')}
          </span>
        </h1>

        <p className="text-xl font-medium text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          {selectedStudent ? t('pages.student.viewingTimetable', { name: selectedStudent.student_name }) : t('pages.student.browseSubtitle')}
        </p>

        {/* Decorative elements */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-2 h-2 bg-accent-300 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>

      {/* Search Section */}
      {!selectedStudent && (
        <div className="mb-12">
          <div className="max-w-lg mx-auto">
            <div className="relative">
              {/* Search background decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-750 dark:to-gray-800 rounded-2xl shadow-lg opacity-80 pointer-events-none"></div>
              <div className="relative p-6 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                  🔍 {t('pages.student.searchStudents')}
                </h2>
                <SearchBox
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder={t('pages.student.browsePlaceholder')}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Students Grid */}
      {!selectedStudent && (
        <div className="mb-12">
          {isLoadingAllStudents ? (
            <div className="py-12">
              <LoadingSpinner
                size="lg"
                text={t('pages.student.loadingAllStudents')}
                className="justify-center"
              />
            </div>
          ) : studentsError ? (
            <div className="text-center py-12">
              <div className="card p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 max-w-md mx-auto">
                <div className="text-red-500 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t('pages.student.loadStudentsError')}
                </h3>
                <p className="text-red-700 dark:text-red-300 mb-4">
                  {studentsError instanceof Error ? studentsError.message : t('common.error')}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  {t('common.retry')}
                </button>
              </div>
            </div>
          ) : filteredStudents.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {searchQuery ? `${t('pages.student.filteredStudents')} (${filteredStudents.length})` : `${t('pages.student.allStudents')} (${allStudents.length})`}
                </h2>
                {searchQuery && (
                  <button
                    onClick={() => handleSearch('')}
                    className="text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 text-sm font-medium"
                  >
                    {t('common.clear')}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredStudents.map((student) => (
                  <StudentCard
                    key={student.student_id}
                    student={student}
                    onClick={handleStudentClick}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                {searchQuery ? t('pages.student.noMatchingStudents') : t('pages.student.noStudentsAvailable')}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchQuery ? t('pages.student.tryDifferentSearch') : t('messages.contactAdmin')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Selected Student Timetable */}
      {selectedStudent && (
        <div>
          {/* Premium Student Info Panel */}
          <div className="mb-8">
            <div className="card p-8 bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-800 dark:via-gray-750 dark:to-gray-800 shadow-xl border border-gray-200 dark:border-gray-700">
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent-50/30 dark:to-accent-900/10 opacity-50 rounded-lg pointer-events-none"></div>

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-6 flex-1">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="relative z-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl blur opacity-75 pointer-events-none"></div>
                        <div className="relative w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-lg z-0">
                          <UserIcon className="h-9 w-9 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Student Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-1 h-8 bg-gradient-to-b from-accent-500 to-accent-600 rounded-full"></div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-accent-700 to-accent-600 dark:from-white dark:via-accent-300 dark:to-accent-200 bg-clip-text text-transparent">
                          {selectedStudent.student_name}
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <span className="mr-2">🎫</span>
                          <span className="font-medium">{t('student.info.studentId')}:</span>
                          <span className="ml-2 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-accent-600 dark:text-accent-400">
                            {selectedStudent.student_id}
                          </span>
                        </div>

                        <div className="flex items-center text-sm">
                          <span className="mr-2">🌟</span>
                          <span className="font-medium text-green-700 dark:text-green-300">{t('student.info.englishClass')}:</span>
                          <span className="ml-2 px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs font-semibold">
                            {selectedStudent.english_class_name}
                          </span>
                        </div>

                        <div className="flex items-center text-sm">
                          <span className="mr-2">🏠</span>
                          <span className="font-medium text-blue-700 dark:text-blue-300">{t('student.info.homeroomClass')}:</span>
                          <span className="ml-2 px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs font-semibold">
                            {selectedStudent.home_room_class_name}
                          </span>
                        </div>

                        {selectedStudent.ev_myreading_class_name && (
                          <div className="flex items-center text-sm">
                            <span className="mr-2">📚</span>
                            <span className="font-medium text-orange-700 dark:text-orange-300">{t('student.info.evClass')}:</span>
                            <span className="ml-2 px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 text-xs font-semibold">
                              {selectedStudent.ev_myreading_class_name}
                            </span>
                          </div>
                        )}

                        {selectedStudent.grade && (
                          <div className="flex items-center text-sm">
                            <span className="mr-2">🎯</span>
                            <span className="font-medium text-purple-700 dark:text-purple-300">{t('student.info.grade')}:</span>
                            <span className="ml-2 px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs font-semibold">
                              {selectedStudent.grade}
                            </span>
                          </div>
                        )}
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
                      : '無法載入學生課表')}
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
          {studentTimetable && (
            <div className="space-y-8">
              {/* Premium Statistics Dashboard */}
              {studentTimetable.statistics && (
                <div className="card p-8 shadow-xl bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-800 dark:via-gray-750 dark:to-gray-800 border border-gray-200 dark:border-gray-700">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-1 h-8 bg-gradient-to-b from-accent-500 to-accent-600 rounded-full"></div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-accent-700 to-accent-600 dark:from-white dark:via-accent-300 dark:to-accent-200 bg-clip-text text-transparent">
                        📊 {t('pages.student.statistics')}
                      </h3>
                    </div>
                    <PrintButton documentTitle={`${selectedStudent.student_name}_Timetable`} />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    <div className="group">
                      <div className="relative p-4 bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/20 dark:to-accent-800/30 rounded-2xl border border-accent-200 dark:border-accent-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 to-accent-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <div className="relative text-center">
                          <div className="text-3xl font-bold text-accent-600 dark:text-accent-400 animate-pulse">{studentTimetable.statistics.total_classes}</div>
                          <div className="text-xs font-medium text-accent-700 dark:text-accent-300 mt-1">{t('student.statistics.totalClasses')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <div className="relative p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 rounded-2xl border border-green-200 dark:border-green-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <div className="relative text-center">
                          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{studentTimetable.statistics.english_classes}</div>
                          <div className="text-xs font-medium text-green-700 dark:text-green-300 mt-1">{t('student.statistics.englishClasses')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <div className="relative p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 rounded-2xl border border-blue-200 dark:border-blue-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <div className="relative text-center">
                          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{studentTimetable.statistics.homeroom_classes}</div>
                          <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mt-1">{t('student.statistics.homeroomClasses')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <div className="relative p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30 rounded-2xl border border-orange-200 dark:border-orange-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <div className="relative text-center">
                          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{studentTimetable.statistics.ev_myreading_classes}</div>
                          <div className="text-xs font-medium text-orange-700 dark:text-orange-300 mt-1">{t('student.statistics.evClasses')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <div className="relative p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 rounded-2xl border border-purple-200 dark:border-purple-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <div className="relative text-center">
                          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{studentTimetable.statistics.days_with_classes}</div>
                          <div className="text-xs font-medium text-purple-700 dark:text-purple-300 mt-1">{t('student.statistics.daysWithClasses')}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Unified Timetable */}
              {(() => {
                const unifiedTimetable = mergeStudentTimetables(studentTimetable.timetables);
                return hasAnyTimetableData(unifiedTimetable) ? (
                  <UnifiedTimetableGrid
                    timetableData={unifiedTimetable}
                    title={t('pages.student.unifiedTimetable')}
                    subtitle={t('pages.student.completeTimetable', { name: selectedStudent.student_name })}
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
      {selectedStudent && studentTimetable && (() => {
        const unifiedTimetable = mergeStudentTimetables(studentTimetable.timetables);
        return hasAnyTimetableData(unifiedTimetable)
          ? createPortal(
              <PrintableTimetable
                timetableData={unifiedTimetable}
                teacherName={`${selectedStudent.student_name} (${selectedStudent.student_id})`}
              />,
              document.body
            )
          : null;
      })()}

    </div>
  );
}