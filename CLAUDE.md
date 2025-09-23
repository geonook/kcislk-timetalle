# CLAUDE.md - KCISLK 課表查詢系統

> **Documentation Version**: 2.0
> **Last Updated**: 2025-01-23
> **Project**: KCISLK 課表查詢系統
> **Description**: 康橋國際學校林口校區小學部課表查詢系統，支援班級與學生課表查詢，並提供中英文雙語介面
> **Features**: GitHub auto-backup, Task agents, technical debt prevention, i18n system, production-ready deployment
> **Current Status**: 生產環境就緒，支援 Zeabur 部署，完整國際化系統

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

### 🎯 **專案目標**
建立一個完整的課表查詢系統，提供以下功能：
- ✅ 學生課表查詢（支援多課表類型整合）
- ✅ 智能搜尋功能（中英文姓名、學號）
- ✅ 中英文雙語介面（完整 i18n 系統）
- ✅ 響應式網頁設計（支援手機、平板、電腦）
- ✅ 深色模式支援
- ✅ 三種課表類型統一顯示（英文班、Home Room、EV & myReading）
- ✅ 生產環境部署就緒（Zeabur 雲端平台）

### 📁 **專案結構**
```
kcislk-timetable/
├── timetable_api/                    # 主要應用目錄
│   ├── src/                         # 源代碼
│   │   ├── main.py                  # Flask 主應用
│   │   ├── data_loader.py           # 課表數據載入器
│   │   ├── data_loader_student.py   # 學生數據載入器
│   │   ├── models/                  # SQLAlchemy 資料模型
│   │   │   ├── student.py           # 學生模型
│   │   │   ├── timetable.py         # 課表模型
│   │   │   └── user.py              # 用戶模型
│   │   ├── routes/                  # Flask API 路由
│   │   │   ├── student.py           # 學生相關路由
│   │   │   ├── timetable.py         # 課表相關路由
│   │   │   └── user.py              # 用戶相關路由
│   │   ├── static/                  # 靜態資源（生產就緒）
│   │   │   ├── css/                 # Tailwind CSS 生產版本
│   │   │   │   └── tailwind.min.css # 本地 CSS 檔案
│   │   │   ├── js/                  # JavaScript 模組
│   │   │   │   └── i18n.js          # 國際化系統
│   │   │   └── locales/             # 語言資源檔案
│   │   │       ├── zh-TW.json       # 繁體中文
│   │   │       └── en-US.json       # 英文
│   │   └── database/                # SQLite 數據庫
│   │       └── app.db               # 應用數據庫
│   ├── templates/                   # Jinja2 模板檔案
│   │   ├── base.html                # 基礎模板（支援 i18n）
│   │   ├── index.html               # 首頁模板
│   │   └── student.html             # 學生查詢頁面
│   ├── data/                        # CSV 數據檔案
│   │   ├── english_timetable.csv    # 英文班課表數據
│   │   ├── homeroom_timetable.csv   # 導師班課表數據
│   │   ├── ev_myreading_timetable.csv # EV & myReading 課表數據
│   │   └── students.csv             # 學生基本資料
│   ├── requirements.txt             # Python 依賴套件
│   ├── run_server.py                # 服務器啟動腳本
│   └── venv/                        # Python 虛擬環境
├── docs/                            # 專案文檔
│   ├── api/                         # API 文檔
│   └── database/                    # 資料庫設計文檔
├── database/                        # 資料庫設計相關
├── output/                          # 輸出檔案
├── Dockerfile                       # Docker 容器化設定
├── docker-compose.yml               # Docker Compose 設定
├── zeabur.json                      # Zeabur 部署設定
├── README.md                        # 專案說明
└── CLAUDE.md                        # 開發指南（本檔案）
```

### 🛠️ **技術棧**
- **後端**: Python 3.11, Flask, SQLAlchemy, Flask-CORS
- **前端**: Jinja2 模板 + Vanilla JavaScript + Tailwind CSS (本地生產版本)
- **國際化**: 自建 i18n 系統（JavaScript + JSON 語言檔案）
- **資料庫**: SQLite (開發與生產)
- **部署**: Docker + Zeabur 雲端平台
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

### 📊 **資料庫設計原則**
- 正規化至第三正規形式(3NF)
- 使用外鍵確保資料完整性
- 建立適當的索引提升查詢效能
- 預留擴充欄位供未來使用

### 🌍 **國際化(i18n)支援**
- **實現方式**: 自建 JavaScript i18n 系統
- **語言檔案**: JSON 格式，分別為 zh-TW.json 和 en-US.json
- **功能特色**:
  - 即時語言切換（無需重新載入頁面）
  - localStorage 持久化語言偏好
  - 支援佔位符替換（例如：{0}, {1}）
  - 自動更新頁面上所有 `[data-i18n]` 元素
- **支援語言**: 繁體中文(zh-TW)、英文(en-US)
- **檔案位置**: `timetable_api/src/static/locales/`

## 🚀 COMMON COMMANDS

```bash
# 進入專案目錄
cd kcislk-timetable/timetable_api

# Python 虛擬環境
python -m venv venv                      # 建立虛擬環境（首次）
source venv/bin/activate                 # 啟用虛擬環境 (macOS/Linux)
# 或 venv\Scripts\activate              # Windows
pip install -r requirements.txt         # 安裝相依套件

# 啟動應用程式
python run_server.py                    # 預設在 http://localhost:8080 啟動

# 指定埠號啟動
PORT=5000 python run_server.py          # 在指定埠號啟動

# 開發模式（自動重載）
export FLASK_ENV=development            # 設定開發模式
python run_server.py                    # 啟動開發服務器

# 資料庫操作（自動執行）
# 應用程式會自動檢查並初始化 SQLite 資料庫
# 自動載入 CSV 數據檔案到資料庫

# Git 與 GitHub 備份
git add .                               # 暫存所有變更
git commit -m "描述"                    # 提交變更
git push origin main                    # 推送至 GitHub

# Docker 部署
docker build -t kcislk-timetable .      # 建立 Docker 映像
docker run -p 8080:8080 kcislk-timetable # 運行容器

# Docker Compose
docker-compose up -d                    # 後台運行
docker-compose down                     # 停止服務
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

---

**⚠️ Prevention is better than consolidation - build clean from the start.**
**🎯 Focus on single source of truth and extending existing functionality.**
**📈 Each task should maintain clean architecture and prevent technical debt.**

---

🎯 Template by Chang Ho Chien | HC AI 說人話channel | v1.0.0
📺 Tutorial: https://youtu.be/8Q1bRZaHH24