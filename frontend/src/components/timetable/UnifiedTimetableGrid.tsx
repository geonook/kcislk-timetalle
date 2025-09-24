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
    <div className={`card p-6 shadow-lg ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-1 h-8 bg-gradient-to-b from-accent-500 to-accent-600 rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-400 ml-7">
            {subtitle}
          </p>
        )}
      </div>

      {/* Timetable Grid */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750">
            <tr>
              <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
                📅 節次
              </th>
              {WEEKDAYS.map((day) => (
                <th
                  key={day}
                  scope="col"
                  className="px-4 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                  {t(`timetable.weekdays.${day.toLowerCase()}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-700">
            {periods.map((period) => (
              <tr key={period} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors duration-200">
                <td className="px-4 py-6 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 border-r border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center text-accent-600 dark:text-accent-400 font-bold text-xs">
                      {period}
                    </div>
                    <span className="hidden sm:inline text-gray-600 dark:text-gray-400">
                      {t(`timetable.periods.${period}`, `第${period}節`)}
                    </span>
                  </div>
                </td>
                {WEEKDAYS.map((day) => {
                  const entries = getCellContent(day, period);
                  return (
                    <td
                      key={`${day}-${period}`}
                      className={`px-3 py-6 text-xs ${getCellClass(entries)} border-r border-gray-200 dark:border-gray-700 last:border-r-0 transition-all duration-300`}
                    >
                      {entries.length > 0 ? (
                        <div className="space-y-3">
                          {entries.map((entry, index) => {
                            const typeInfo = getTypeLabel(entry.class_type);
                            return (
                              <div key={index} className="group relative">
                                <div className="p-3 bg-white/80 dark:bg-gray-900/60 rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 backdrop-blur-sm">
                                  {/* Course Type Label */}
                                  <div className="flex items-center justify-between mb-2">
                                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${typeInfo.color} shadow-sm`}>
                                      {typeInfo.label}
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-current opacity-60"></div>
                                  </div>

                                  {/* Course/Subject Name */}
                                  <div className="font-bold text-sm text-gray-900 dark:text-white mb-2 leading-tight">
                                    {entry.course_name || entry.subject || '課程'}
                                  </div>

                                  {/* Teacher and Classroom Info */}
                                  <div className="space-y-1">
                                    {entry.teacher && (
                                      <div className="flex items-center text-gray-600 dark:text-gray-300 text-xs">
                                        <span className="mr-1.5">👨‍🏫</span>
                                        <span className="font-medium truncate">{entry.teacher}</span>
                                      </div>
                                    )}
                                    {entry.classroom && (
                                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                                        <span className="mr-1.5">📍</span>
                                        <span className="font-medium truncate">{entry.classroom}</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Subtle hover effect overlay */}
                                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg pointer-events-none"></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-500">
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2">
                            <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                          </div>
                          <span className="text-xs italic font-medium">{t('timetable.emptySlot')}</span>
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
      <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex flex-wrap gap-6 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-lg course-english shadow-sm border border-green-200 dark:border-green-800"></div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">{t('timetable.courseTypes.english')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-lg course-homeroom shadow-sm border border-blue-200 dark:border-blue-800"></div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">{t('timetable.courseTypes.homeroom')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-lg course-ev shadow-sm border border-orange-200 dark:border-orange-800"></div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">{t('timetable.courseTypes.ev_myreading')}</span>
            </div>
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-900/50 px-3 py-1.5 rounded-full">
            <span className="mr-2">💡</span>
            <span className="text-xs font-medium">同一時段多種課程會一起顯示</span>
          </div>
        </div>
      </div>
    </div>
  );
}