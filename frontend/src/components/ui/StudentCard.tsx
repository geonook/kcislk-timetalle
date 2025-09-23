import { useTranslation } from 'react-i18next';
import { UserIcon } from '@heroicons/react/24/outline';
import { StudentCardProps } from '../../types';

export default function StudentCard({ student, onClick, className = '' }: StudentCardProps) {
  const { t } = useTranslation();

  return (
    <button
      onClick={() => onClick(student)}
      className={`card p-4 hover:shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 text-left group w-full ${className}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <UserIcon className="h-8 w-8 text-accent-600 group-hover:text-accent-700" />
        </div>
        <div className="ml-3 flex-1 min-w-0">
          <p className="text-base font-medium text-gray-900 dark:text-white truncate group-hover:text-accent-700 dark:group-hover:text-accent-300">
            {student.student_name}
          </p>
          <div className="mt-1 space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              <span className="font-medium">{t('student.info.studentId')}:</span> {student.student_id}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              <span className="font-medium">{t('student.info.englishClass')}:</span> {student.english_class_name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              <span className="font-medium">{t('student.info.homeroomClass')}:</span> {student.home_room_class_name}
            </p>
            {student.ev_myreading_class_name && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                <span className="font-medium">{t('student.info.evClass')}:</span> {student.ev_myreading_class_name}
              </p>
            )}
            {student.grade && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium">{t('student.info.grade')}:</span> {student.grade}
              </p>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}