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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <AcademicCapIcon className="h-16 w-16 text-accent-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('pages.home.title')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {t('pages.home.subtitle')}
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <SearchBox
          value={searchQuery}
          onChange={handleSearch}
          placeholder={t('pages.home.searchPlaceholder')}
          className="max-w-md mx-auto"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="py-12">
          <LoadingSpinner
            size="lg"
            text={t('pages.home.loading')}
            className="justify-center"
          />
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
                className="card p-4 hover:shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 text-left group"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AcademicCapIcon className="h-8 w-8 text-accent-600 group-hover:text-accent-700" />
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-accent-700 dark:group-hover:text-accent-300">
                      {className}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('navigation.classes')}
                    </p>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                {searchQuery ? '找不到符合的班級' : '暫無班級資料'}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchQuery ? '請嘗試其他搜尋關鍵字' : '請聯繫管理員添加班級資料'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 btn-secondary"
                >
                  {t('common.clear')}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      {!isLoading && classes.length > 0 && (
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          {searchQuery ? (
            <p>
              顯示 {filteredClasses.length} 個班級，共 {classes.length} 個班級
            </p>
          ) : (
            <p>
              共 {classes.length} 個班級
            </p>
          )}
        </div>
      )}
    </div>
  );
}