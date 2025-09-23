# KCISLK 課表查詢系統

康橋國際學校林口校區小學部課表查詢系統 - 現代化 React SPA + Flask API 架構

## 🚀 特色功能

- **✅ 學生課表查詢** - 支援三種課表類型整合顯示（英文班級、Home Room、EV & myReading）
- **✅ 智能搜尋** - 中英文姓名、學號即時搜尋，模糊匹配
- **✅ 中英文雙語支援** - React i18next 國際化系統，即時語言切換
- **✅ 響應式設計** - 完美支援手機、平板、電腦各種螢幕尺寸
- **✅ 深色模式** - 自動切換主題，保護用戶視力
- **✅ 現代化 SPA 架構** - React 19 + TypeScript + Vite，快速載入與流暢體驗
- **✅ 生產環境就緒** - Zeabur 雲端部署，高效能與穩定性
- **✅ 色彩編碼課表** - 三種課表類型以不同顏色區分，直觀易懂

## 🛠️ 技術架構

### 前端 (React SPA)
- **框架**: React 19 + TypeScript
- **建置工具**: Vite 7 (快速開發與建置)
- **狀態管理**: Zustand + React Query (TanStack Query)
- **國際化**: React i18next + i18next-browser-languagedetector
- **UI 框架**: Tailwind CSS + Headless UI
- **路由**: React Router DOM 7
- **HTTP 客戶端**: Axios

### 後端 (Flask API)
- **框架**: Python 3.11 + Flask + SQLAlchemy
- **跨域支援**: Flask-CORS
- **資料庫**: SQLite（開發與生產環境）
- **API 設計**: RESTful API 架構

### 部署與開發
- **前端部署**: Zeabur 雲端平台 (靜態網站)
- **後端部署**: Docker + 雲端容器
- **開發環境**: Vite 開發伺服器 + Flask API 伺服器
- **版本控制**: Git + GitHub 自動備份

## 📦 快速啟動

### 本地開發

#### 1. 啟動後端 API 服務

```bash
# 進入後端目錄
cd kcislk-timetable/timetable_api

# 建立虛擬環境
python -m venv venv
source venv/bin/activate  # macOS/Linux
# 或 venv\Scripts\activate  # Windows

# 安裝依賴
pip install -r requirements.txt

# 啟動 Flask API 服務
python run_server.py
# 後端服務運行於 http://localhost:5000
```

#### 2. 啟動前端開發服務

```bash
# 開新終端機視窗，進入前端目錄
cd kcislk-timetable/frontend

# 安裝 Node.js 依賴 (需要 Node.js >= 20)
npm install

# 啟動前端開發服務
npm run dev
# 前端服務運行於 http://localhost:3000
# Vite 會自動代理 API 請求到 http://localhost:5010
```

#### 3. 訪問應用
- **前端應用**: http://localhost:3000
- **後端 API**: http://localhost:5000/api

### 生產環境部署

#### 前端部署 (Zeabur)

```bash
# 建置生產版本
cd frontend
npm run build:zeabur

# 建置後的檔案位於 frontend/dist/
# 可上傳至 Zeabur 或其他靜態網站託管服務
```

#### 後端部署 (Docker)

```bash
# 進入後端目錄
cd timetable_api

# 建構 Docker 映像檔
docker build -t kcislk-timetable-api .

# 運行容器
docker run -p 5000:5000 kcislk-timetable-api
```

### Docker Compose (完整部署)

```bash
# 在專案根目錄執行
docker-compose up -d
```

## 🌐 應用端點

### 前端頁面
- **首頁**: http://localhost:3000/
- **學生課表查詢**: http://localhost:3000/student （主要功能）

### API 端點
- **學生搜尋**: `GET /api/students/search?q={query}`
- **學生課表**: `GET /api/students/{student_id}/timetable`
- **課表資料**: `GET /api/timetables`
- **健康檢查**: `GET /api/health`

