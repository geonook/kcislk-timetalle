import { useTranslation } from 'react-i18next';
import type { LoadingSpinnerProps } from '../../types';

export default function LoadingSpinner({
  size = 'md',
  text,
  className = ''
}: LoadingSpinnerProps) {
  const { t } = useTranslation();

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const displayText = text || t('common.loading');

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-accent-600 dark:border-gray-600 dark:border-t-accent-400`}
      >
        <span className="sr-only">{displayText}</span>
      </div>
      {displayText && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {displayText}
        </p>
      )}
    </div>
  );
}