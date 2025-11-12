import { useTranslation } from 'react-i18next';
import type { UnifiedTimetableDisplay } from '../../types';
import './print.css';

interface PrintableTimetableProps {
  timetableData: UnifiedTimetableDisplay;
  teacherName: string;
}

// 智能格式化函數 - 減少過度縮寫
const formatClassName = (className: string): string => {
  // 保持原樣，只移除多餘空格
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
  // 何真瑾 Evelyn → 何 Evelyn (加空格更清晰)
  const match = teacher.match(/^([\u4e00-\u9fa5]+)\s+([A-Za-z]+)$/);
  if (match) {
    return `${match[1]} ${match[2]}`;
  }
  return teacher;
};

export default function PrintableTimetable({ timetableData, teacherName }: PrintableTimetableProps) {
  const { t } = useTranslation();

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
      {/* Header */}
      <div className="print-header">
        <h1>{teacherName} - {t('pages.teacher.timetable')}</h1>
        <p className="print-date">列印日期: {new Date().toLocaleDateString('zh-TW')}</p>
      </div>

      {/* Timetable Table */}
      <table className="print-table">
        <thead>
          <tr>
            <th className="time-column">{t('timetable.period')}</th>
            {days.map(day => (
              <th key={day} className="day-column">
                {t(`timetable.days.${day.toLowerCase()}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {periods.map(period => (
            <tr key={period}>
              <td className="time-cell">
                <div className="period-number">{period}</div>
                <div className="period-time">{timeSlots[period]}</div>
              </td>
              {days.map(day => {
                const courses = timetableData[day]?.[period];

                if (!courses || courses.length === 0) {
                  return (
                    <td key={day} className="empty-cell">
                      <div className="free-period">Free</div>
                    </td>
                  );
                }

                // 如果有多個課程，只顯示第一個（教師不應該同時有多個課程）
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

      {/* Footer */}
      <div className="print-footer">
        <p>KCISLK 課表查詢系統 | {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}
