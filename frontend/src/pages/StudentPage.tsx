import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { useStudentStore } from '../stores/useStudentStore';
import SearchBox from '../components/ui/SearchBox';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StudentCard from '../components/ui/StudentCard';
import TimetableGrid from '../components/timetable/TimetableGrid';
import { UserIcon } from '@heroicons/react/24/outline';
import { Student, StudentTimetableResponse } from '../types';

export default function StudentPage() {
  const { t } = useTranslation();
  const {
    selectedStudent,
    searchResults,
    searchQuery,
    isSearching,
    searchError,
    setSelectedStudent,
    setSearchResults,
    setSearchQuery,
    setIsSearching,
    setSearchError,
    clearSearch
  } = useStudentStore();

  const [studentTimetable, setStudentTimetable] = useState<StudentTimetableResponse | null>(null);

  // Search students mutation
  const searchMutation = useMutation({
    mutationFn: apiService.searchStudents,
    onMutate: () => {
      setIsSearching(true);
      setSearchError(undefined);
    },
    onSuccess: (data) => {
      setSearchResults(data);
      setIsSearching(false);
    },
    onError: (error) => {
      setSearchError(error instanceof Error ? error.message : t('pages.student.error'));
      setIsSearching(false);
    },
  });

  // Get student timetable mutation
  const timetableMutation = useMutation({
    mutationFn: apiService.getStudentTimetable,
    onSuccess: (data) => {
      setStudentTimetable(data);
    },
    onError: (error) => {
      console.error('Failed to load student timetable:', error);
    },
  });

  const handleSearch = (query: string) => {
    if (query.trim()) {
      searchMutation.mutate(query.trim());
    }
  };

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setStudentTimetable(null);
    timetableMutation.mutate(student.student_id);
  };

  const handleClearSearch = () => {
    clearSearch();
    setStudentTimetable(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <UserIcon className="h-16 w-16 text-accent-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('pages.student.title')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {t('pages.student.subtitle')}
        </p>
      </div>

      {/* Search Section */}
      <div className="mb-8">
        <SearchBox
          value={searchQuery}
          onChange={setSearchQuery}
          onSubmit={handleSearch}
          placeholder={t('pages.student.searchPlaceholder')}
          loading={isSearching}
          className="max-w-md mx-auto"
        />

        {/* Search Error */}
        {searchError && (
          <div className="mt-4 max-w-md mx-auto">
            <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {searchError}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clear Button */}
        {(searchResults.length > 0 || selectedStudent) && (
          <div className="mt-4 text-center">
            <button
              onClick={handleClearSearch}
              className="btn-secondary"
            >
              {t('common.clear')}
            </button>
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && !selectedStudent && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            搜尋結果 ({searchResults.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((student) => (
              <StudentCard
                key={student.student_id}
                student={student}
                onClick={handleStudentClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {searchQuery && searchResults.length === 0 && !isSearching && !searchError && (
        <div className="text-center py-12">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            {t('pages.student.noResults')}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            請嘗試其他搜尋關鍵字
          </p>
        </div>
      )}

      {/* Selected Student Timetable */}
      {selectedStudent && (
        <div>
          {/* Student Info */}
          <div className="mb-6">
            <div className="card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedStudent.student_name}
                  </h2>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <p><span className="font-medium">{t('student.info.studentId')}:</span> {selectedStudent.student_id}</p>
                    <p><span className="font-medium">{t('student.info.englishClass')}:</span> {selectedStudent.english_class_name}</p>
                    <p><span className="font-medium">{t('student.info.homeroomClass')}:</span> {selectedStudent.home_room_class_name}</p>
                    {selectedStudent.ev_myreading_class_name && (
                      <p><span className="font-medium">{t('student.info.evClass')}:</span> {selectedStudent.ev_myreading_class_name}</p>
                    )}
                    {selectedStudent.grade && (
                      <p><span className="font-medium">{t('student.info.grade')}:</span> {selectedStudent.grade}</p>
                    )}
                  </div>
                </div>
                {timetableMutation.isPending && (
                  <LoadingSpinner size="sm" />
                )}
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
          {timetableMutation.error && (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {t('pages.class.error')}
              </h3>
              <button
                onClick={() => timetableMutation.mutate(selectedStudent.student_id)}
                className="btn-primary"
              >
                {t('common.retry')}
              </button>
            </div>
          )}

          {/* Timetables */}
          {studentTimetable && (
            <div className="space-y-8">
              {/* Statistics */}
              {studentTimetable.statistics && (
                <div className="card p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    課表統計
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent-600">{studentTimetable.statistics.total_classes}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('student.statistics.totalClasses')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{studentTimetable.statistics.english_classes}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('student.statistics.englishClasses')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{studentTimetable.statistics.homeroom_classes}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('student.statistics.homeroomClasses')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{studentTimetable.statistics.ev_myreading_classes}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('student.statistics.evClasses')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{studentTimetable.statistics.days_with_classes}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('student.statistics.daysWithClasses')}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* English Timetable */}
              <TimetableGrid
                timetableData={studentTimetable.timetables.english_timetable}
                title={t('timetable.courseTypes.english')}
                subtitle={selectedStudent.english_class_name}
              />

              {/* Homeroom Timetable */}
              <TimetableGrid
                timetableData={studentTimetable.timetables.homeroom_timetable}
                title={t('timetable.courseTypes.homeroom')}
                subtitle={selectedStudent.home_room_class_name}
              />

              {/* EV & myReading Timetable */}
              {selectedStudent.ev_myreading_class_name && (
                <TimetableGrid
                  timetableData={studentTimetable.timetables.ev_myreading_timetable}
                  title={t('timetable.courseTypes.ev_myreading')}
                  subtitle={selectedStudent.ev_myreading_class_name}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!searchQuery && !selectedStudent && searchResults.length === 0 && (
        <div className="text-center py-12">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            {t('pages.student.selectStudent')}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            請在上方搜尋框輸入學生姓名開始搜尋
          </p>
        </div>
      )}
    </div>
  );
}