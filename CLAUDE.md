# CLAUDE.md - KCISLK 課表查詢系統

> **Documentation Version**: 5.0 (Final)
> **Last Updated**: 2025-09-25
> **Project**: KCISLK 課表查詢系統 (FULLY COMPLETED)
> **Description**: 康橋國際學校林口校區小學部課表查詢系統，支援班級與學生課表查詢，並提供中英文雙語介面
> **Architecture**: React 19 SPA + Flask 3.1 API (fully decoupled)
> **Features**: KCISLK 自訂 Logo、英文瀏覽器標題、三種課表類型整合、智能搜尋、深色模式、完美響應式設計、z-index 層級系統
> **Current Status**: ✅ 專案完全完成 - 所有功能已實現、所有問題已解決、生產環境穩定運行

This file provides essential guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 CRITICAL RULES - READ FIRST

> **⚠️ RULE ADHERENCE SYSTEM ACTIVE ⚠️**
> **Claude Code must explicitly acknowledge these rules at task start**
> **These rules override all other instructions and must ALWAYS be followed:**

### 🔄 **RULE ACKNOWLEDGMENT REQUIRED**
> **Before starting ANY task, Claude Code must respond with:**
> "✅ CRITICAL RULES ACKNOWLEDGED - I will follow all prohibitions and requirements listed in CLAUDE.md"

### ❌ ABSOLUTE PROHIBITIONS
- **NEVER** create new files in root directory → use proper module structure
- **NEVER** write output files directly to root directory → use designated output folders
- **NEVER** create documentation files (.md) unless explicitly requested by user
- **NEVER** use git commands with -i flag (interactive mode not supported)
- **NEVER** use `find`, `grep`, `cat`, `head`, `tail`, `ls` commands → use Read, LS, Grep, Glob tools instead
- **NEVER** create duplicate files (manager_v2.py, enhanced_xyz.py, utils_new.js) → ALWAYS extend existing files
- **NEVER** create multiple implementations of same concept → single source of truth
- **NEVER** copy-paste code blocks → extract into shared utilities/functions
- **NEVER** hardcode values that should be configurable → use config files/environment variables
- **NEVER** use naming like enhanced_, improved_, new_, v2_ → extend original files instead

### 📝 MANDATORY REQUIREMENTS
- **COMMIT** after every completed task/phase - no exceptions
- **GITHUB BACKUP** - Push to GitHub after every commit to maintain backup: `git push origin main`
- **USE TASK AGENTS** for all long-running operations (>30 seconds) - Bash commands stop when context switches
- **TODOWRITE** for complex tasks (3+ steps) → parallel agents → git checkpoints → test validation
- **READ FILES FIRST** before editing - Edit/Write tools will fail if you didn't read the file first
- **DEBT PREVENTION** - Before creating new files, check for existing similar functionality to extend
- **SINGLE SOURCE OF TRUTH** - One authoritative implementation per feature/concept

### ⚡ EXECUTION PATTERNS
- **PARALLEL TASK AGENTS** - Launch multiple Task agents simultaneously for maximum efficiency
- **SYSTEMATIC WORKFLOW** - TodoWrite → Parallel agents → Git checkpoints → GitHub backup → Test validation
- **GITHUB BACKUP WORKFLOW** - After every commit: `git push origin main` to maintain GitHub backup
- **BACKGROUND PROCESSING** - ONLY Task agents can run true background operations

### 🔍 MANDATORY PRE-TASK COMPLIANCE CHECK
> **STOP: Before starting any task, Claude Code must explicitly verify ALL points:**

**Step 1: Rule Acknowledgment**
- [ ] ✅ I acknowledge all critical rules in CLAUDE.md and will follow them

**Step 2: Task Analysis**
- [ ] Will this create files in root? → If YES, use proper module structure instead
- [ ] Will this take >30 seconds? → If YES, use Task agents not Bash
- [ ] Is this 3+ steps? → If YES, use TodoWrite breakdown first
- [ ] Am I about to use grep/find/cat? → If YES, use proper tools instead

**Step 3: Technical Debt Prevention (MANDATORY SEARCH FIRST)**
- [ ] **SEARCH FIRST**: Use Grep pattern="<functionality>.*<keyword>" to find existing implementations
- [ ] **CHECK EXISTING**: Read any found files to understand current functionality
- [ ] Does similar functionality already exist? → If YES, extend existing code
- [ ] Am I creating a duplicate class/manager? → If YES, consolidate instead
- [ ] Will this create multiple sources of truth? → If YES, redesign approach
- [ ] Have I searched for existing implementations? → Use Grep/Glob tools first
- [ ] Can I extend existing code instead of creating new? → Prefer extension over creation
- [ ] Am I about to copy-paste code? → Extract to shared utility instead

