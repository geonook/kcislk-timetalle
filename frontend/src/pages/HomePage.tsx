import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import SearchBox from '../components/ui/SearchBox';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all classes
  const {
    data: classes = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['classes'],
    queryFn: apiService.getClasses,
  });

  // Filter classes based on search query
  const filteredClasses = classes.filter(className =>
    className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClassClick = (className: string) => {
    navigate(`/class/${encodeURIComponent(className)}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t('pages.home.error')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error instanceof Error ? error.message : t('common.error')}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="relative mb-8">
          {/* Background decoration */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-accent-200 to-accent-300 dark:from-accent-800 dark:to-accent-700 rounded-full opacity-20 blur-2xl"></div>
          </div>

          {/* Main icon */}
          <div className="relative flex justify-center">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-500 to-accent-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-glow pointer-events-none"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-3xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                <AcademicCapIcon className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-gray-900 via-accent-700 to-accent-600 dark:from-white dark:via-accent-300 dark:to-accent-200 bg-clip-text text-transparent">
            {t('pages.home.title')}
          </span>
        </h1>

        <p className="text-xl font-medium text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          {t('pages.home.subtitle')}
        </p>

        {/* Decorative elements */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-2 h-2 bg-accent-300 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>

      {/* Enhanced Search Section */}
      <div className="mb-12">
        <div className="max-w-lg mx-auto">
          <div className="relative">
            {/* Search background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-750 dark:to-gray-800 rounded-2xl shadow-lg opacity-80 pointer-events-none"></div>
            <div className="relative p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                🔍 {t('pages.home.searchPlaceholder')}
              </h2>
              <SearchBox
                value={searchQuery}
                onChange={handleSearch}
                placeholder={t('pages.home.searchPlaceholder')}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Loading State */}
      {isLoading && (
        <div className="py-16">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <AcademicCapIcon className="h-9 w-9 text-white animate-pulse" />
              </div>
              <LoadingSpinner size="lg" className="justify-center" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t('pages.home.loading')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('pages.home.loadingDescription')}
            </p>
          </div>
        </div>
      )}

      {/* Classes Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredClasses.length > 0 ? (
            filteredClasses.map((className) => (
              <button
                key={className}
                onClick={() => handleClassClick(className)}
                className="group relative card p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 text-left overflow-hidden"
              >
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent-50/30 dark:to-accent-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                        <AcademicCapIcon className="h-7 w-7 text-white" />
                      </div>
                    </div>
                    <div className="text-accent-400 group-hover:text-accent-600 transition-colors duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-accent-700 dark:group-hover:text-accent-300 transition-colors duration-200">
                      {className}
                    </h3>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      📅 {t('navigation.classes')}
                    </p>
                    <div className="pt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300">
                        {t('pages.home.clickToView')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hover effect border */}
                <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-accent-200 dark:group-hover:border-accent-700 transition-colors duration-300"></div>
              </button>
            ))
          ) : (
            <div className="col-span-full">
              <div className="card p-12 text-center shadow-lg">
                <div className="max-w-md mx-auto">
                  {/* Empty state illustration */}
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-3xl flex items-center justify-center">
                    <AcademicCapIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {searchQuery ? t('messages.noClassesFound') : t('messages.noClassesAvailable')}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {searchQuery ? t('messages.tryDifferentKeyword') : t('messages.contactAdmin')}
                  </p>

                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="btn-primary inline-flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>{t('common.clear')}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Enhanced Stats */}
      {!isLoading && classes.length > 0 && (
        <div className="mt-12">
          <div className="card p-6 bg-gradient-to-r from-accent-50 to-accent-100 dark:from-accent-900/20 dark:to-accent-800/30 border-accent-200 dark:border-accent-700">
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-600 dark:text-accent-400 mb-1">
                  {searchQuery ? filteredClasses.length : classes.length}
                </div>
                <div className="text-sm font-medium text-accent-700 dark:text-accent-300">
                  {searchQuery ? t('pages.home.matchingClasses') : t('pages.home.totalClasses')}
                </div>
              </div>

              {searchQuery && (
                <>
                  <div className="text-2xl text-accent-400">/</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-1">
                      {classes.length}
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('pages.home.allClasses')}
                    </div>
                  </div>
                </>
              )}

              <div className="text-center">
                <div className="w-12 h-12 bg-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">📊</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}