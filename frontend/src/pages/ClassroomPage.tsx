import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiService } from '../services/api';
import SearchBox from '../components/ui/SearchBox';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ClassroomCard from '../components/ui/ClassroomCard';
import PrintButton from '../components/ui/PrintButton';
import UnifiedTimetableGrid from '../components/timetable/UnifiedTimetableGrid';
import PrintableTimetable from '../components/print/PrintableTimetable';
import { mergeStudentTimetables, hasAnyTimetableData } from '../utils/timetableUtils';
import { BuildingOfficeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import type { Classroom, ClassroomTimetableResponse } from '../types';

// 樓層篩選選項
const FLOOR_FILTERS = ['all', 'E1', 'E2', 'E3', 'E4', 'E5', 'KCFS'] as const;
type FloorFilter = typeof FLOOR_FILTERS[number];

export default function ClassroomPage() {
  const { t } = useTranslation();
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [classroomTimetable, setClassroomTimetable] = useState<ClassroomTimetableResponse | null>(null);
  const [timetableError, setTimetableError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFloor, setSelectedFloor] = useState<FloorFilter>('all');

  // Fetch all classrooms once
  const { data: classroomsData, isLoading: isLoadingClassrooms } = useQuery({
    queryKey: ['classrooms'],
    queryFn: apiService.getAllClassrooms,
    staleTime: 5 * 60 * 1000, // 5 分鐘內不重新請求
  });

  // 將教室字串轉換為 Classroom 物件
  const allClassrooms: Classroom[] = useMemo(() => {
    if (!classroomsData?.classrooms) return [];
    return classroomsData.classrooms.map((name, index) => ({
      id: index,
      classroom_name: name,
      floor: extractFloor(name),
    }));
  }, [classroomsData]);

  // Client-side filtering (by floor and search query)
  const filteredClassrooms = useMemo(() => {
    let filtered = allClassrooms;

    // 樓層篩選
    if (selectedFloor !== 'all') {
      filtered = filtered.filter(classroom =>
        classroom.floor === selectedFloor
      );
    }

    // 搜尋篩選
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(classroom =>
        classroom.classroom_name.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allClassrooms, selectedFloor, searchQuery]);

  // Get classroom timetable mutation
  const timetableMutation = useMutation({
    mutationFn: apiService.getClassroomTimetable,
    onMutate: () => {
      console.log('開始載入教室課表...');
      setTimetableError(null);
      setClassroomTimetable(null);
    },
    onSuccess: (data) => {
      console.log('教室課表載入成功:', data);
      setClassroomTimetable(data);
      setTimetableError(null);
    },
    onError: (error) => {
      console.error('教室課表載入失敗:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : '無法載入教室課表，請檢查網路連接或稍後再試';
      setTimetableError(errorMessage);
      setClassroomTimetable(null);
    },
  });

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle back to classroom list
  const handleBackToList = () => {
    setSelectedClassroom(null);
    setClassroomTimetable(null);
    setTimetableError(null);
  };

  const handleClassroomClick = (classroom: Classroom) => {
    console.log('用戶點擊教室卡片:', classroom);

    // 防止重複點擊
    if (timetableMutation.isPending) {
      console.log('課表載入中，忽略重複點擊');
      return;
    }

    try {
      setSelectedClassroom(classroom);
      setClassroomTimetable(null);
      setTimetableError(null);

      console.log('發送課表請求，教室名稱:', classroom.classroom_name);
      timetableMutation.mutate(classroom.classroom_name);
    } catch (error) {
      console.error('處理教室點擊時發生錯誤:', error);
      setTimetableError('處理請求時發生錯誤，請重試');
    }
  };

  const handleClearSearch = () => {
    console.log('用戶點擊清除搜尋');
    setSearchQuery('');
    setClassroomTimetable(null);
    setTimetableError(null);
    timetableMutation.reset();
  };

  const handleRetryTimetable = () => {
    if (selectedClassroom) {
      console.log('用戶點擊重試載入課表');
      setTimetableError(null);
      timetableMutation.mutate(selectedClassroom.classroom_name);
    }
  };

  // 樓層篩選標籤顯示文字
  const getFloorLabel = (floor: FloorFilter): string => {
    if (floor === 'all') return t('pages.classroom.allFloors');
    if (floor === 'KCFS') return 'KCFS';
    return `${floor.charAt(1)}${t('pages.classroom.floor')}`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb Navigation */}
      {selectedClassroom && (
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-xs sm:text-sm font-medium mb-6">
            <button
              onClick={handleBackToList}
              className="inline-flex items-center px-4 py-2 rounded-xl text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 bg-teal-50 hover:bg-teal-100 dark:bg-teal-900/20 dark:hover:bg-teal-900/30 transition-all duration-200"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              {t('pages.classroom.backToClassroomList')}
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-400">{selectedClassroom.classroom_name}</span>
          </nav>
        </div>
      )}

      {/* Premium Hero Section */}
      <div className="text-center mb-12">
        <div className="relative mb-8">
          {/* Background decoration */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-teal-200 to-cyan-300 dark:from-teal-800 dark:to-cyan-700 rounded-full opacity-20 blur-2xl"></div>
          </div>

          {/* Main icon */}
          <div className="relative flex justify-center">
            <div className="group relative z-0">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-glow pointer-events-none"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300 z-0">
                <BuildingOfficeIcon className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-gray-900 via-teal-700 to-cyan-600 dark:from-white dark:via-teal-300 dark:to-cyan-200 bg-clip-text text-transparent">
            {t('pages.classroom.title')}
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl font-medium text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          {selectedClassroom ? t('pages.classroom.viewingTimetable', { name: selectedClassroom.classroom_name }) : t('pages.classroom.searchSubtitle')}
        </p>

        {/* Decorative elements */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>

      {/* Floor Filter Tabs + Search Section */}
      {!selectedClassroom && (
        <div className="mb-12">
          {/* Floor Filter Tabs */}
          <div className="mb-6">
            <div className="flex justify-center">
              <div className="inline-flex flex-wrap justify-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                {FLOOR_FILTERS.map((floor) => (
                  <button
                    key={floor}
                    onClick={() => setSelectedFloor(floor)}
                    className={`
                      px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                      ${selectedFloor === floor
                        ? 'bg-teal-500 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    {getFloorLabel(floor)}
                    {classroomsData?.statistics?.by_floor?.[floor] && (
                      <span className="ml-1 text-xs opacity-75">
                        ({classroomsData.statistics.by_floor[floor]})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="max-w-lg mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-750 dark:to-gray-800 rounded-2xl shadow-lg opacity-80 pointer-events-none"></div>
              <div className="relative p-6 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                  🔍 {t('pages.classroom.searchClassrooms')}
                </h2>
                <SearchBox
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder={t('pages.classroom.searchPlaceholder')}
                  loading={isLoadingClassrooms}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {!selectedClassroom && (
        <div className="mb-12">
          {isLoadingClassrooms ? (
            <div className="py-12">
              <LoadingSpinner
                size="lg"
                text={t('pages.classroom.searching')}
                className="justify-center"
              />
            </div>
          ) : filteredClassrooms.length === 0 ? (
            <div className="text-center py-12">
              <div className="card p-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 max-w-md mx-auto">
                <div className="text-yellow-500 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t('pages.classroom.noResults')}
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                  找不到符合條件的教室，請嘗試其他篩選條件
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedFloor('all'); }}
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
                  {t('pages.classroom.searchResults')} ({filteredClassrooms.length})
                </h2>
                <button
                  onClick={handleClearSearch}
                  className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 text-sm font-medium"
                >
                  {t('common.clear')}
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredClassrooms.map((classroom) => (
                  <ClassroomCard
                    key={classroom.id}
                    classroom={classroom}
                    onClick={handleClassroomClick}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected Classroom Timetable */}
      {selectedClassroom && (
        <div>
          {/* Premium Classroom Info Panel */}
          <div className="mb-8">
            <div className="card p-4 sm:p-6 md:p-8 bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-800 dark:via-gray-750 dark:to-gray-800 shadow-xl border border-gray-200 dark:border-gray-700">
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-teal-50/30 dark:to-teal-900/10 opacity-50 rounded-lg pointer-events-none"></div>

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-6 flex-1">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="relative z-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl blur opacity-75 pointer-events-none"></div>
                        <div className="relative w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg z-0">
                          <BuildingOfficeIcon className="h-9 w-9 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Classroom Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-1 h-8 bg-gradient-to-b from-teal-500 to-cyan-600 rounded-full"></div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-teal-700 to-cyan-600 dark:from-white dark:via-teal-300 dark:to-cyan-200 bg-clip-text text-transparent">
                          {selectedClassroom.classroom_name}
                        </h2>
                      </div>

                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <span className="mr-2">🏢</span>
                        <span className="font-medium">{t('classroom.info.floor')}:</span>
                        <span className="ml-2 font-mono bg-teal-100 dark:bg-teal-900/30 px-2 py-0.5 rounded text-teal-600 dark:text-teal-400">
                          {selectedClassroom.floor || extractFloor(selectedClassroom.classroom_name)}
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
                      : '無法載入教室課表')}
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
                      onClick={handleBackToList}
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
          {classroomTimetable && (
            <div className="space-y-8">
              {/* Premium Statistics Dashboard */}
              {classroomTimetable.statistics && (
                <div className="card p-4 sm:p-6 md:p-8 shadow-xl bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-800 dark:via-gray-750 dark:to-gray-800 border border-gray-200 dark:border-gray-700">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-1 h-8 bg-gradient-to-b from-teal-500 to-cyan-600 rounded-full"></div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-teal-700 to-cyan-600 dark:from-white dark:via-teal-300 dark:to-cyan-200 bg-clip-text text-transparent">
                        📊 {t('pages.classroom.statistics')}
                      </h3>
                    </div>
                    <PrintButton
                      documentTitle={`${selectedClassroom.classroom_name}_Timetable`}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 md:gap-6">
                    <div className="group">
                      <div className="relative p-4 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/30 rounded-2xl border border-teal-200 dark:border-teal-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-teal-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <div className="relative text-center">
                          <div className="text-2xl sm:text-3xl font-bold text-teal-600 dark:text-teal-400 animate-pulse">{classroomTimetable.statistics.total_classes}</div>
                          <div className="text-xs font-medium text-teal-700 dark:text-teal-300 mt-1">{t('classroom.statistics.totalClasses')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <div className="relative p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 rounded-2xl border border-green-200 dark:border-green-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <div className="relative text-center">
                          <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">{classroomTimetable.statistics.english_classes}</div>
                          <div className="text-xs font-medium text-green-700 dark:text-green-300 mt-1">{t('classroom.statistics.englishClasses')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <div className="relative p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 rounded-2xl border border-blue-200 dark:border-blue-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <div className="relative text-center">
                          <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">{classroomTimetable.statistics.homeroom_classes}</div>
                          <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mt-1">{t('classroom.statistics.homeroomClasses')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <div className="relative p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30 rounded-2xl border border-orange-200 dark:border-orange-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <div className="relative text-center">
                          <div className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400">{classroomTimetable.statistics.ev_myreading_classes}</div>
                          <div className="text-xs font-medium text-orange-700 dark:text-orange-300 mt-1">{t('classroom.statistics.evClasses')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <div className="relative p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/30 rounded-2xl border border-indigo-200 dark:border-indigo-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-indigo-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <div className="relative text-center">
                          <div className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">{classroomTimetable.statistics.days_with_classes}</div>
                          <div className="text-xs font-medium text-indigo-700 dark:text-indigo-300 mt-1">{t('classroom.statistics.daysWithClasses')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <div className="relative p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 rounded-2xl border border-purple-200 dark:border-purple-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <div className="relative text-center">
                          <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">{classroomTimetable.statistics.unique_teachers}</div>
                          <div className="text-xs font-medium text-purple-700 dark:text-purple-300 mt-1">{t('classroom.statistics.uniqueTeachers')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <div className="relative p-4 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/30 rounded-2xl border border-pink-200 dark:border-pink-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-pink-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <div className="relative text-center">
                          <div className="text-2xl sm:text-3xl font-bold text-pink-600 dark:text-pink-400">{classroomTimetable.statistics.unique_class_groups}</div>
                          <div className="text-xs font-medium text-pink-700 dark:text-pink-300 mt-1">{t('classroom.statistics.uniqueClassGroups')}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Unified Timetable */}
              {(() => {
                const unifiedTimetable = mergeStudentTimetables(classroomTimetable.timetables);
                return hasAnyTimetableData(unifiedTimetable) ? (
                  <UnifiedTimetableGrid
                    timetableData={unifiedTimetable}
                    title={t('pages.classroom.unifiedTimetable')}
                    subtitle={t('pages.classroom.completeTimetable', { name: selectedClassroom.classroom_name })}
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
      {selectedClassroom && classroomTimetable && (() => {
        const unifiedTimetable = mergeStudentTimetables(classroomTimetable.timetables);

        console.log('🖨️ Print Component - Rendering check:', {
          hasClassroom: !!selectedClassroom,
          hasTimetable: !!classroomTimetable,
          hasData: hasAnyTimetableData(unifiedTimetable),
          unifiedTimetable
        });

        return createPortal(
          <PrintableTimetable
            timetableData={unifiedTimetable}
            className={selectedClassroom.classroom_name}
          />,
          document.body
        );
      })()}

    </div>
  );
}

// Helper function to extract floor from classroom name
function extractFloor(classroomName: string): string {
  if (!classroomName) return 'Other';
  if (classroomName.startsWith('KCFS')) return 'KCFS';
  if (classroomName.length >= 2 && classroomName[0] === 'E' && /\d/.test(classroomName[1])) {
    return `E${classroomName[1]}`;
  }
  return 'Other';
}
