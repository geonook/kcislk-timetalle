import { useTranslation } from 'react-i18next';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import type { ClassroomCardProps } from '../../types';

export default function ClassroomCard({ classroom, onClick, className = '' }: ClassroomCardProps) {
  const { t } = useTranslation();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('ClassroomCard 點擊事件觸發:', classroom.classroom_name);

    // 防止快速重複點擊
    if ((e.target as HTMLButtonElement).disabled) {
      console.log('按鈕已禁用，忽略點擊');
      return;
    }

    try {
      onClick(classroom);
    } catch (error) {
      console.error('ClassroomCard 點擊處理發生錯誤:', error);
    }
  };

  // 從教室名稱提取樓層顯示
  const getFloorDisplay = (name: string): string => {
    if (name.startsWith('KCFS')) return 'KCFS';
    if (name.length >= 2 && name[0] === 'E' && /\d/.test(name[1])) {
      return `${name[1]}F`;
    }
    return '';
  };

  const floorDisplay = getFloorDisplay(classroom.classroom_name);

  return (
    <button
      onClick={handleClick}
      className={`
        relative card p-6 group w-full text-left overflow-hidden
        hover:shadow-2xl transition-all duration-300
        hover:scale-105 hover:-translate-y-1
        focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
        bg-gradient-to-br from-white via-gray-50/50 to-white
        dark:from-gray-800 dark:via-gray-750 dark:to-gray-800
        border border-gray-200 dark:border-gray-700
        hover:border-teal-300 dark:hover:border-teal-600
        active:scale-100 active:shadow-lg
        ${className}
      `}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-teal-50/30 dark:to-teal-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex items-start space-x-4">
          {/* Enhanced avatar */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300 pointer-events-none"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <BuildingOfficeIcon className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Classroom name */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate mb-2 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors duration-200">
              {classroom.classroom_name}
            </h3>

            {/* Classroom info */}
            <div className="space-y-2">
              {floorDisplay && (
                <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                  <span className="mr-2">🏢</span>
                  <span className="font-medium">{t('classroom.info.floor')}:</span>
                  <span className="ml-1 font-mono bg-teal-100 dark:bg-teal-900/30 px-2 py-0.5 rounded text-teal-600 dark:text-teal-400">
                    {floorDisplay}
                  </span>
                </div>
              )}
            </div>

            {/* Click indicator */}
            <div className="flex items-center justify-end mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="text-xs font-medium text-teal-600 dark:text-teal-400 mr-2">
                {t('pages.classroom.clickToView')}
              </span>
              <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-200">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-teal-200 dark:group-hover:border-teal-700 transition-colors duration-300 pointer-events-none"></div>
    </button>
  );
}
