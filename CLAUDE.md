# CLAUDE.md - KCISLK 課表查詢系統

> **Documentation Version**: 5.4 (Multi-Environment Operations Guide)
> **Last Updated**: 2025-11-10
> **Project**: KCISLK 課表查詢系統 (v2.3.1 - Feature Flags Implementation)
> **Description**: 康橋國際學校林口校區小學部課表查詢系統，支援班級與學生課表查詢、期中考監考管理，並提供中英文雙語介面
> **Architecture**: React 19 SPA + Flask 3.1 API (fully decoupled)
> **Features**: KCISLK 自訂 Logo、英文瀏覽器標題、三種課表類型整合、英文班級純淨顯示、完整8堂課表顯示、智能搜尋、深色模式、完美響應式設計、z-index 層級系統、環境變數功能開關、完整多環境操作規範
> **Current Status**: ✅ 專案完全完成並優化 v2.3.1 - 所有功能已實現、期間限定功能開關機制完成、生產環境穩定運行、標準化 GitFlow 工作流程完成

This file provides essential guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 📝 **變更日誌**

### v5.4 (2025-11-10) - Multi-Environment Operations Guide
**新增完整的多環境操作規範：**
- ✅ 擴展 Git 分支策略（加入 feature/* 和 hotfix/* 分支詳細說明）
- ✅ 重寫標準開發工作流程（完整的 feature 分支開發流程）
- ✅ 新增緊急修復工作流程（hotfix 分支處理流程）
- ✅ 新增最佳實務章節（commit message、分支命名規範、代碼審查要求）
- ✅ 新增環境管理命令章節（分支管理、環境驗證、問題排除）
- ✅ 新增版本發布流程章節（準備發布、正式發布、發布後驗證）
- ✅ 新增重要注意事項章節（避免的操作、必須遵循的規則）

### v5.3 (2025-11-06) - Feature Flags Management
**功能開關系統完成：**
- 期中考監考功能環境變數控制
- 期間限定功能彈性開關機制

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
- ✅ 期中考監考管理（v2.3.0，支援環境變數控制顯示/隱藏）
- ✅ 智能搜尋功能（中英文姓名、學號、班級名稱，支援模糊匹配）
- ✅ 中英文雙語介面（React i18next 系統，即時語言切換）
- ✅ 響應式網頁設計（完美支援手機、平板、電腦各種螢幕）
- ✅ 深色模式支援（自動切換主題，支援系統偏好設定）
- ✅ KCISLK 自訂 Logo（採用康橋國際學校官方標誌設計）
- ✅ 英文瀏覽器標題（"KCISLK Timetable System" 專業化呈現）
- ✅ 三種課表類型統一顯示（色彩編碼，直觀易懂）
- ✅ 環境變數功能開關（Feature Flags，支援期間限定功能控制）
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

## 🌍 **多環境開發架構**

### 環境概覽

本專案採用多環境開發架構，提供生產、測試、開發三個獨立環境：

| 環境 | Git 分支 | 前端 URL | 後端 URL | 用途 | 成本 |
|------|----------|----------|----------|------|------|
| **Production** | main | https://kcislk-timetable.zeabur.app | https://kcislk-backend.zeabur.app | 正式生產環境 | 正常費用 |
| **Staging** | develop | https://frontend-develop.zeabur.app | https://kcislk-backend.zeabur.app | 測試環境（共享生產後端） | $0 (僅前端) |
| **Local** | develop | http://localhost:3000 | https://kcislk-backend.zeabur.app | 本機開發環境（共享生產後端） | $0 |

### 架構設計原則

**共享後端架構 (Shared Backend)**
- 所有環境共享同一個生產後端 API (https://kcislk-backend.zeabur.app)
- 保證資料一致性，避免資料孤島
- 節省成本，無需部署多個後端實例
- 簡化維護，單一資料庫管理

**前端多實例部署**
- Production Frontend: main 分支自動部署至 Zeabur
- Staging Frontend: develop 分支自動部署至 Zeabur
- Local Frontend: 本機開發，手動啟動 Vite 開發服務器

### Git 分支策略與環境對應

#### **三環境分支架構（標準 GitFlow）**

```
📦 三環境架構
├── 🖥️ Development (本地開發)
│   ├── 分支: feature/* (功能開發分支)
│   ├── 地址: http://localhost:3000 (前端) + http://localhost:8081 (後端)
│   ├── 用途: 日常開發與功能測試
│   └── 資料庫: 共享生產後端 (https://kcislk-backend.zeabur.app)
│
├── 🧪 Staging (測試環境)
│   ├── 分支: develop (整合測試分支)
│   ├── 地址: https://frontend-develop.zeabur.app
│   ├── 用途: 整合測試與預發布驗證
│   └── 資料庫: 共享生產後端 (https://kcislk-backend.zeabur.app)
│
└── 🌟 Production (生產環境)
    ├── 分支: main (穩定發布分支)
    ├── 地址: https://kcislk-timetable.zeabur.app
    ├── 用途: 正式營運服務
    └── 資料庫: https://kcislk-backend.zeabur.app
```

#### **分支使用規則**

- **main**: 僅存放生產就緒的穩定版本，所有合併需經過 Staging 測試驗證
- **develop**: 開發主線，所有功能整合與測試，自動部署至 Staging 環境
- **feature/***: 功能開發分支，從 develop 創建，完成後透過 PR 合併回 develop
- **hotfix/***: 緊急修復分支，從 main 創建，修復後同時合併回 main 和 develop

#### **環境隔離原則**

> **🛡️ 關鍵原則**: 每個環境使用不同的分支，確保完全隔離

- **Development**: 在 `feature/*` 分支開發，避免與其他環境程式碼衝突
- **Staging**: 只部署 `develop` 分支，確保整合測試的穩定性
- **Production**: 只部署 `main` 分支，您完全控制發布時機

#### **Production 控制機制**

> **🛡️ 關鍵原則**: Production 環境只有在您明確合併 develop 到 main 時才會更新

- Staging 環境會自動部署 develop 分支的所有變更
- Production 環境需要手動將 develop 合併到 main 才會更新
- 這確保您完全控制何時發布新功能到生產環境

### 🔄 **標準開發工作流程**

#### **日常功能開發（使用 feature 分支）**

```bash
# 1. 從 develop 創建 feature 分支
git checkout develop
git pull origin develop
git checkout -b feature/新功能描述

# 2. 在 feature 分支進行本地開發與測試
# 編輯 frontend/ 目錄下的檔案

# 啟動本地開發環境
cd frontend
npm run dev  # 前端：http://localhost:3000

# 如需測試後端（另一個終端）
cd timetable_api
PORT=8081 python run_server.py  # 後端：http://localhost:8081

# 3. 開發完成後提交到 feature 分支
git add .
git commit -m "feat: 新功能描述"
git push origin feature/新功能描述

# 4. 在 GitHub 創建 Pull Request：feature/新功能描述 → develop
# PR 合併後自動觸發 Staging 環境部署

# 5. 在 Staging 環境測試新功能
# URL: https://frontend-develop.zeabur.app
# 確保功能在接近生產的環境中正常運作

# 6. Staging 環境測試通過後，準備發布到 Production
# ⚠️ 手動控制：只有您決定何時更新 Production
git checkout main
git merge develop
git push origin main  # 觸發 Production 自動部署
```

#### **Production 控制機制**

> **🛡️ 關鍵原則**: Production 環境只有在您明確合併 develop 到 main 時才會更新

**自動化流程：**
- ✅ feature/* 分支推送：無自動部署
- ✅ develop 分支推送：自動部署到 Staging
- ✅ main 分支推送：自動部署到 Production

**手動控制點：**
- 只有您決定何時將 develop 合併到 main
- 這是唯一觸發 Production 部署的方式
- 確保您完全控制生產環境的更新時機

### 🚨 **緊急修復工作流程**

當 Production 環境出現需要緊急修復的嚴重問題時，使用 hotfix 分支：

```bash
# 1. 從 main 創建 hotfix 分支
git checkout main
git pull origin main
git checkout -b hotfix/緊急問題描述

# 2. 修復問題並在本地測試
# ... 修復緊急問題 ...
cd frontend
npm run dev  # 本地測試修復

# 3. 提交修復
git add .
git commit -m "fix: 緊急問題修復描述"

# 4. 同時合併到 main 和 develop
# 先合併到 main（觸發 Production 部署）
git checkout main
git merge hotfix/緊急問題描述
git push origin main

# 再合併到 develop（保持 develop 同步）
git checkout develop
git merge hotfix/緊急問題描述
git push origin develop

# 5. 刪除 hotfix 分支
git branch -d hotfix/緊急問題描述
git push origin --delete hotfix/緊急問題描述
```

**使用時機：**
- ✅ Production 環境出現嚴重錯誤
- ✅ 需要立即修復的安全漏洞
- ✅ 影響使用者體驗的關鍵問題

**注意事項：**
- ⚠️ hotfix 必須同時合併到 main 和 develop，避免版本不一致
- ⚠️ hotfix 應該只包含最小必要的修復，不應包含新功能
- ⚠️ 修復後立即部署並驗證 Production 環境

### ✅ **最佳實務**

#### **Commit Message 規範**

遵循語義化提交訊息格式，清楚描述變更類型：

```bash
# 功能新增
git commit -m "feat: 新增期中考監考管理功能"
git commit -m "feat: 新增學生課表查詢 API"

# 問題修復
git commit -m "fix: 修復 OAuth 重定向錯誤"
git commit -m "fix: 修正課表顯示時區問題"

# 效能改進
git commit -m "perf: 優化資料庫查詢效能"
git commit -m "perf: 減少前端打包體積"

# 文檔更新
git commit -m "docs: 更新部署指南"
git commit -m "docs: 新增多環境操作規範"

# 代碼重構
git commit -m "refactor: 重構認證中介軟體"
git commit -m "refactor: 簡化課表數據載入邏輯"

# 樣式調整
git commit -m "style: 調整響應式設計斷點"
git commit -m "style: 統一配色系統"

# 測試相關
git commit -m "test: 新增 API 整合測試"
git commit -m "test: 修復單元測試"

# 建置相關
git commit -m "build: 更新 Vite 配置"
git commit -m "build: 優化 Docker 建置流程"
```

#### **分支命名規範**

```bash
# Feature 分支（功能開發）
feature/homepage-management
feature/user-authentication
feature/parent-notification-system
feature/exam-proctor-assignment

# Hotfix 分支（緊急修復）
hotfix/oauth-callback-error
hotfix/database-connection-issue
hotfix/cors-configuration-fix

# Release 分支（如需要版本發布準備）
release/v2.4.0
release/v2.5.0-beta
```

#### **代碼審查要求**

- **main 分支合併**：所有合併到 main 的變更都需要經過代碼審查
- **develop 分支合併**：建議進行代碼審查，特別是重要功能
- **Staging 測試**：重要功能需要在 Staging 環境充分測試後才能發布到 Production
- **測試覆蓋**：新功能應包含適當的測試（單元測試、整合測試）

### 環境變數配置

#### Production Frontend (.env.production)
```bash
VITE_API_BASE_URL=https://kcislk-backend.zeabur.app/api
VITE_APP_NAME=KCISLK Timetable System
VITE_ENABLE_EXAM_PROCTOR=false
```

#### Staging Frontend (Zeabur 環境變數)
```bash
VITE_API_BASE_URL=https://kcislk-backend.zeabur.app/api
VITE_APP_NAME=KCISLK Timetable System (Staging)
VITE_ENABLE_EXAM_PROCTOR=true  # 測試環境啟用所有功能
```

#### Local Development (.env)
```bash
VITE_API_BASE_URL=https://kcislk-backend.zeabur.app/api
VITE_APP_NAME=KCISLK Timetable System (Dev)
VITE_ENABLE_EXAM_PROCTOR=true
```

### CORS 配置

後端 API 已配置允許所有環境的前端訪問：

```python
# timetable_api/src/main.py
allowed_origins = [
    # Local development
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    # Production
    'https://kcislk-timetable.zeabur.app',
    'https://kcislk-timetable-frontend.zeabur.app',
    'https://kcislk-backend.zeabur.app',
    # Staging
    'https://kcislk-timetable-staging.zeabur.app',
    'https://frontend-develop.zeabur.app',
]
```

### 🛠️ **環境管理命令**

#### **分支管理**

```bash
# 查看所有分支（本地與遠程）
git branch -a

# 查看分支差異
git log --oneline develop..main  # main 領先 develop 的提交
git log --oneline main..develop  # develop 領先 main 的提交

# 查看分支歷史圖
git log --graph --oneline --all --decorate

# 同步遠程分支
git fetch origin
git remote prune origin  # 清理已刪除的遠程分支

# 檢查未推送的提交
git log origin/develop..HEAD  # develop 分支未推送的提交
git log origin/main..HEAD     # main 分支未推送的提交

# 切換並更新分支
git checkout develop
git pull origin develop

# 強制同步分支（謹慎使用）
git checkout develop
git reset --hard origin/main   # 將 develop 重置為與 main 相同
git push origin develop --force-with-lease
```

#### **環境驗證**

```bash
# 檢查 Staging 環境健康狀態
curl https://frontend-develop.zeabur.app

# 檢查 Production 環境健康狀態
curl https://kcislk-timetable.zeabur.app

# 檢查後端 API 健康狀態
curl https://kcislk-backend.zeabur.app/health

# 驗證 API 端點
curl https://kcislk-backend.zeabur.app/api/classes
curl https://kcislk-backend.zeabur.app/api/students

# 檢查前端建置狀態
cd frontend
npm run build  # 確保建置成功
npm run typecheck  # TypeScript 類型檢查
npm run lint  # ESLint 檢查

# 檢查後端服務狀態
cd timetable_api
python run_server.py  # 本地測試後端
```

#### **問題排除**

```bash
# 查看詳細的分支歷史
git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit

# 檢查特定檔案的變更歷史
git log --follow -- frontend/src/components/Layout.tsx

# 比較兩個分支的特定檔案差異
git diff develop main -- frontend/package.json

# 找出導致問題的提交
git bisect start
git bisect bad  # 當前版本有問題
git bisect good <commit-hash>  # 已知正常的提交

# 撤銷最近的提交（保留變更）
git reset --soft HEAD~1

# 撤銷最近的提交（丟棄變更，謹慎使用）
git reset --hard HEAD~1

# 清理本地開發環境
cd frontend
rm -rf node_modules .next dist
npm install
npm run dev

# 清理 Python 虛擬環境
cd timetable_api
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Zeabur 部署配置

#### Frontend Staging 部署 (zeabur.json)
```json
{
  "name": "kcislk-timetable-frontend-staging",
  "build": {
    "rootDirectory": "frontend",
    "buildCommand": "npm install && npm run build:staging",
    "outputDirectory": "dist"
  },
  "deploy": {
    "framework": "vite",
    "installCommand": "npm install"
  },
  "environment": {
    "NODE_VERSION": "18"
  }
}
```

#### Backend 部署 (zeabur-backend.json)
```json
{
  "name": "kcislk-timetable-system",
  "app": {
    "type": "dockerfile",
    "dockerfile": "Dockerfile.backend"
  },
  "environment": {
    "PORT": "8080",
    "FLASK_ENV": "production",
    "DATABASE_PATH": "/app/data/app.db",
    "ALLOWED_ORIGINS": "https://kcislk-timetable.zeabur.app,https://kcislk-timetable-frontend.zeabur.app,https://kcislk-backend.zeabur.app"
  }
}
```

### 📈 **版本發布流程**

#### **準備發布**

在將 develop 合併到 main 並發布到 Production 之前，完成以下檢查：

**1. Staging 環境完整測試**
```bash
# 訪問 Staging 環境
# https://frontend-develop.zeabur.app

# 測試檢查清單：
- [ ] 所有新功能正常運作
- [ ] 期間限定功能（如期中考監考）顯示正確
- [ ] 中英文雙語切換正常
- [ ] 響應式設計（手機、平板、電腦）完美適配
- [ ] 深色模式切換正常
- [ ] 無 console 錯誤或警告
```

**2. 功能完整性檢查**
```bash
cd frontend

# TypeScript 類型檢查
npm run typecheck

# ESLint 代碼品質檢查
npm run lint

# 建置測試
npm run build:production

# 確保所有計劃功能都已完成
```

**3. 效能和安全驗證**
```bash
# 檢查建置大小
cd frontend/dist
du -sh *

# 檢查 CORS 配置
curl https://kcislk-backend.zeabur.app/health

# 驗證環境變數
# 確認 .env.production 設定正確
```

**4. 文檔更新**
```bash
# 更新 CLAUDE.md（如有架構變更）
# 更新 README.md（如有功能新增）
# 更新版本號和變更日誌
```

#### **正式發布**

確認所有準備工作完成後，執行發布流程：

```bash
# 1. 確保 develop 分支是最新的
git checkout develop
git pull origin develop

# 2. 切換到 main 分支並合併 develop
git checkout main
git pull origin main
git merge develop

# 3. 標籤版本（遵循語義化版本號）
git tag -a v2.4.0 -m "Release version 2.4.0 - 新功能描述"

# 4. 推送發布（觸發 Production 自動部署）
git push origin main
git push origin v2.4.0

# 5. 監控 Zeabur 部署進度
# 訪問 Zeabur 控制台查看部署狀態
# 確認 Production 環境正常啟動
```

**版本號規範（語義化版本）：**
- **Major (v3.0.0)**: 重大架構變更或破壞性更新
- **Minor (v2.4.0)**: 新功能新增（向下相容）
- **Patch (v2.3.2)**: 問題修復和小幅改進

#### **發布後驗證**

發布到 Production 後，立即進行驗證：

**1. 功能測試**
```bash
# 訪問 Production 環境
# https://kcislk-timetable.zeabur.app

# 驗證關鍵功能：
- [ ] 學生課表查詢正常
- [ ] 期中考監考管理（依功能開關狀態）
- [ ] 智能搜尋功能正常
- [ ] 中英文雙語切換正常
- [ ] 深色模式切換正常
```

**2. 效能監控**
```bash
# 檢查 Production API 回應時間
curl -w "@curl-format.txt" -o /dev/null -s https://kcislk-backend.zeabur.app/health

# 檢查前端載入速度
# 使用瀏覽器開發者工具 Network 標籤
```

**3. 錯誤監控**
```bash
# 檢查瀏覽器 console 是否有錯誤
# 訪問 https://kcislk-timetable.zeabur.app
# 開啟開發者工具 (F12) → Console 標籤

# 檢查後端 API 錯誤日誌
# 訪問 Zeabur 控制台 → Logs 查看後端日誌
```

**4. 使用者回饋**
- 通知相關使用者新版本已發布
- 收集使用者回饋和問題報告
- 準備快速修復計劃（如需要）

### 測試建議

#### Staging 環境測試
- 所有新功能先在 Staging 測試
- 測試期間限定功能（如期中考監考）
- 測試中英文雙語切換
- 測試響應式設計（手機、平板、電腦）
- 測試深色模式切換

#### 生產環境部署前檢查
- [ ] Staging 環境測試通過
- [ ] 無 console 錯誤或警告
- [ ] 功能開關正確配置
- [ ] CORS 配置無誤
- [ ] 環境變數正確設定
- [ ] TypeScript 類型檢查通過 (`npm run typecheck`)
- [ ] ESLint 檢查通過 (`npm run lint`)

### 🚨 **重要注意事項**

#### **避免的操作**

以下操作可能導致嚴重問題，應嚴格避免：

❌ **直接在 main 分支開發**
- 所有開發工作應在 feature/* 或 hotfix/* 分支進行
- main 分支應該只接受經過測試的 develop 分支合併
- 違反此規則可能導致未測試的代碼直接進入 Production

❌ **跳過 Staging 測試**
- 所有重要變更必須先在 Staging 環境驗證
- 直接推送到 main 分支可能導致 Production 環境故障
- Staging 測試是發現問題的最後防線

❌ **使用 --force push**
- 避免使用 `git push --force`，除非確實必要且經過團隊確認
- 如必須使用，請使用 `git push --force-with-lease` 較安全
- force push 可能覆蓋其他開發者的工作

❌ **合併未測試的代碼**
- 確保所有 feature 分支在本地充分測試後才推送
- PR 合併前應進行代碼審查
- 未測試的代碼可能引入難以追蹤的錯誤

❌ **忽略建置錯誤或警告**
- TypeScript 編譯錯誤必須修復
- ESLint 警告應該處理
- Console 錯誤和警告可能導致執行時問題

❌ **修改 develop 或 main 分支的歷史**
- 不要對已推送的 develop 或 main 分支進行 rebase
- 不要修改已發布的 git tags
- 歷史修改可能導致團隊協作混亂

#### **必須遵循的規則**

以下規則確保專案的穩定性和可維護性：

✅ **遵循 CLAUDE.md 規範**
- 每個完成的任務後立即提交（commit）
- 每次提交後推送到 GitHub 備份
- 使用適當的提交訊息格式（feat:, fix:, etc.）

✅ **推送到 GitHub 備份**
- 每次 commit 後執行 `git push origin <當前分支>`
- 確保遠程儲存庫始終是最新的
- GitHub 作為重要的程式碼備份

✅ **使用 TodoWrite 追蹤**
- 複雜任務（3+ 步驟）使用 todo 清單管理
- 標記任務狀態（pending, in_progress, completed）
- 確保所有任務都有追蹤記錄

✅ **驗證環境一致性**
- 確保三個環境（Local, Staging, Production）的功能同步
- 環境變數配置正確且一致
- CORS 配置涵蓋所有必要的域名

✅ **完整的測試流程**
- 本地開發：feature 分支開發與測試
- Staging：develop 分支整合測試
- Production：main 分支發布前最後確認

✅ **版本標籤管理**
- 每次 Production 發布都應該打上版本標籤
- 遵循語義化版本號規範（Major.Minor.Patch）
- 標籤訊息應清楚描述該版本的主要變更

✅ **文檔同步更新**
- 架構變更必須更新 CLAUDE.md
- 功能新增必須更新 README.md
- API 變更必須更新 API 文檔

✅ **代碼品質維護**
- 定期執行 `npm run typecheck` 和 `npm run lint`
- 修復所有 TypeScript 錯誤
- 處理所有 ESLint 警告

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

### 環境變數與功能開關

#### 環境變數檔案
```bash
frontend/
├── .env                # 開發環境變數
├── .env.production     # 生產環境變數
├── .env.staging        # 測試環境變數
└── .env.zeabur         # Zeabur 部署變數
```

#### 功能開關（Feature Flags）

**期中考監考功能控制** (v2.3.1 新增)

系統支援透過環境變數控制期間限定功能的顯示/隱藏：

```bash
# 開發環境 (.env) - 功能啟用
VITE_ENABLE_EXAM_PROCTOR=true

# 生產環境 (.env.production) - 功能關閉
VITE_ENABLE_EXAM_PROCTOR=false
```

**影響範圍：**
- ✅ 導航選單顯示/隱藏「期中考監考」連結
- ✅ 路由註冊/取消註冊 `/exam-proctor` 路徑
- ✅ 桌面版和手機版導航同步控制
- ✅ 關閉時訪問路由返回 404

**實作位置：**
- [Header.tsx](frontend/src/components/layout/Header.tsx:18-26) - 導航選單條件渲染
- [router/index.tsx](frontend/src/router/index.tsx:30-37) - 路由條件註冊

**期末考時重新啟用步驟：**
1. 修改 `frontend/.env.production` 中 `VITE_ENABLE_EXAM_PROCTOR=true`
2. 重新構建：`npm run build:production`
3. 部署至 Zeabur 或更新 Zeabur 環境變數

**Zeabur 部署環境變數設定：**
```bash
# Zeabur 控制台 → 專案設定 → 環境變數
VITE_ENABLE_EXAM_PROCTOR=false  # 預設關閉
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

> **✅ 專案完全完成並優化 v2.3.1** - 2025年11月6日
>
> 所有核心功能已實現、所有技術問題已解決、功能開關機制完成：
> - ✅ 完整的學生課表查詢系統（1,036+ 學生）
> - ✅ 三種課表類型整合顯示（英文班、Home Room、EV & myReading）
> - ✅ **期中考監考管理系統**（v2.3.0）- 12 個 GradeBand、168 筆考試資訊
> - ✅ **環境變數功能開關**（v2.3.1）- 期間限定功能彈性控制
> - ✅ **英文班級純淨顯示修復** - G1 Adventurers 等班級只顯示英文課程
> - ✅ **完整8堂課表顯示優化** - 所有班級顯示每日完整8個時段（8:25-16:05）
> - ✅ 中英文雙語支援（React i18next 深度整合）
> - ✅ KCISLK 自訂 Logo 與英文標題
> - ✅ 完美響應式設計（三階段標題系統）
> - ✅ 深色模式自動切換
> - ✅ 完整 z-index 層級系統（100% 解決覆蓋問題）
> - ✅ 手機版體驗優化（44px 觸控目標）
> - ✅ 空堂清晰標示（Free Period 含時間顯示）
> - ✅ Zeabur 生產環境穩定運行
> - ✅ 42 個 Homeroom 班級完整支援
>
> **系統狀態**: 生產環境穩定運行，零錯誤
> **使用者體驗**: 流暢、直觀、快速響應
> **技術債務**: 零技術債務，代碼整潔
> **維護狀態**: 系統完全自動化，支援期間限定功能彈性控制

---

**⚠️ Prevention is better than consolidation - build clean from the start.**
**🎯 Focus on single source of truth and extending existing functionality.**
**📈 Each task should maintain clean architecture and prevent technical debt.**

---

🎯 Template by Chang Ho Chien | HC AI 說人話channel | v1.0.0
📺 Tutorial: https://youtu.be/8Q1bRZaHH24

*專案完成並優化: 2025-11-06*
*文檔最後更新: 2025-11-10*
*文檔版本: 5.4 (Multi-Environment Operations Guide)*
*系統版本: v2.3.1*