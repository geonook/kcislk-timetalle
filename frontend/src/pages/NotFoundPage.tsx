import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HomeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center">
          {/* Premium Error Illustration */}
          <div className="relative mb-12">
            {/* Background decoration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 bg-gradient-to-br from-red-200 to-red-300 dark:from-red-800 dark:to-red-700 rounded-full opacity-20 blur-3xl"></div>
            </div>

            {/* Main error icon */}
            <div className="relative flex justify-center">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-glow"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                  <ExclamationTriangleIcon className="h-14 w-14 text-white" />
                </div>
              </div>
            </div>

            {/* Floating 404 */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 px-4 py-2 rounded-full border border-red-200 dark:border-red-700 shadow-lg backdrop-blur-sm">
                <span className="text-sm font-bold text-red-700 dark:text-red-300">ERROR</span>
              </div>
            </div>
          </div>

          {/* 404 Number */}
          <h1 className="text-8xl font-bold mb-6">
            <span className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 dark:from-red-400 dark:via-red-300 dark:to-orange-300 bg-clip-text text-transparent drop-shadow-lg">
              404
            </span>
          </h1>

          {/* Error Title */}
          <h2 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-900 via-red-700 to-red-600 dark:from-white dark:via-red-300 dark:to-red-200 bg-clip-text text-transparent">
              {t('pages.notFound.title')}
            </span>
          </h2>

          {/* Error Description */}
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-lg mx-auto leading-relaxed">
            {t('pages.notFound.description')}
          </p>

          {/* Action Buttons */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/classes"
                className="
                  group relative overflow-hidden
                  bg-gradient-to-r from-accent-500 to-accent-600
                  hover:from-accent-600 hover:to-accent-700
                  text-white font-semibold px-8 py-4 rounded-2xl
                  shadow-lg hover:shadow-xl
                  transform transition-all duration-200
                  hover:scale-105 hover:-translate-y-0.5
                  focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2
                "
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <div className="relative flex items-center justify-center space-x-2">
                  <HomeIcon className="h-5 w-5" />
                  <span>{t('navigation.classes')}</span>
                </div>
              </Link>

              <Link
                to="/students"
                className="
                  group relative overflow-hidden
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                  hover:bg-gray-50 dark:hover:bg-gray-750
                  font-semibold px-8 py-4 rounded-2xl
                  border-2 border-gray-200 dark:border-gray-600
                  hover:border-accent-300 dark:hover:border-accent-600
                  shadow-lg hover:shadow-xl
                  transform transition-all duration-200
                  hover:scale-105 hover:-translate-y-0.5
                  focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2
                "
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent-50/50 to-transparent dark:from-accent-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <div className="relative flex items-center justify-center space-x-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{t('navigation.students')}</span>
                </div>
              </Link>
            </div>

            {/* Help Text */}
            <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 rounded-xl border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center space-x-2">
                <span>💡</span>
                <span>{t('pages.notFound.suggestion')}</span>
              </p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="flex justify-center space-x-2 mt-8">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}