**Step 4: Session Management**
- [ ] Is this a long/complex task? → If YES, plan context checkpoints
- [ ] Have I been working >1 hour? → If YES, consider /compact or session break

> **⚠️ DO NOT PROCEED until all checkboxes are explicitly verified**

## 🏗️ PROJECT OVERVIEW

### 🎯 **專案目標** (已完成)
建立一個現代化的課表查詢系統，所有目標功能已實現：
- ✅ 學生課表查詢（支援三種課表類型完整整合：English、Home Room、EV & myReading）
- ✅ 智能搜尋功能（中英文姓名、學號、班級名稱，支援模糊匹配）
- ✅ 中英文雙語介面（React i18next 系統，即時語言切換）
- ✅ 響應式網頁設計（完美支援手機、平板、電腦各種螢幕）
- ✅ 深色模式支援（自動切換主題，支援系統偏好設定）
- ✅ KCISLK 自訂 Logo（採用康橋國際學校官方標誌設計）
- ✅ 英文瀏覽器標題（"KCISLK Timetable System" 專業化呈現）
- ✅ 三種課表類型統一顯示（色彩編碼，直觀易懂）
- ✅ React 19 + TypeScript 現代化前端架構
- ✅ 完全解耦式架構（React SPA + Flask API）
- ✅ Zeabur 生產環境部署（高效能與穩定性）

### 📁 **專案結構**
```
kcislk-timetable/
├── frontend/                        # React 前端應用
│   ├── src/                         # React 源代碼
│   │   ├── components/              # React 組件
│   │   │   ├── layout/             # 布局組件
│   │   │   │   ├── Header.tsx      # 頂部導航
│   │   │   │   └── Layout.tsx      # 主布局
│   │   │   ├── timetable/          # 課表相關組件
│   │   │   │   └── TimetableGrid.tsx # 課表網格
│   │   │   └── ui/                 # 基礎 UI 組件
│   │   │       ├── LoadingSpinner.tsx # 載入指示器
│   │   │       ├── SearchBox.tsx   # 搜尋框
│   │   │       └── StudentCard.tsx # 學生卡片
│   │   ├── pages/                   # 頁面組件
│   │   │   ├── HomePage.tsx         # 首頁
│   │   │   ├── StudentPage.tsx      # 學生查詢頁
│   │   │   └── NotFoundPage.tsx     # 404 頁面
│   │   ├── stores/                  # Zustand 狀態管理
│   │   │   ├── useAppStore.ts       # 應用狀態
│   │   │   └── useStudentStore.ts   # 學生狀態
│   │   ├── services/                # API 服務
│   │   │   └── api.ts              # API 客戶端
│   │   ├── types/                   # TypeScript 類型定義
│   │   │   └── index.ts            # 主要類型
│   │   ├── i18n/                    # 國際化配置
│   │   │   └── config.ts           # i18n 配置
│   │   └── main.tsx                 # React 應用入口
│   ├── public/                      # 靜態資源
│   ├── package.json                 # Node.js 套件配置
│   ├── vite.config.ts               # Vite 構建配置
│   ├── tailwind.config.js           # Tailwind CSS 配置
│   ├── .env                         # 環境變數
│   ├── .env.production              # 生產環境變數
│   └── .env.staging                 # 測試環境變數
├── timetable_api/                   # Flask API 後端
│   ├── src/                         # Python 源代碼
│   │   ├── main.py                  # Flask API 應用
│   │   ├── data_loader.py           # 課表數據載入器
│   │   ├── data_loader_student.py   # 學生數據載入器
│   │   ├── models/                  # SQLAlchemy 資料模型
│   │   │   ├── student.py           # 學生模型
│   │   │   ├── timetable.py         # 課表模型
│   │   │   └── user.py              # 用戶模型
│   │   ├── routes/                  # Flask API 路由
│   │   │   ├── student.py           # 學生 API
│   │   │   ├── timetable.py         # 課表 API
│   │   │   └── user.py              # 用戶 API
│   │   └── database/                # SQLite 數據庫
│   │       └── app.db               # 應用數據庫
│   ├── data/                        # CSV 數據檔案
│   │   ├── english_timetable.csv    # 英文班課表數據
│   │   ├── homeroom_timetable.csv   # 導師班課表數據
│   │   ├── ev_myreading_timetable.csv # EV & myReading 課表數據
│   │   └── students.csv             # 學生基本資料
│   ├── requirements.txt             # Python 依賴套件
│   ├── run_server.py                # 服務器啟動腳本
│   └── venv/                        # Python 虛擬環境
├── scripts/                         # 部署腳本
│   ├── deploy-frontend.sh           # 前端部署腳本
│   ├── deploy-backend.sh            # 後端部署腳本
│   └── setup-production.sh          # 生產環境設置
├── configs/                         # 配置檔案
│   └── nginx/                       # Nginx 配置
│       ├── kcislk-timetable         # 生產配置
│       └── kcislk-timetable-dev     # 開發配置
├── docs/                            # 專案文檔
│   ├── api/                         # API 文檔
│   └── database/                    # 資料庫設計文檔
├── Dockerfile.frontend              # Frontend Docker 配置
├── Dockerfile.backend               # Backend Docker 配置
├── docker-compose.yml               # Docker Compose 配置
├── ecosystem.config.js              # PM2 進程管理配置
├── README.md                        # 專案說明
└── CLAUDE.md                        # 開發指南（本檔案）
```

