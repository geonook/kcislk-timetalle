import { useTranslation } from 'react-i18next';
import { UserIcon } from '@heroicons/react/24/outline';
import type { StudentCardProps } from '../../types';

export default function StudentCard({ student, onClick, className = '' }: StudentCardProps) {
  const { t } = useTranslation();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('StudentCard 點擊事件觸發:', student.student_name);

    // 防止快速重複點擊
    if ((e.target as HTMLButtonElement).disabled) {
      console.log('按鈕已禁用，忽略點擊');
      return;
    }

    try {
      onClick(student);
    } catch (error) {
      console.error('StudentCard 點擊處理發生錯誤:', error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        relative card p-6 group w-full text-left overflow-hidden
        hover:shadow-2xl transition-all duration-300
        hover:scale-105 hover:-translate-y-1
        focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2
        bg-gradient-to-br from-white via-gray-50/50 to-white
        dark:from-gray-800 dark:via-gray-750 dark:to-gray-800
        border border-gray-200 dark:border-gray-700
        hover:border-accent-300 dark:hover:border-accent-600
        active:scale-100 active:shadow-lg
        ${className}
      `}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent-50/30 dark:to-accent-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex items-start space-x-4">
          {/* Enhanced avatar */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300 pointer-events-none"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <UserIcon className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Student name */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate mb-2 group-hover:text-accent-700 dark:group-hover:text-accent-300 transition-colors duration-200">
              {student.student_name}
            </h3>

            {/* Student info */}
            <div className="space-y-2">
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                <span className="mr-2">🎫</span>
                <span className="font-medium">{t('student.info.studentId')}:</span>
                <span className="ml-1 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-accent-600 dark:text-accent-400">
                  {student.student_id}
                </span>
              </div>

              {/* Class badges */}
              <div className="flex flex-wrap gap-2 mt-3">
                <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                  <span className="mr-1">👨‍🏫</span>
                  {student.english_class_name}
                </div>

                <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  <span className="mr-1">🏠</span>
                  {student.home_room_class_name}
                </div>

                {student.ev_myreading_class_name && (
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                    <span className="mr-1">📚</span>
                    {student.ev_myreading_class_name}
                  </div>
                )}

                {student.grade && (
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    <span className="mr-1">🎆</span>
                    {t('student.info.grade')} {student.grade}
                  </div>
                )}
              </div>
            </div>

            {/* Click indicator */}
            <div className="flex items-center justify-end mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="text-xs font-medium text-accent-600 dark:text-accent-400 mr-2">
                {t('pages.home.clickToView')}
              </span>
              <div className="w-5 h-5 rounded-full bg-accent-500 flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-200">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-accent-200 dark:group-hover:border-accent-700 transition-colors duration-300 pointer-events-none"></div>
    </button>
  );
}