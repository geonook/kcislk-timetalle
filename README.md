# KCISLK 課表查詢系統 🎓

康橋國際學校林口校區小學部課表查詢系統 - 現代化 React SPA + Flask API 架構

[![Version](https://img.shields.io/badge/version-2.2.0-success)](https://github.com/geonook/kcislk-timetable)
[![Status](https://img.shields.io/badge/status-production-green)](https://kcislk-timetable.zeabur.app)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev)
[![Python](https://img.shields.io/badge/Python-3.11-yellow)](https://python.org)

## 🌟 專案成就

- **📊 1,036+ 學生** - 完整學生資料庫支援
- **🏫 42 個班級** - 涵蓋 1-6 年級所有班級
- **🎯 3 種課表類型** - 英文班、導師班、EV & myReading 完美整合
- **📱 100% 響應式** - 手機、平板、電腦完美適配
- **🚀 零延遲載入** - 極速響應，流暢體驗
- **🌐 雙語支援** - 繁體中文/英文即時切換

## ✨ 核心功能

### 📚 學生課表查詢
- 支援三種課表類型統一顯示
- 色彩編碼直觀區分不同課程類型
- 智能整合多個課表資料來源
- **英文班級純淨顯示** - 英文班級課表只顯示英文課程，確保數據準確性
- **完整8堂課表顯示** - 所有班級課表始終顯示每日完整8個時段（8:25-16:05）

### 🔍 智能搜尋系統
- 中英文姓名即時搜尋
- 學號快速定位
- 班級名稱模糊匹配
- 即時篩選結果顯示

### 🌏 國際化支援
- React i18next 深度整合
- 即時語言切換無需重載
- 使用者偏好自動記憶
- 完整的 UI 文字本地化

### 🎨 使用者體驗
- **深色模式** - 自動偵測系統偏好
- **響應式設計** - 完美的手機版體驗
- **漸進式載入** - 優雅的載入動畫
- **無障礙設計** - WCAG 2.1 AA 標準

### 📱 手機版優化
- **三階段響應式標題** - 極小/中等/大螢幕自適應
- **完整 z-index 層級系統** - 解決所有覆蓋問題
- **44px 觸控目標** - 符合行動裝置最佳實踐
- **優化的間距系統** - 手機版更緊湊的布局

### ⏰ 課表顯示優化（最新 v2.2.0）
- **完整時段顯示** - 每日固定顯示完整8個時段
- **精確時間對應** - 每個時段顯示具體上課時間
- **空堂標示清晰** - 空堂明確標示為 "Free Period" 並顯示時間
- **統一顯示邏輯** - 英文班與Homeroom班級均顯示完整格式

## 🛠️ 技術架構

### 前端技術棧 (React SPA)
```
React 19 + TypeScript 5
├── Vite 7               # 極速開發與建置
├── React Router 7       # 客戶端路由
├── Zustand 5           # 狀態管理
├── React Query 5       # 資料獲取與快取
├── Tailwind CSS 4     # 原子化 CSS 框架
├── Headless UI 2      # 無障礙 UI 組件
├── React i18next 15   # 國際化框架
└── Axios 1.7          # HTTP 客戶端
```

### 後端技術棧 (Flask API)
```
Python 3.11 + Flask 3.1
├── SQLAlchemy 2.0     # ORM 資料庫映射
├── Flask-CORS 5.0     # 跨域資源共享
├── SQLite             # 輕量級資料庫
└── RESTful API        # 標準化 API 設計
```

### z-index 層級架構（已優化）
```css
/* 完整的層級系統確保正確的覆蓋順序 */
--z-content: 0;        /* 頁面內容 */
--z-header: 100000;    /* 頁首導航 */
--z-dropdown: 100001;  /* 下拉選單 */
--z-modal: 100002;     /* 彈出視窗 */
```

## 🚀 快速開始

### 環境需求
- Node.js 20+
- Python 3.11+
- npm 或 pnpm

### 本地開發

#### 1. Clone 專案
```bash
git clone https://github.com/geonook/kcislk-timetable.git
cd kcislk-timetable
```

#### 2. 啟動後端 API
```bash
cd timetable_api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
PORT=8081 python run_server.py
```

#### 3. 啟動前端開發伺服器
```bash
cd frontend
npm install
npm run dev
```

訪問 http://localhost:3000 即可看到應用程式

## 📦 生產環境部署

### 前端建置
```bash
cd frontend
npm run build:production
```

### Docker 部署
```bash
docker-compose up -d
```

## 🌐 線上演示

- **前端應用**: https://kcislk-timetable.zeabur.app
- **API 端點**: https://kcislk-backend.zeabur.app
- **GitHub**: https://github.com/geonook/kcislk-timetable

## 📊 資料統計

| 項目 | 數量 |
|------|------|
| 學生總數 | 1,036+ |
| Homeroom 班級 | 42 |
| 英文班級 | 16 |
| EV & myReading 班級 | 2 |
| 課表記錄 | 1,000+ |
| 支援年級 | 1-6 年級 |

## 🔄 最近更新

### v2.0.0 (2025-09-25) - 正式版發布
- ✅ 完全修復手機版 z-index 層級問題
- ✅ 實現三階段響應式標題系統
- ✅ 優化手機版使用者體驗
- ✅ 統一 z-index 層級架構
- ✅ 所有功能完整測試通過

### v1.5.0 (2025-09-24)
- ✅ KCISLK 自訂 Logo 整合
- ✅ 英文瀏覽器標題
- ✅ 首次生產環境部署

### v1.0.0 (2025-09-23)
- ✅ 專案初始化
- ✅ 基礎功能開發
- ✅ 資料庫設計實現

## 📝 授權

本專案為康橋國際學校林口校區專屬開發

## 🙏 致謝

- 康橋國際學校林口校區 - 專案需求與支援
- Zeabur 平台 - 提供穩定的雲端部署服務
- React 社群 - 優秀的開源框架與生態系

---

**專案狀態**: ✅ 完全完成 | **最後更新**: 2025-09-25 | **版本**: 2.0.0