### 🛠️ **技術棧**
#### 前端 (React SPA)
- **框架**: React 19 + TypeScript
- **構建工具**: Vite 7
- **路由**: React Router 7
- **狀態管理**: Zustand 5 + React Query (TanStack)
- **樣式**: Tailwind CSS 4
- **UI 組件**: Headless UI + Heroicons
- **國際化**: react-i18next

#### 後端 (Flask API)
- **語言**: Python 3.11
- **框架**: Flask + SQLAlchemy + Flask-CORS
- **資料庫**: SQLite (開發與生產)
- **API**: RESTful JSON API

#### 部署與運營
- **容器化**: Docker (多階段構建)
- **編排**: Docker Compose
- **進程管理**: PM2
- **反向代理**: Nginx
- **版本控制**: Git + GitHub 自動備份

### 🌐 **GitHub Repository**
- **URL**: https://github.com/geonook/kcislk-timetable.git
- **Auto-backup**: 每次 commit 後自動推送

## 📋 DEVELOPMENT GUIDELINES

### 🎯 **開發流程**
1. **需求分析** → 確認功能需求和技術規格
2. **設計** → 資料庫設計、API 設計、UI/UX 設計
3. **實作** → 按模組逐步開發，遵循單一職責原則
4. **測試** → 單元測試、整合測試、使用者測試
5. **部署** → 容器化部署、CI/CD 自動化

### 🔧 **編碼標準**
- **Python**: 遵循 PEP 8 規範
- **JavaScript**: 使用 ESLint + Prettier
- **命名規範**:
  - Python: snake_case
  - JavaScript: camelCase
  - 資料庫: snake_case
  - CSS 類別: kebab-case

### 📊 **系統數據統計**
- **學生總數**: 1,036+ 位學生完整資料
- **Homeroom 班級**: 42 個班級（6 年級 × 7 班）
- **英文班級**: 16 個班級
- **EV & myReading 班級**: 2 個班級
- **課表記錄**: 1,000+ 筆完整課表資料
- **支援年級**: 1-6 年級完整覆蓋

### 📊 **資料庫設計原則**
- 正規化至第三正規形式(3NF)
- 使用外鍵確保資料完整性
- 建立適當的索引提升查詢效能
- SQLite 高效能數據存儲

### 🌍 **國際化(i18n)支援**
- **實現方式**: react-i18next
- **功能特色**:
  - React 組件級別的國際化支援
  - 即時語言切換（無需重新載入頁面）
  - localStorage 持久化語言偏好
  - 支援命名空間和參數替換
  - 自動語言檢測
- **支援語言**: 繁體中文(zh-TW)、英文(en-US)
- **配置檔案**: `frontend/src/i18n/config.ts`

## 🌐 **生產環境資訊**

### 部署 URLs
- **前端應用**: https://kcislk-timetable.zeabur.app
- **後端 API**: https://kcislk-backend.zeabur.app
- **部署平台**: Zeabur Cloud Platform
- **更新方式**: GitHub 自動部署

### 技術規格
- **前端**: React 19 + TypeScript + Vite 7
- **後端**: Python 3.11 + Flask 3.1 + SQLAlchemy
- **資料庫**: SQLite (生產環境)
- **部署**: 容器化部署，自動擴展

## 🚀 COMMON COMMANDS

### 開發環境啟動

