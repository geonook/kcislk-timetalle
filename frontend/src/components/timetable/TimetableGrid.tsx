import { useTranslation } from 'react-i18next';
import { TimetableGridProps, TimetableEntry, WEEKDAYS, COURSE_TYPE_COLORS } from '../../types';

export default function TimetableGrid({
  timetableData,
  title,
  subtitle,
  className = ''
}: TimetableGridProps) {
  const { t } = useTranslation();

  // Get all periods from the timetable data
  const getAllPeriods = () => {
    const periods = new Set<number>();
    WEEKDAYS.forEach(day => {
      if (timetableData[day]) {
        Object.keys(timetableData[day]).forEach(period => {
          periods.add(parseInt(period));
        });
      }
    });
    return Array.from(periods).sort((a, b) => a - b);
  };

  const periods = getAllPeriods();

  const getCellContent = (day: string, period: number) => {
    const entry = timetableData[day]?.[period.toString()];
    return entry || null;
  };

  const getCellClass = (entry: TimetableEntry | null) => {
    if (!entry) return 'bg-gray-50 dark:bg-gray-800';

    const classType = entry.class_type;
    if (classType && COURSE_TYPE_COLORS[classType as keyof typeof COURSE_TYPE_COLORS]) {
      const colorClass = COURSE_TYPE_COLORS[classType as keyof typeof COURSE_TYPE_COLORS];
      return `course-${colorClass}`;
    }

    return 'bg-blue-50 dark:bg-blue-900/20';
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    // Handle different time formats
    if (timeStr.includes('-')) {
      return timeStr; // Already formatted as "start-end"
    }
    return timeStr;
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
                  const entry = getCellContent(day, period);
                  return (
                    <td
                      key={`${day}-${period}`}
                      className={`px-3 py-4 text-xs ${getCellClass(entry)} border-r border-gray-200 dark:border-gray-700 last:border-r-0`}
                    >
                      {entry ? (
                        <div className="space-y-1">
                          {/* Course/Subject Name */}
                          <div className="font-medium text-gray-900 dark:text-white">
                            {entry.course_name || entry.subject || '課程'}
                          </div>

                          {/* Teacher */}
                          {entry.teacher && (
                            <div className="text-gray-600 dark:text-gray-300">
                              {entry.teacher}
                            </div>
                          )}

                          {/* Classroom */}
                          {entry.classroom && (
                            <div className="text-gray-500 dark:text-gray-400">
                              {entry.classroom}
                            </div>
                          )}

                          {/* Time */}
                          {entry.time && (
                            <div className="text-gray-500 dark:text-gray-400">
                              {formatTime(entry.time)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-400 dark:text-gray-500 italic">
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
      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded course-english mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400">{t('timetable.courseTypes.english')}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded course-homeroom mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400">{t('timetable.courseTypes.homeroom')}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded course-ev mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400">{t('timetable.courseTypes.ev_myreading')}</span>
        </div>
      </div>
    </div>
  );
}