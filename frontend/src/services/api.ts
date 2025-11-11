import axios from 'axios';
import type {
  Student,
  StudentSearchResponse,
  StudentTimetableResponse,
  Teacher,
  TeacherSearchResponse,
  TeacherTimetableResponse,
  ClassListResponse,
  ClassTimetableResponse,
  ApiResponse,
} from '../types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);

    let errorMessage = '網路連接錯誤，請檢查網路連接';

    if (error.code === 'ECONNABORTED') {
      errorMessage = '請求超時，請稍後再試';
    } else if (error.response) {
      console.error('Error Status:', error.response.status);
      console.error('Error Data:', error.response.data);

      switch (error.response.status) {
        case 404:
          errorMessage = '找不到請求的資源';
          break;
        case 500:
          errorMessage = '伺服器內部錯誤，請稍後再試';
          break;
        case 503:
          errorMessage = '服務暫時無法使用，請稍後再試';
          break;
        default:
          errorMessage = error.response.data?.message || `請求失敗 (${error.response.status})`;
      }
    } else if (error.request) {
      errorMessage = '無法連接到伺服器，請檢查網路連接';
    }

    // 創建包含友好錯誤訊息的錯誤對象
    const enhancedError = new Error(errorMessage);
    enhancedError.name = 'APIError';
    (enhancedError as Error & { originalError?: unknown }).originalError = error;

    return Promise.reject(enhancedError);
  }
);

// API service functions
export const apiService = {
  // Health check
  async healthCheck(): Promise<ApiResponse> {
    const response = await api.get('/health');
    return response.data;
  },

  // API info
  async getApiInfo(): Promise<ApiResponse> {
    const response = await api.get('/');
    return response.data;
  },

  // Student-related endpoints
  async getAllStudents(): Promise<Student[]> {
    const response = await api.get<StudentSearchResponse>('/students');
    return response.data.students;
  },

  async searchStudents(query: string): Promise<Student[]> {
    const response = await api.get<StudentSearchResponse>('/students/search', {
      params: { q: query },
    });
    return response.data.students;
  },

  async getStudentTimetable(studentId: string): Promise<StudentTimetableResponse> {
    const response = await api.get<StudentTimetableResponse>(`/students/${studentId}/timetable`);
    return response.data;
  },

  // Teacher-related endpoints
  async searchTeachers(query: string): Promise<Teacher[]> {
    const response = await api.get<TeacherSearchResponse>('/teachers/search', {
      params: { q: query },
    });
    return response.data.teachers;
  },

  async getTeacherTimetable(teacherName: string): Promise<TeacherTimetableResponse> {
    const response = await api.get<TeacherTimetableResponse>(`/teachers/${encodeURIComponent(teacherName)}/timetable`);
    return response.data;
  },

  // Class-related endpoints
  async getClasses(): Promise<string[]> {
    const response = await api.get<ClassListResponse>('/classes');
    return response.data.classes;
  },

  async getClassTimetable(className: string): Promise<ClassTimetableResponse> {
    const response = await api.get<ClassTimetableResponse>(`/timetable/${encodeURIComponent(className)}`);
    return response.data;
  },
};

export default api;