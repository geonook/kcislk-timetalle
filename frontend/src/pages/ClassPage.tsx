import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import TimetableGrid from '../components/timetable/TimetableGrid';
import { ArrowLeftIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

export default function ClassPage() {
  const { className } = useParams<{ className: string }>();
  const { t } = useTranslation();

  const {
    data: timetableData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['class-timetable', className],
    queryFn: () => apiService.getClassTimetable(className!),
    enabled: !!className,
  });

  if (!className) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          班級名稱無效
        </h1>
        <Link to="/classes" className="btn-primary">
          返回班級列表
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/classes"
            className="inline-flex items-center text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            返回班級列表
          </Link>
        </div>

        {/* Error State */}
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-red-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('pages.class.error')}
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
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <Link
            to="/classes"
            className="inline-flex items-center text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            返回班級列表
          </Link>
        </div>

        <div className="mt-4 flex items-center">
          <AcademicCapIcon className="h-8 w-8 text-accent-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {decodeURIComponent(className)} - {t('pages.class.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              班級週課表
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="py-12">
          <LoadingSpinner
            size="lg"
            text={t('pages.class.loading')}
            className="justify-center"
          />
        </div>
      )}

      {/* Timetable */}
      {timetableData && (
        <div>
          <TimetableGrid
            timetableData={timetableData.timetable}
            title={`${decodeURIComponent(className)} 週課表`}
            subtitle={`班級: ${timetableData.class_name}`}
          />
        </div>
      )}
    </div>
  );
}