import { useTranslation } from 'react-i18next';
import type { UnifiedTimetableData } from '../../types';
import './print.css';

interface PrintableTimetableProps {
  timetableData: UnifiedTimetableData;
  teacherName: string;
}

// 智能縮寫函數
const abbreviateClass = (className: string): string => {
  // G1 Adventurers → G1A
  // G2 Explorers → G2E
  // 101 → 101
  if (className.includes('Adventurers')) return className.replace('Adventurers', 'A').replace(/\s+/g, '');
  if (className.includes('Explorers')) return className.replace('Explorers', 'E').replace(/\s+/g, '');
  if (className.includes('Discoverers')) return className.replace('Discoverers', 'D').replace(/\s+/g, '');
  if (className.includes('Navigators')) return className.replace('Navigators', 'N').replace(/\s+/g, '');
  if (className.includes('Pioneers')) return className.replace('Pioneers', 'P').replace(/\s+/g, '');
  return className;
};

const abbreviateSubject = (subject: string): string => {
  const abbrev: Record<string, string> = {
    'English': 'Eng',
    'Mathematics': 'Math',
    'Science': 'Sci',
    'Social Studies': 'SS',
    'Physical Education': 'PE',
    'Music': 'Mus',
    'Art': 'Art',
    'Computer': 'Comp',
    'Chinese': 'Chi',
    'Reading': 'Read',
  };

  for (const [full, short] of Object.entries(abbrev)) {
    if (subject.includes(full)) {
      return subject.replace(full, short);
    }
  }
  return subject;
};

const simplifyTeacher = (teacher: string): string => {
  // 何真瑾 Evelyn → 何Evelyn
  // John Smith → J.Smith
  const match = teacher.match(/^([\u4e00-\u9fa5]{1,2}).*?\s+([A-Za-z]+)$/);
  if (match) {
    return `${match[1]}${match[2]}`;
  }

  const englishMatch = teacher.match(/^([A-Za-z]+)\s+([A-Za-z]+)$/);
  if (englishMatch) {
    return `${englishMatch[1][0]}.${englishMatch[2]}`;
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
                const course = timetableData[day]?.[period];

                if (!course) {
                  return (
                    <td key={day} className="empty-cell">
                      <div className="free-period">Free</div>
                    </td>
                  );
                }

                // 3行顯示格式
                const classAbbrev = abbreviateClass(course.class_name || '');
                const subjectAbbrev = abbreviateSubject(course.course_name || course.subject || '');
                const teacherSimple = simplifyTeacher(course.teacher || '');
                const classroom = course.classroom || '';

                return (
                  <td key={day} className="course-cell">
                    <div className="course-line-1">
                      {classAbbrev}-{subjectAbbrev} @ {classroom}
                    </div>
                    <div className="course-line-2">
                      {course.course_name || course.subject}
                    </div>
                    <div className="course-line-3">
                      {teacherSimple}
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
