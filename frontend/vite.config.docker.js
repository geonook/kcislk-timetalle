import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Docker 構建專用配置
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // 標準輸出目錄
    emptyOutDir: true,
  },
})