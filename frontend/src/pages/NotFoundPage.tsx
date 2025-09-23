import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HomeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <ExclamationTriangleIcon className="h-24 w-24 text-gray-400" />
        </div>

        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>

        <h2 className="text-2xl font-medium text-gray-700 dark:text-gray-300 mb-4">
          {t('pages.notFound.title', '頁面不存在')}
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          {t('pages.notFound.description', '抱歉，您要尋找的頁面不存在。可能已被移除、重新命名或暫時無法使用。')}
        </p>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center btn-primary"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            {t('pages.notFound.backToHome', '返回首頁')}
          </Link>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t('pages.notFound.suggestion', '或使用上方導航列返回其他頁面')}
          </div>
        </div>
      </div>
    </div>
  );
}