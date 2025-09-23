import axios from 'axios';
import type {
  Student,
  StudentSearchResponse,
  StudentTimetableResponse,
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
    if (error.response) {
      console.error('Error Status:', error.response.status);
      console.error('Error Data:', error.response.data);
    }
    return Promise.reject(error);
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
  async searchStudents(query: string): Promise<Student[]> {
    const response = await api.get<StudentSearchResponse>('/students/search', {
      params: { query },
    });
    return response.data.students;
  },

  async getStudentTimetable(studentId: string): Promise<StudentTimetableResponse> {
    const response = await api.get<StudentTimetableResponse>(`/students/${studentId}/timetable`);
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