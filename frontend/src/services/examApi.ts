/**
 * 期中考監考管理 API 服務
 * 提供考試場次查詢、班級查詢、監考分配等功能
 */
import axios from 'axios';

// ============================================================
// Types
// ============================================================

export interface ExamSession {
  id: number;
  grade_band: string;
  exam_type: 'LT' | 'IT';
  grade: string;
  exam_date: string;
  periods: string;
  duration: number;
  self_study_time: string | null;
  preparation_time: string;
  exam_time: string;
  subject: string;
}

export interface ClassExamInfo {
  id: number;
  class_name: string;
  grade: string;
  level: string;
  exam_session_id: number;
  students: number;
  count: number;
  teacher: string | null;
  has_proctor: boolean;
  exam_session?: ExamSession;
  proctor?: string;
  classroom?: string;
  notes?: string;
}

export interface ProctorAssignment {
  id: number;
  class_exam_info_id: number;
  class_name: string;
  proctor_teacher: string;
  classroom: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ExamStats {
  overall: {
    total_classes: number;
    assigned: number;
    unassigned: number;
    progress_percent: number;
  };
  by_date: Array<{
    date: string;
    total_classes: number;
    assigned: number;
    unassigned: number;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ============================================================
// Axios Instance
// ============================================================

const examApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
examApi.interceptors.request.use(
  (config) => {
    console.log(`Exam API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Exam API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
examApi.interceptors.response.use(
  (response) => {
    console.log(`Exam API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('Exam API Response Error:', error);
    throw error;
  }
);

// ============================================================
// API Functions
// ============================================================

/**
 * 考試場次 API
 */
export const examSessionApi = {
  /**
   * 取得所有考試場次
   */
  getAll: async (): Promise<ExamSession[]> => {
    const response = await examApi.get('/exams/sessions');
    return response.data.sessions;
  },

  /**
   * 取得特定考試場次
   */
  getById: async (sessionId: number): Promise<ExamSession> => {
    const response = await examApi.get(`/exams/sessions/${sessionId}`);
    return response.data.session;
  },

  /**
   * 取得特定日期的考試場次
   */
  getByDate: async (date: string): Promise<ExamSession[]> => {
    const response = await examApi.get(`/exams/sessions/by-date/${date}`);
    return response.data.sessions;
  },
};

/**
 * 班級考試資訊 API
 */
export const classExamInfoApi = {
  /**
   * 取得所有班級考試資訊
   */
  getAll: async (): Promise<ClassExamInfo[]> => {
    const response = await examApi.get('/exams/classes');
    return response.data.classes;
  },

  /**
   * 取得特定 GradeBand 的班級
   */
  getByGradeBand: async (gradeBand: string): Promise<{
    grade_band: string;
    exam_session: ExamSession;
    classes: ClassExamInfo[];
  }> => {
    const response = await examApi.get(`/exams/classes/grade-band/${encodeURIComponent(gradeBand)}`);
    return {
      grade_band: response.data.grade_band,
      exam_session: response.data.exam_session,
      classes: response.data.classes,
    };
  },

  /**
   * 取得特定班級的考試資訊
   */
  getByClassName: async (className: string): Promise<ClassExamInfo> => {
    const response = await examApi.get(`/exams/classes/${encodeURIComponent(className)}`);
    return response.data.class;
  },
};

/**
 * 監考分配 API
 */
export const proctorAssignmentApi = {
  /**
   * 取得所有監考分配
   */
  getAll: async (): Promise<ProctorAssignment[]> => {
    const response = await examApi.get('/exams/proctors');
    return response.data.proctors;
  },

  /**
   * 新增監考分配
   */
  create: async (data: {
    class_exam_info_id: number;
    proctor_teacher: string;
    classroom: string;
    notes?: string;
  }): Promise<ProctorAssignment> => {
    const response = await examApi.post('/exams/proctors', data);
    return response.data.proctor;
  },

  /**
   * 更新監考分配
   */
  update: async (
    proctorId: number,
    data: {
      proctor_teacher?: string;
      classroom?: string;
      notes?: string;
    }
  ): Promise<ProctorAssignment> => {
    const response = await examApi.put(`/exams/proctors/${proctorId}`, data);
    return response.data.proctor;
  },

  /**
   * 刪除監考分配
   */
  delete: async (proctorId: number): Promise<void> => {
    await examApi.delete(`/exams/proctors/${proctorId}`);
  },

  /**
   * 批次新增/更新監考分配
   */
  batchCreateOrUpdate: async (
    assignments: Array<{
      class_exam_info_id: number;
      proctor_teacher: string;
      classroom: string;
      notes?: string;
    }>
  ): Promise<{
    created: number;
    updated: number;
    errors: string[];
  }> => {
    const response = await examApi.post('/exams/proctors/batch', { assignments });
    return {
      created: response.data.created,
      updated: response.data.updated,
      errors: response.data.errors,
    };
  },
};

/**
 * 統計資訊 API
 */
export const examStatsApi = {
  /**
   * 取得考試統計資訊
   */
  get: async (): Promise<ExamStats> => {
    const response = await examApi.get('/exams/stats');
    return {
      overall: response.data.overall,
      by_date: response.data.by_date,
    };
  },
};

/**
 * CSV 匯出 API
 */
export const examExportApi = {
  /**
   * 匯出所有班級考試資料為 CSV
   */
  exportAll: async (): Promise<Blob> => {
    const response = await examApi.get('/exams/export/csv', {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * 匯出特定 GradeBand 的考試資料為 CSV
   */
  exportGradeBand: async (gradeBand: string): Promise<Blob> => {
    const response = await examApi.get(`/exams/export/csv/${encodeURIComponent(gradeBand)}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * 下載 CSV 檔案
   */
  downloadCSV: (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },
};

// ============================================================
// Helper Functions
// ============================================================

/**
 * 格式化日期為顯示格式
 */
export const formatExamDate = (dateString: string): string => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const weekday = weekdays[date.getDay()];

  return `${month}/${day} (${weekday})`;
};

/**
 * 取得考試日期列表
 */
export const getExamDates = (): string[] => {
  return ['2025-11-04', '2025-11-05', '2025-11-06'];
};

/**
 * 取得 GradeBand 列表
 */
export const getGradeBands = (): string[] => {
  return [
    'G1 LT\'s',
    'G2 LT\'s',
    'G3 LT\'s',
    'G4 LT\'s',
    'G5 LT\'s',
    'G6 LT\'s',
    'G1 IT\'s',
    'G2 IT\'s',
    'G3 IT\'s',
    'G4 IT\'s',
    'G5 IT\'s',
    'G6 IT\'s',
  ];
};

export default examApi;
