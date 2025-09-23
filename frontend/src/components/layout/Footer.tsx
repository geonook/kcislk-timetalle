import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} {t('app.title')} - {t('app.description')}
          </div>
          <div className="mt-2 md:mt-0 text-sm text-gray-500 dark:text-gray-500">
            Version {import.meta.env.VITE_APP_VERSION || '1.0.0'}
          </div>
        </div>
      </div>
    </footer>
  );
}