```bash
# 後端 API 啟動
cd kcislk-timetable/timetable_api
python -m venv venv                      # 建立虛擬環境（首次）
source venv/bin/activate                 # 啟用虛擬環境 (macOS/Linux)
pip install -r requirements.txt         # 安裝相依套件
PORT=8081 python run_server.py          # 啟動 API 服務器 (http://localhost:8081)

# 前端 React 應用啟動 (另一個終端)
cd kcislk-timetable/frontend
npm install                              # 安裝 Node.js 套件
npm run dev                              # 啟動前端開發服務器 (http://localhost:3000)
```

### 建置與部署

```bash
# 前端建置
cd frontend
npm run build                            # 開發建置
npm run build:production                 # 生產建置
npm run build:staging                    # 測試環境建置

# 類型檢查和代碼品質
npm run typecheck                        # TypeScript 類型檢查
npm run lint                             # ESLint 檢查
npm run lint:fix                         # 自動修復 ESLint 問題

# 部署腳本
./scripts/setup-production.sh           # 設置生產環境
./scripts/deploy-backend.sh             # 部署後端
./scripts/deploy-frontend.sh            # 部署前端

# Docker 容器化部署
docker-compose up -d                     # 啟動所有服務
docker-compose down                      # 停止所有服務
docker-compose logs -f                   # 查看日誌

# PM2 進程管理
pm2 start ecosystem.config.js           # 啟動後端服務
pm2 status                               # 查看服務狀態
pm2 logs kcislk-api                      # 查看服務日誌
pm2 restart kcislk-api                   # 重啟服務
```

### Git 版本控制

```bash
git add .                                # 暫存所有變更
git commit -m "描述"                     # 提交變更
git push origin main                     # 推送至 GitHub (自動備份)
```

## 🚨 TECHNICAL DEBT PREVENTION

### ❌ WRONG APPROACH (Creates Technical Debt):
```python
# 創建重複的路由處理器
# routes_v2.py, routes_enhanced.py, routes_new.py
```

### ✅ CORRECT APPROACH (Prevents Technical Debt):
```python
# 擴充現有路由模組
# 在 routes/timetable.py 中新增功能
```

## 🧹 DEBT PREVENTION WORKFLOW

### Before Creating ANY New File:
1. **🔍 Search First** - Use Grep/Glob to find existing implementations
2. **📋 Analyze Existing** - Read and understand current patterns
3. **🤔 Decision Tree**: Can extend existing? → DO IT | Must create new? → Document why
4. **✅ Follow Patterns** - Use established project patterns
5. **📈 Validate** - Ensure no duplication or technical debt

## 🎯 RULE COMPLIANCE CHECK

Before starting ANY task, verify:
- [ ] ✅ I acknowledge all critical rules above
- [ ] Files go in proper module structure (not root)
- [ ] Use Task agents for >30 second operations
- [ ] TodoWrite for 3+ step tasks
- [ ] Commit after each completed task
- [ ] Push to GitHub after each commit

## 🎉 **專案完成狀態**

> **✅ 專案完全完成** - 2025年9月25日
>
> 所有核心功能已實現、所有技術問題已解決：
> - ✅ 完整的學生課表查詢系統（1,036+ 學生）
> - ✅ 三種課表類型整合顯示（英文班、Home Room、EV & myReading）
> - ✅ 中英文雙語支援（React i18next 深度整合）
> - ✅ KCISLK 自訂 Logo 與英文標題
> - ✅ 完美響應式設計（三階段標題系統）
> - ✅ 深色模式自動切換
> - ✅ 完整 z-index 層級系統（100% 解決覆蓋問題）
> - ✅ 手機版體驗優化（44px 觸控目標）
> - ✅ Zeabur 生產環境穩定運行
> - ✅ 42 個 Homeroom 班級完整支援
>
> **系統狀態**: 生產環境穩定運行，零錯誤
> **使用者體驗**: 流暢、直觀、快速響應
> **技術債務**: 零技術債務，代碼整潔
> **維護狀態**: 系統完全自動化，可長期穩定運行

---

**⚠️ Prevention is better than consolidation - build clean from the start.**
**🎯 Focus on single source of truth and extending existing functionality.**
**📈 Each task should maintain clean architecture and prevent technical debt.**

---

🎯 Template by Chang Ho Chien | HC AI 說人話channel | v1.0.0
📺 Tutorial: https://youtu.be/8Q1bRZaHH24

*專案完成: 2025-09-25*
*文檔版本: 5.0 (Final)*