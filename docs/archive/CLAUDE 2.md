# CLAUDE.md - KCISLK 課表查詢系統

> **Documentation Version**: 1.0
> **Last Updated**: 2025-01-22
> **Project**: KCISLK 課表查詢系統
> **Description**: 康橋國際學校林口校區小學部課表查詢系統，支援班級與學生課表查詢，並提供中英文雙語介面
> **Features**: GitHub auto-backup, Task agents, technical debt prevention

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
- 班級課表查詢（週課表、日課表）
- 教師課表查詢
- 教室使用狀況查詢
- 中英文雙語介面
- 響應式網頁設計（支援手機、平板、電腦）

### 📁 **專案結構**
```
kcislk-timetable/
├── src/
│   ├── main/
│   │   ├── python/        # Flask 後端 API
│   │   │   ├── core/      # 核心業務邏輯
│   │   │   ├── models/    # SQLAlchemy 資料模型
│   │   │   ├── routes/    # API 路由定義
│   │   │   ├── services/  # 業務服務層
│   │   │   └── utils/     # 工具函數
│   │   ├── javascript/    # 前端應用
│   │   │   ├── components/# React/Vue 元件
│   │   │   ├── pages/     # 頁面元件
│   │   │   ├── services/  # API 呼叫服務
│   │   │   └── utils/     # 前端工具函數
│   │   └── resources/
│   │       ├── config/    # 設定檔案
│   │       └── assets/    # 靜態資源（圖片、字型等）
│   └── test/
│       ├── unit/          # 單元測試
│       └── integration/   # 整合測試
├── database/              # 資料庫相關
│   ├── schema.sql        # 資料庫架構
│   ├── migrations/       # 資料庫遷移檔案
│   └── seeds/           # 測試資料
├── docs/                 # 專案文檔
│   ├── api/             # API 文檔
│   ├── database/        # 資料庫設計文檔
│   └── user/            # 使用者手冊
└── output/              # 輸出檔案（報表、匯出資料等）
```

### 🛠️ **技術棧**
- **後端**: Python 3.11, Flask, SQLAlchemy
- **前端**: JavaScript/TypeScript, React/Vue, Tailwind CSS
- **資料庫**: SQLite (開發), PostgreSQL (生產)
- **部署**: Docker, GitHub Actions

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
- 前端使用 i18next 處理多語言
- 後端 API 回應包含語言代碼
- 資料庫儲存多語言內容
- 預設語言：繁體中文(zh-TW)、英文(en-US)

## 🚀 COMMON COMMANDS

```bash
# Python 虛擬環境
source timetable_api/venv/bin/activate  # 啟用虛擬環境
pip install -r requirements.txt         # 安裝相依套件

# 前端開發
npm install                              # 安裝 Node.js 套件
npm run dev                              # 開發模式
npm run build                            # 建置生產版本

# 資料庫
python manage.py db init                 # 初始化資料庫
python manage.py db migrate              # 建立遷移
python manage.py db upgrade              # 執行遷移

# 測試
pytest                                   # 執行所有測試
pytest src/test/unit/                   # 執行單元測試
pytest src/test/integration/            # 執行整合測試

# Git 與 GitHub
git add .                               # 暫存所有變更
git commit -m "描述"                    # 提交變更
git push origin main                    # 推送至 GitHub
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