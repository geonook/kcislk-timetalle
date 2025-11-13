import { useTranslation } from 'react-i18next';
import type { UnifiedTimetableDisplay } from '../../types';
import './print.css';

interface PrintableTimetableProps {
  timetableData: UnifiedTimetableDisplay;
  teacherName?: string;
  className?: string;
}

// 智能格式化函數 - 優化顯示
const formatClassName = (className: string): string => {
  return className.replace(/\s+/g, ' ').trim();
};

const formatSubject = (subject: string): string => {
  // 只縮寫特別長的科目名稱
  const abbrev: Record<string, string> = {
    'Physical Education': 'PE',
    'Social Studies': 'Social',
  };

  for (const [full, short] of Object.entries(abbrev)) {
    if (subject.includes(full)) {
      return subject.replace(full, short);
    }
  }
  return subject;
};

const formatTeacher = (teacher: string): string => {
  // 何真瑾 Evelyn → 何 Evelyn
  const match = teacher.match(/^([\u4e00-\u9fa5]+)\s+([A-Za-z]+)$/);
  if (match) {
    return `${match[1]} ${match[2]}`;
  }
  return teacher;
};

// 格式化日期時間（專業顯示）
const formatPrintDateTime = (): string => {
  const now = new Date();
  const date = now.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const time = now.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return `${date} ${time}`;
};

export default function PrintableTimetable({
  timetableData,
  teacherName,
  className
}: PrintableTimetableProps) {
  const { t } = useTranslation();

  // Determine display name (teacher or class)
  const displayName = teacherName || className || 'Timetable';

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = Array.from({ length: 8 }, (_, i) => i + 1);

  const timeSlots: Record<number, string> = {
    1: '08:25-09:10',
    2: '09:15-10:00',
    3: '10:30-11:15',
    4: '11:20-12:05',
    5: '13:15-14:00',
    6: '14:05-14:50',
    7: '15:05-15:50',
    8: '15:55-16:40',
  };

  return (
    <div className="printable-timetable">
      {/* Enhanced Header with Brand Identity */}
      <div className="print-header">
        {/* 可選：如果有 Logo 可以加在這裡 */}
        {/* <img src="/logo.png" alt="KCISLK Logo" className="print-header-logo" /> */}

        <h1>
          {displayName} - {teacherName ? t('pages.teacher.timetable') : t('pages.class.timetableTitle')}
        </h1>

        <p className="print-date">
          列印時間: {formatPrintDateTime()}
        </p>
      </div>

      {/* Timetable Table - Card-like Design */}
      <table className="print-table">
        <thead>
          <tr>
            <th className="time-column">
              {t('timetable.period')}
            </th>
            {days.map(day => (
              <th key={day} className="day-column">
                {t(`timetable.weekdays.${day.toLowerCase()}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {periods.map(period => (
            <tr key={period}>
              {/* Time Cell with Visual Emphasis */}
              <td className="time-cell">
                <div className="period-number">P{period}</div>
                <div className="period-time">{timeSlots[period]}</div>
              </td>

              {/* Course Cells */}
              {days.map(day => {
                const courses = timetableData[day]?.[period];

                if (!courses || courses.length === 0) {
                  return (
                    <td key={day} className="empty-cell">
                      <div className="free-period">Free Period</div>
                    </td>
                  );
                }

                // 顯示第一個課程
                const course = courses[0];

                // 格式化顯示資訊
                const className = formatClassName(course.class_name || '');
                const subject = formatSubject(course.course_name || course.subject || '');
                const teacher = formatTeacher(course.teacher || '');
                const classroom = course.classroom || '';

                return (
                  <td key={day} className="course-cell">
                    <div className="course-line-1">
                      {className}
                    </div>
                    <div className="course-line-2">
                      {subject}
                    </div>
                    <div className="course-line-3">
                      {teacher} @ {classroom}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Enhanced Footer with Professional Touch */}
      <div className="print-footer">
        <p>
          康橋國際學校林口校區小學部 KCISLK Timetable System © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
