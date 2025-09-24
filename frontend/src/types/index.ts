// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Student Types
export interface Student {
  student_id: string;
  student_name: string;
  english_class_name: string;
  home_room_class_name: string;
  ev_myreading_class_name?: string;
  grade?: string;
}

export interface StudentSearchResponse {
  success: boolean;
  students: Student[];
}

// Timetable Types
export interface TimetableEntry {
  period: number;
  time?: string;
  teacher: string;
  classroom: string;
  subject?: string;
  course_name?: string;
  class_type?: 'english' | 'homeroom' | 'ev_myreading';
}

export interface DayTimetable {
  [period: string]: TimetableEntry;
}

export interface WeeklyTimetable {
  Monday: TimetableEntry[];
  Tuesday: TimetableEntry[];
  Wednesday: TimetableEntry[];
  Thursday: TimetableEntry[];
  Friday: TimetableEntry[];
}

export interface TimetableDisplay {
  Monday: DayTimetable;
  Tuesday: DayTimetable;
  Wednesday: DayTimetable;
  Thursday: DayTimetable;
  Friday: DayTimetable;
}

// Unified Timetable Types (for merged display)
export interface UnifiedTimetableEntry {
  period: number;
  time?: string;
  entries: TimetableEntry[]; // Multiple entries for same time slot
}

export interface UnifiedDayTimetable {
  [period: string]: TimetableEntry[];
}

export interface UnifiedTimetableDisplay {
  Monday: UnifiedDayTimetable;
  Tuesday: UnifiedDayTimetable;
  Wednesday: UnifiedDayTimetable;
  Thursday: UnifiedDayTimetable;
  Friday: UnifiedDayTimetable;
}

// Student Timetable Response
export interface StudentTimetableResponse {
  success: boolean;
  student: Student;
  timetables: {
    english_timetable: TimetableDisplay;
    homeroom_timetable: TimetableDisplay;
    ev_myreading_timetable: TimetableDisplay;
  };
  statistics: {
    total_classes: number;
    days_with_classes: number;
    english_classes: number;
    ev_myreading_classes: number;
    homeroom_classes: number;
  };
}

// Class Types
export interface ClassInfo {
  id: number;
  class_name: string;
  grade: string;
}

export interface ClassListResponse {
  success: boolean;
  classes: string[];
}

export interface ClassTimetableResponse {
  success: boolean;
  class_name: string;
  timetable: WeeklyTimetable;
}

// Component Props Types
export interface TimetableGridProps {
  timetableData: TimetableDisplay;
  title: string;
  subtitle?: string;
  className?: string;
}

export interface UnifiedTimetableGridProps {
  timetableData: UnifiedTimetableDisplay;
  title: string;
  subtitle?: string;
  className?: string;
}

export interface StudentCardProps {
  student: Student;
  onClick: (student: Student) => void;
  className?: string;
}

export interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface SearchState {
  query: string;
  results: Student[];
  isSearching: boolean;
  error?: string;
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';

// Language Types
export type Language = 'zh-TW' | 'en-US';

export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
}

// Navigation Types
export interface NavItem {
  path: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

// Form Types
export interface FormErrors {
  [key: string]: string | undefined;
}

// Utility Types
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data?: T;
  status: AsyncStatus;
  error?: string;
}

// Store Types (for Zustand)
export interface AppStore {
  theme: Theme;
  language: Language;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
}

export interface StudentStore {
  selectedStudent?: Student;
  searchResults: Student[];
  searchQuery: string;
  isSearching: boolean;
  searchError?: string;
  setSelectedStudent: (student?: Student) => void;
  setSearchResults: (results: Student[]) => void;
  setSearchQuery: (query: string) => void;
  setIsSearching: (searching: boolean) => void;
  setSearchError: (error?: string) => void;
  clearSearch: () => void;
}

// Environment Types
export interface EnvConfig {
  apiBaseUrl: string;
  appTitle: string;
  appVersion: string;
  isDevelopment: boolean;
}

// Constants
export const LANGUAGES: LanguageConfig[] = [
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文' },
  { code: 'en-US', name: 'English (US)', nativeName: 'English' },
];

export const COURSE_TYPES = {
  ENGLISH: 'english',
  HOMEROOM: 'homeroom',
  EV_MYREADING: 'ev_myreading',
} as const;

export const COURSE_TYPE_COLORS = {
  [COURSE_TYPES.ENGLISH]: 'course-english',
  [COURSE_TYPES.HOMEROOM]: 'course-homeroom',
  [COURSE_TYPES.EV_MYREADING]: 'course-ev',
} as const;

export const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

export type Weekday = typeof WEEKDAYS[number];