import type { StudentTimetableResponse, UnifiedTimetableDisplay, TimetableEntry } from '../types';
import { WEEKDAYS } from '../types';

/**
 * 合併學生的多種課表類型為統一課表顯示
 * @param timetableData 學生課表回應數據
 * @returns 統一課表數據結構
 */
export function mergeStudentTimetables(timetableData: StudentTimetableResponse['timetables']): UnifiedTimetableDisplay {

  const unifiedTimetable: UnifiedTimetableDisplay = {
    Monday: {},
    Tuesday: {},
    Wednesday: {},
    Thursday: {},
    Friday: {}
  };

  // 遍歷每一天
  WEEKDAYS.forEach(day => {
    const dayKey = day as keyof typeof unifiedTimetable;
    unifiedTimetable[dayKey] = {};

    // 收集所有時段
    const periods = new Set<string>();

    // 從三種課表類型收集時段
    Object.keys(timetableData.english_timetable[dayKey] || {}).forEach(period => periods.add(period));
    Object.keys(timetableData.homeroom_timetable[dayKey] || {}).forEach(period => periods.add(period));
    Object.keys(timetableData.ev_myreading_timetable[dayKey] || {}).forEach(period => periods.add(period));

    // 為每個時段合併課程
    periods.forEach(period => {
      const entries: TimetableEntry[] = [];

      // 添加英文班課程
      const englishEntry = timetableData.english_timetable[dayKey]?.[period];
      if (englishEntry) {
        entries.push({
          ...englishEntry,
          class_type: 'english'
        });
      }

      // 添加導師班課程
      const homeroomEntry = timetableData.homeroom_timetable[dayKey]?.[period];
      if (homeroomEntry) {
        entries.push({
          ...homeroomEntry,
          class_type: 'homeroom'
        });
      }

      // 添加 EV & myReading 課程
      const evEntry = timetableData.ev_myreading_timetable[dayKey]?.[period];
      if (evEntry) {
        entries.push({
          ...evEntry,
          class_type: 'ev_myreading'
        });
      }

      // 只有有課程時才添加到統一課表
      if (entries.length > 0) {
        unifiedTimetable[dayKey][period] = entries;
      }
    });
  });

  return unifiedTimetable;
}

/**
 * 檢查是否有課表數據
 * @param unifiedTimetable 統一課表數據
 * @returns 是否有課程數據
 */
export function hasAnyTimetableData(unifiedTimetable: UnifiedTimetableDisplay): boolean {
  return WEEKDAYS.some(day => {
    const dayData = unifiedTimetable[day as keyof typeof unifiedTimetable];
    return Object.keys(dayData).length > 0;
  });
}

/**
 * 計算統一課表的統計信息
 * @param unifiedTimetable 統一課表數據
 * @returns 統計信息
 */
export function calculateUnifiedTimetableStats(unifiedTimetable: UnifiedTimetableDisplay) {
  let totalClasses = 0;
  let englishClasses = 0;
  let homeroomClasses = 0;
  let evClasses = 0;
  const daysWithClasses = new Set<string>();

  WEEKDAYS.forEach(day => {
    const dayData = unifiedTimetable[day as keyof typeof unifiedTimetable];

    Object.values(dayData).forEach(entries => {
      if (entries.length > 0) {
        daysWithClasses.add(day);

        entries.forEach(entry => {
          totalClasses++;

          switch (entry.class_type) {
            case 'english':
              englishClasses++;
              break;
            case 'homeroom':
              homeroomClasses++;
              break;
            case 'ev_myreading':
              evClasses++;
              break;
          }
        });
      }
    });
  });

  return {
    total_classes: totalClasses,
    english_classes: englishClasses,
    homeroom_classes: homeroomClasses,
    ev_myreading_classes: evClasses,
    days_with_classes: daysWithClasses.size
  };
}