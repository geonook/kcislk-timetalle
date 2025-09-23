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
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {loading ? (
            <LoadingSpinner size="sm" className="!m-0" />
          ) : (
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          )}
        </div>

        <input
          type="text"
          value={localValue}
          onChange={handleInputChange}
          placeholder={displayPlaceholder}
          disabled={disabled || loading}
          className={`input-primary pl-10 ${
            localValue ? 'pr-10' : 'pr-4'
          } ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        />

        {localValue && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {onSubmit && (
        <button
          type="submit"
          disabled={!localValue.trim() || loading || disabled}
          className="btn-primary mt-3 w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" className="!m-0 mr-2" />
              {t('common.loading')}
            </div>
          ) : (
            t('common.search')
          )}
        </button>
      )}
    </form>
  );
}