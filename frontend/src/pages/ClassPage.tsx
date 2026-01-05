import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import TimetableGrid from '../components/timetable/TimetableGrid';
import SearchBox from '../components/ui/SearchBox';
import PrintButton from '../components/ui/PrintButton';
import PrintableTimetable from '../components/print/PrintableTimetable';
import { convertToUnifiedTimetable } from '../utils/timetableUtils';
import { ArrowLeftIcon, AcademicCapIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// API now returns TimetableDisplay format directly, no conversion needed

export default function ClassPage() {
  const { className } = useParams<{ className: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<string[]>([]);
  const [currentClassName, setCurrentClassName] = useState(className || '');

  // Fetch all classes for search functionality
  const { data: classesData } = useQuery({
    queryKey: ['classes'],
    queryFn: apiService.getClasses,
  });

  useEffect(() => {
    if (classesData) {
      setAvailableClasses(classesData);
      setFilteredClasses(classesData);
    }
  }, [classesData]);

  const {
    data: timetableData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['class-timetable', currentClassName],
    queryFn: () => apiService.getClassTimetable(currentClassName),
    enabled: !!currentClassName,
  });

  // Handle class search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredClasses(availableClasses);
    } else {
      const filtered = availableClasses.filter(cls =>
        cls.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredClasses(filtered);
    }
  };

  // Handle class selection from search results
  const handleClassSelect = (selectedClass: string) => {
    setCurrentClassName(selectedClass);
    navigate(`/class/${encodeURIComponent(selectedClass)}`, { replace: true });
    setSearchQuery('');
    setFilteredClasses(availableClasses);
  };

  if (!currentClassName) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card p-12 text-center shadow-lg">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/30 rounded-3xl flex items-center justify-center">
            <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('pages.class.invalidClassName')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('pages.class.invalidClassNameDescription')}
          </p>
          <Link to="/classes" className="btn-primary inline-flex items-center space-x-2">
            <ArrowLeftIcon className="h-4 w-4" />
            <span>{t('pages.class.backToClassList')}</span>
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-xs sm:text-sm font-medium">
            <Link
              to="/classes"
              className="inline-flex items-center px-4 py-2 rounded-xl text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 bg-accent-50 hover:bg-accent-100 dark:bg-accent-900/20 dark:hover:bg-accent-900/30 transition-all duration-200"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              {t('pages.class.backToClassList')}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-400">{t('pages.class.error')}</span>
          </nav>
        </div>

        {/* Enhanced Error State */}
        <div className="card p-12 text-center shadow-lg">
          <div className="max-w-lg mx-auto">
            {/* Error illustration */}
            <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/30 rounded-3xl flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('pages.class.error')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              {error instanceof Error ? error.message : t('common.error')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{t('common.retry')}</span>
              </button>
              <Link
                to="/classes"
                className="btn-secondary inline-flex items-center space-x-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span>{t('pages.class.backToClassList')}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Enhanced Breadcrumb Navigation */}
      <div className="mb-8">
        <nav className="flex items-center space-x-2 text-xs sm:text-sm font-medium mb-6">
          <Link
            to="/classes"
            className="inline-flex items-center px-4 py-2 rounded-xl text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 bg-accent-50 hover:bg-accent-100 dark:bg-accent-900/20 dark:hover:bg-accent-900/30 transition-all duration-200"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            {t('pages.class.backToClassList')}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600 dark:text-gray-400">{decodeURIComponent(currentClassName)}</span>
        </nav>

        {/* Enhanced Header Section */}
        <div className="card p-8 bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-750 dark:to-gray-800 shadow-lg">
          <div className="flex items-start space-x-6">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="relative z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-500 to-accent-600 rounded-3xl blur opacity-75 pointer-events-none"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-3xl flex items-center justify-center shadow-lg z-0">
                  <AcademicCapIcon className="h-9 w-9 text-white" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-3">
                    <span className="bg-gradient-to-r from-gray-900 via-accent-700 to-accent-600 dark:from-white dark:via-accent-300 dark:to-accent-200 bg-clip-text text-transparent">
                      {decodeURIComponent(currentClassName)}
                    </span>
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl font-medium text-gray-600 dark:text-gray-400 mb-4">
                    {t('pages.class.weeklyTimetable')}
                  </p>

                  {/* Class info badges */}
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300">
                      📅 {t('pages.class.title')}
                    </span>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      🏫 {t('pages.class.classroom')}
                    </span>
                  </div>
                </div>

                {/* Status indicator */}
                {!isLoading && timetableData && (
                  <div className="text-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mb-2 animate-pulse"></div>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                      {t('common.loaded')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="mb-8">
        <div className="card p-6 bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-750 dark:to-gray-800 shadow-lg">
          <div className="flex items-center space-x-4 mb-4">
            <MagnifyingGlassIcon className="h-6 w-6 text-accent-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('pages.class.searchOtherClasses')}
            </h2>
          </div>

          <SearchBox
            value={searchQuery}
            onChange={handleSearch}
            placeholder={t('pages.class.searchPlaceholder')}
            className="mb-4"
          />

          {/* Search Results */}
          {searchQuery && filteredClasses.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('pages.class.searchResults')} ({filteredClasses.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-48 overflow-y-auto">
                {filteredClasses.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => handleClassSelect(cls)}
                    className={`p-3 rounded-xl text-left transition-all duration-200 ${
                      cls === currentClassName
                        ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 border-2 border-accent-500'
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 hover:border-accent-300 dark:hover:border-accent-600 hover:bg-accent-50 dark:hover:bg-accent-900/20'
                    }`}
                  >
                    <div className="font-medium text-sm">{cls}</div>
                    {cls === currentClassName && (
                      <div className="text-xs text-accent-600 dark:text-accent-400 mt-1">
                        {t('pages.class.currentClass')}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchQuery && filteredClasses.length === 0 && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t('pages.class.noClassesFound')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Loading State */}
      {isLoading && (
        <div className="card p-16 text-center shadow-lg">
          <div className="max-w-md mx-auto">
            <div className="relative mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                <AcademicCapIcon className="h-10 w-10 text-white animate-pulse" />
              </div>
              <LoadingSpinner size="lg" className="justify-center" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              {t('pages.class.loading')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('pages.class.loadingDescription')}
            </p>
          </div>
        </div>
      )}

      {/* Enhanced Timetable Section */}
      {timetableData && (
        <div className="space-y-6">
          {/* Timetable Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              📋 {t('pages.class.timetableTitle')}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t('pages.class.lastUpdated')}: {new Date().toLocaleDateString()}
              </div>
              <PrintButton
                documentTitle={`${decodeURIComponent(currentClassName)}_Timetable`}
                className="px-4 py-2 bg-accent-600 hover:bg-accent-700 dark:bg-accent-500 dark:hover:bg-accent-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              />
            </div>
          </div>

          {/* Timetable Grid */}
          <TimetableGrid
            timetableData={timetableData.timetable}
            title={`${decodeURIComponent(currentClassName)} ${t('pages.class.weeklyTimetable')}`}
            subtitle={`${t('pages.class.className')}: ${timetableData.class_name}`}
          />
        </div>
      )}

      {/* Hidden Print Component - Using Portal to render outside #root */}
      {timetableData && (() => {
        const unifiedTimetable = convertToUnifiedTimetable(timetableData.timetable);

        return createPortal(
          <PrintableTimetable
            timetableData={unifiedTimetable}
            className={decodeURIComponent(currentClassName)}
          />,
          document.body
        );
      })()}
    </div>
  );
}