## 📁 專案結構

```
kcislk-timetable/
├── frontend/                        # React 前端應用
│   ├── src/
│   │   ├── components/              # React 共用元件
│   │   ├── pages/                   # 頁面元件
│   │   ├── services/                # API 呼叫服務
│   │   ├── hooks/                   # 自訂 React hooks
│   │   ├── i18n/                    # 國際化設定
│   │   ├── locales/                 # 語言資源檔案
│   │   ├── router/                  # 路由設定
│   │   ├── App.tsx                  # 主應用元件
│   │   └── main.tsx                 # 應用入口點
│   ├── public/                      # 靜態資源
│   ├── package.json                 # Node.js 依賴與腳本
│   ├── vite.config.ts              # Vite 設定檔
│   ├── tsconfig.json               # TypeScript 設定
│   └── tailwind.config.js          # Tailwind CSS 設定
├── timetable_api/                   # Flask 後端 API
│   ├── src/
│   │   ├── main.py                  # Flask 主應用
│   │   ├── models/                  # SQLAlchemy 資料模型
│   │   ├── routes/                  # API 路由定義
│   │   └── utils/                   # 工具函數
│   ├── requirements.txt             # Python 依賴
│   ├── run_server.py               # 啟動腳本
│   ├── Dockerfile                  # Docker 配置
│   └── instance/                   # 運行時實例檔案
│       └── database.db             # SQLite 資料庫
├── docs/                           # 專案文檔
├── CLAUDE.md                       # 開發指南
├── README.md                       # 專案說明
└── docker-compose.yml             # Docker Compose 設定
```

## 📚 API 文檔

### RESTful API 端點

- `GET /api/students/search?q={query}` - 學生搜尋（支援中英文姓名、學號）
- `GET /api/students/{student_id}/timetable` - 取得學生完整課表
- `GET /api/timetables` - 取得所有課表資料
- `GET /api/health` - API 健康檢查

### 前端路由

- `/` - 首頁（課表查詢入口）
- `/student` - 學生課表查詢頁面（主要功能）
- `/about` - 關於頁面
- `/404` - 404 錯誤頁面

## 🛠️ 開發指南

開發前請先閱讀 [CLAUDE.md](CLAUDE.md) 了解專案開發規範與架構設計原則。

### 技術棧詳情

#### 前端技術
- **React 19**: 最新版本，支援 Concurrent Features
- **TypeScript**: 強型別支援，提升開發效率
- **Vite 7**: 極速開發體驗與建置
- **Zustand**: 輕量級狀態管理
- **React Query**: 強大的伺服器狀態管理
- **React i18next**: 完整國際化解決方案
- **Tailwind CSS**: 實用優先的 CSS 框架
- **Headless UI**: 無樣式可存取元件庫

#### 後端技術
- **Flask**: 輕量級 Python Web 框架
- **SQLAlchemy**: Python SQL 工具包和 ORM
- **Flask-CORS**: 跨域資源共享支援

### 開發流程

#### 前端開發
```bash
cd frontend

# 安裝依賴
npm install

# 開發模式
npm run dev

# 型別檢查
npm run typecheck

# 程式碼檢查與修復
npm run lint:fix

# 建置生產版本
npm run build:production
```

#### 後端開發
```bash
cd timetable_api

# 啟用虛擬環境
source venv/bin/activate

# 安裝依賴
pip install -r requirements.txt

# 啟動開發伺服器
python run_server.py

# 執行測試（如有設定）
python -m pytest
```

## 📄 授權

本專案屬於康橋國際學校林口校區所有。

## 🤝 貢獻

請遵循專案的 [貢獻指南](docs/CONTRIBUTING.md) 進行開發。

## 📞 聯絡方式

如有問題或建議，請聯絡專案維護者。

---

🎯 Template by Chang Ho Chien | HC AI 說人話channel | v1.0.0
📺 Tutorial: https://youtu.be/8Q1bRZaHH24