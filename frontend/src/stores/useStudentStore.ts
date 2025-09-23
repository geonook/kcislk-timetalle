import { create } from 'zustand';
import type { Student } from '../types';

interface StudentState {
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

export const useStudentStore = create<StudentState>((set) => ({
  selectedStudent: undefined,
  searchResults: [],
  searchQuery: '',
  isSearching: false,
  searchError: undefined,
  setSelectedStudent: (student) => set({ selectedStudent: student }),
  setSearchResults: (results) => set({ searchResults: results }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setIsSearching: (searching) => set({ isSearching: searching }),
  setSearchError: (error) => set({ searchError: error }),
  clearSearch: () =>
    set({
      searchResults: [],
      searchQuery: '',
      isSearching: false,
      searchError: undefined,
      selectedStudent: undefined,
    }),
}));