import { useTranslation } from 'react-i18next';
import type { LoadingSpinnerProps } from '../../types';

export default function LoadingSpinner({
  size = 'md',
  text,
  variant = 'spinner',
  className = ''
}: LoadingSpinnerProps) {
  const { t } = useTranslation();

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const displayText = text || t('common.loading');

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className={`flex space-x-1 ${className}`}>
            <div className={`${sizeClasses[size]} bg-accent-600 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
            <div className={`${sizeClasses[size]} bg-accent-600 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
            <div className={`${sizeClasses[size]} bg-accent-600 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
          </div>
        );

      case 'pulse':
        return (
          <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-accent-500 to-accent-600 animate-pulse ${className}`}>
            <span className="sr-only">{displayText}</span>
          </div>
        );

      case 'gradient':
        return (
          <div className={`${sizeClasses[size]} rounded-full relative ${className}`}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 animate-spin">
              <div className="absolute inset-2 rounded-full bg-white dark:bg-gray-900"></div>
            </div>
            <span className="sr-only">{displayText}</span>
          </div>
        );

      case 'modern':
        return (
          <div className={`relative ${sizeClasses[size]} ${className}`}>
            <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-accent-500 to-accent-600 animate-spin">
              <div className="absolute inset-1 rounded-full bg-white dark:bg-gray-900"></div>
            </div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-accent-500/20 to-accent-600/20 animate-pulse"></div>
            <span className="sr-only">{displayText}</span>
          </div>
        );

      default: // 'spinner'
        return (
          <div className={`${sizeClasses[size]} rounded-full relative ${className}`}>
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-2 border-accent-200 dark:border-accent-800 animate-pulse"></div>
            {/* Inner spinning element */}
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-600 dark:border-t-accent-400 animate-spin"></div>
            {/* Center dot */}
            <div className="absolute inset-2 rounded-full bg-accent-100 dark:bg-accent-900/30 animate-pulse"></div>
            <span className="sr-only">{displayText}</span>
          </div>
        );
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${variant === 'dots' ? '' : 'p-4'}`}>
      {renderSpinner()}
      {displayText && (
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 animate-pulse">
            {displayText}
          </p>
          {/* Animated dots */}
          <div className="flex justify-center space-x-1 mt-1">
            <div className="w-1 h-1 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-1 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1 h-1 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}