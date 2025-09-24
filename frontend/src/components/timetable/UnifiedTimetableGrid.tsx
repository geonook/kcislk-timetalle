import { useTranslation } from 'react-i18next';
import type { UnifiedTimetableGridProps, TimetableEntry } from '../../types';
import { WEEKDAYS, COURSE_TYPE_COLORS } from '../../types';

export default function UnifiedTimetableGrid({
  timetableData,
  title,
  subtitle,
  className = ''
}: UnifiedTimetableGridProps) {
  const { t } = useTranslation();

  // Get all periods from the unified timetable data
  const getAllPeriods = () => {
    const periods = new Set<number>();
    WEEKDAYS.forEach(day => {
      const dayTimetable = timetableData[day as keyof typeof timetableData];
      if (dayTimetable) {
        Object.keys(dayTimetable).forEach(period => {
          periods.add(parseInt(period));
        });
      }
    });
    return Array.from(periods).sort((a, b) => a - b);
  };

  const periods = getAllPeriods();

  const getCellContent = (day: string, period: number) => {
    const dayTimetable = timetableData[day as keyof typeof timetableData];
    const entries = dayTimetable?.[period.toString()];
    return entries || [];
  };

  const getCellClass = (entries: TimetableEntry[]) => {
    if (!entries || entries.length === 0) {
      return 'bg-gray-50 dark:bg-gray-800';
    }

    // If multiple entries, use a mixed background
    if (entries.length > 1) {
      return 'bg-gradient-to-r from-green-50 via-blue-50 to-orange-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-orange-900/20';
    }

    // Single entry - use specific color
    const entry = entries[0];
    const classType = entry.class_type;
    if (classType && COURSE_TYPE_COLORS[classType as keyof typeof COURSE_TYPE_COLORS]) {
      const colorClass = COURSE_TYPE_COLORS[classType as keyof typeof COURSE_TYPE_COLORS];
      return `course-${colorClass}`;
    }

    return 'bg-blue-50 dark:bg-blue-900/20';
  };

  const getTypeLabel = (classType?: string) => {
    switch (classType) {
      case 'english':
        return { label: t('timetable.courseTypes.english'), color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20' };
      case 'homeroom':
        return { label: t('timetable.courseTypes.homeroom'), color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20' };
      case 'ev_myreading':
        return { label: t('timetable.courseTypes.ev_myreading'), color: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20' };
      default:
        return { label: '課程', color: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20' };
    }
  };

  if (periods.length === 0) {
    return (
      <div className={`card p-6 ${className}`}>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {subtitle}
            </p>
          )}
          <p className="text-gray-500 dark:text-gray-400">
            暫無課表資料
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`card p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* Timetable Grid */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                節次
              </th>
              {WEEKDAYS.map((day) => (
                <th
                  key={day}
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {t(`timetable.weekdays.${day.toLowerCase()}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {periods.map((period) => (
              <tr key={period}>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800">
                  {t(`timetable.periods.${period}`, `第${period}節`)}
                </td>
                {WEEKDAYS.map((day) => {
                  const entries = getCellContent(day, period);
                  return (
                    <td
                      key={`${day}-${period}`}
                      className={`px-2 py-4 text-xs ${getCellClass(entries)} border-r border-gray-200 dark:border-gray-700 last:border-r-0`}
                    >
                      {entries.length > 0 ? (
                        <div className="space-y-2">
                          {entries.map((entry, index) => {
                            const typeInfo = getTypeLabel(entry.class_type);
                            return (
                              <div key={index} className="space-y-1 p-2 bg-white/50 dark:bg-gray-900/50 rounded border">
                                {/* Course Type Label */}
                                <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
                                  {typeInfo.label}
                                </div>

                                {/* Course/Subject Name */}
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {entry.course_name || entry.subject || '課程'}
                                </div>

                                {/* Teacher */}
                                {entry.teacher && (
                                  <div className="text-gray-600 dark:text-gray-300">
                                    👨‍🏫 {entry.teacher}
                                  </div>
                                )}

                                {/* Classroom */}
                                {entry.classroom && (
                                  <div className="text-gray-500 dark:text-gray-400">
                                    📍 {entry.classroom}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-gray-400 dark:text-gray-500 italic text-center py-4">
                          {t('timetable.emptySlot')}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-xs border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded course-english mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400">{t('timetable.courseTypes.english')}</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded course-homeroom mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400">{t('timetable.courseTypes.homeroom')}</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded course-ev mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400">{t('timetable.courseTypes.ev_myreading')}</span>
        </div>
        <div className="flex items-center text-gray-500 dark:text-gray-400">
          <span className="text-xs">💡 同一時段多種課程會一起顯示</span>
        </div>
      </div>
    </div>
  );
}