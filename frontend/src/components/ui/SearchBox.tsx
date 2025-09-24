import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { SearchBoxProps } from '../../types';
import LoadingSpinner from './LoadingSpinner';

export default function SearchBox({
  value,
  onChange,
  onSubmit,
  placeholder,
  loading = false,
  disabled = false,
  className = ''
}: SearchBoxProps) {
  const { t } = useTranslation();
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && localValue.trim()) {
      onSubmit(localValue.trim());
    }
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  const displayPlaceholder = placeholder || t('common.search');

  return (
    <form onSubmit={handleSubmit} className={`relative group ${className}`}>
      <div className="relative">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent-500/10 to-accent-600/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative">
          {/* Search icon container */}
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <div className={`transition-all duration-200 ${
              loading ? 'scale-110' : localValue ? 'text-accent-500 scale-110' : 'text-gray-400'
            }`}>
              {loading ? (
                <LoadingSpinner size="sm" variant="modern" className="!m-0" />
              ) : (
                <MagnifyingGlassIcon className="h-5 w-5" />
              )}
            </div>
          </div>

          {/* Enhanced input field */}
          <input
            type="text"
            value={localValue}
            onChange={handleInputChange}
            placeholder={displayPlaceholder}
            disabled={disabled || loading}
            className={`
              w-full pl-12 pr-12 py-3.5
              bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm
              border-2 border-gray-200 dark:border-gray-700
              rounded-2xl shadow-sm
              text-gray-900 dark:text-white
              placeholder:text-gray-500 dark:placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500
              transition-all duration-200
              hover:border-accent-300 dark:hover:border-accent-600
              hover:shadow-md
              ${
                localValue
                  ? 'border-accent-400 dark:border-accent-500 bg-accent-50/30 dark:bg-accent-900/10'
                  : ''
              }
              ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          />

          {/* Clear button */}
          {localValue && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 hover:scale-110"
            >
              <div className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                <XMarkIcon className="h-4 w-4" />
              </div>
            </button>
          )}

          {/* Status indicator */}
          {localValue && (
            <div className="absolute inset-y-0 right-10 flex items-center">
              <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced submit button */}
      {onSubmit && (
        <button
          type="submit"
          disabled={!localValue.trim() || loading || disabled}
          className="
            btn-primary mt-4 w-full
            bg-gradient-to-r from-accent-500 to-accent-600
            hover:from-accent-600 hover:to-accent-700
            disabled:from-gray-400 disabled:to-gray-500
            shadow-lg hover:shadow-xl
            transform transition-all duration-200
            hover:scale-105 hover:-translate-y-0.5
            disabled:scale-100 disabled:translate-y-0
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <div className="flex items-center justify-center space-x-2">
            {loading ? (
              <>
                <LoadingSpinner size="sm" variant="dots" className="!m-0" />
                <span>{t('common.loading')}</span>
              </>
            ) : (
              <>
                <MagnifyingGlassIcon className="h-5 w-5" />
                <span>{t('common.search')}</span>
                <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center">
                  <span className="text-xs font-bold">⏎</span>
                </div>
              </>
            )}
          </div>
        </button>
      )}

      {/* Subtle animation for input focus */}
      <style jsx>{`
        .group:focus-within .absolute.inset-0 {
          opacity: 1;
        }
      `}</style>
    </form>
  );
}