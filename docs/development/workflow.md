# KCISLK 課表系統 - 開發流程最佳實踐

> **文檔版本**: 1.0.0
> **最後更新**: 2025-11-12
> **適用專案版本**: v2.4.0+

## 📋 目錄

- [核心原則](#核心原則)
- [標準開發流程](#標準開發流程)
- [分支策略](#分支策略)
- [Commit 規範](#commit-規範)
- [部署架構](#部署架構)
- [開發檢查清單](#開發檢查清單)
- [常見問題與解決方案](#常見問題與解決方案)

---

## 🎯 核心原則

### Backend First, Frontend Second

**黃金法則**：後端 API 必須先開發、測試、部署完成後，才開始前端開發。

#### 為什麼？

1. **避免介面不匹配**：前端開發時 API 已就緒，避免格式錯誤
2. **提早發現問題**：後端問題在開發初期就能發現和修復
3. **並行開發**：後端穩定後，多個前端功能可以並行開發
4. **測試效率**：前端開發時可以直接測試實際 API，不需要 mock

#### 實際案例

**❌ 錯誤順序（會出問題）**
```
Day 1: 開發前端教師查詢頁面
Day 2: 推送到 staging，發現 API 回傳格式錯誤
Day 3: 修復後端 API
Day 4: 但後端在不同分支，staging 仍然無法使用
Day 5: 緊急處理分支同步問題
```

**✅ 正確順序（順暢開發）**
```
Day 1: 開發並測試後端 /teachers API
Day 2: 部署後端到 production，驗證 API 可用
Day 3: 開發前端教師查詢頁面（使用已就緒的 API）
Day 4: 推送到 staging，完整功能測試
Day 5: 測試通過，部署到 production
```

---

## 🔄 標準開發流程

### 階段 1：需求分析與設計

#### 1.1 確認功能需求
```markdown
**功能名稱**: 教師課表查詢

**使用者故事**:
作為教師，我希望能查詢我的個人課表，以便了解每週的教學安排。

**需求清單**:
- [ ] 搜尋教師功能
- [ ] 顯示教師課表（週檢視）
- [ ] 列印課表功能
- [ ] 支援多種課表類型（English, Home Room, EV）
```

#### 1.2 設計 API 介面
```json
// API 設計文件
{
  "endpoint": "GET /api/teachers",
  "description": "取得所有教師列表",
  "response": {
    "success": true,
    "teachers": [
      {
        "id": 1,
        "teacher_name": "何真瑾 Evelyn"
      }
    ]
  }
}
```

#### 1.3 設計資料模型
```python
# models/timetable.py
class Teacher(db.Model):
    __tablename__ = 'teachers'

    id = db.Column(db.Integer, primary_key=True)
    teacher_name = db.Column(db.String(100), unique=True, nullable=False)
```

### 階段 2：後端開發

#### 2.1 建立 Feature Branch（推薦）
```bash
# 從 develop 建立功能分支
git checkout develop
git pull origin develop
git checkout -b feature/teacher-query

# 或直接在 develop 開發（小功能）
git checkout develop
```

#### 2.2 開發後端 API
```bash
# 1. 建立或修改 Model
vim timetable_api/src/models/timetable.py

# 2. 建立或修改 Route
vim timetable_api/src/routes/teacher.py

# 3. 本地測試
cd timetable_api
PORT=8081 python3 run_server.py

# 4. 測試 API（另一個終端）
curl http://localhost:8081/api/teachers | python3 -m json.tool
```

#### 2.3 驗證 API 回應格式
```bash
# 確認回應格式符合設計文件
curl -s http://localhost:8081/api/teachers | jq '.teachers[0]'

# 預期輸出：
# {
#   "id": 1,
#   "teacher_name": "何真瑾 Evelyn"
# }
```

#### 2.4 提交後端變更
```bash
# 只提交後端檔案
git add timetable_api/
git commit -m "feat(backend): 新增教師查詢 API

- 新增 GET /api/teachers 端點
- 回傳完整教師物件（id + teacher_name）
- 支援教師姓名搜尋功能"

# 推送到對應分支
git push origin feature/teacher-query
# 或
git push origin develop
```

### 階段 3：後端部署與驗證

#### 3.1 部署到 Production Backend

**重要 ⚠️**：後端修復或新功能應優先部署到 main 分支

```bash
# 方案 A：直接合併到 main（小功能/bug 修復）
git checkout main
git merge feature/teacher-query
git push origin main

# 方案 B：Cherry-pick 到 main（從 develop 挑選）
git checkout main
git cherry-pick <commit-hash>
git push origin main
```

#### 3.2 等待 Zeabur 自動部署

```bash
# 檢查 Zeabur Backend 部署狀態
# 登入 https://dash.zeabur.com
# 查看 Backend Service 的部署日誌

# 通常需要 2-3 分鐘完成建置和部署
```

#### 3.3 驗證線上 API

```bash
# 測試 Production Backend API
curl https://kcislk-backend.zeabur.app/api/teachers | python3 -m json.tool

# 確認回應格式正確
curl -s https://kcislk-backend.zeabur.app/api/teachers | jq '.teachers[0]'

# 如果格式錯誤，立即回滾或修復
```

**檢查點 ✅**：
- [ ] Backend API 已部署到 production
- [ ] API 端點可正常訪問
- [ ] 回應格式符合設計文件
- [ ] 錯誤處理正常運作

### 階段 4：前端開發

**前提條件 ⚠️**：後端 API 必須已部署並驗證可用

#### 4.1 開發前端功能
```bash
# 確認在 develop 分支
git checkout develop

# 開發前端組件
vim frontend/src/pages/TeacherPage.tsx
vim frontend/src/components/ui/TeacherCard.tsx

# 本地開發環境測試（連接 production backend）
cd frontend
npm run dev

# 開啟 http://localhost:3000/teachers 測試功能
```

#### 4.2 驗證 API 整合
```javascript
// 在瀏覽器開發者工具中驗證
// Network 面板應該顯示：
// Request: GET https://kcislk-backend.zeabur.app/api/teachers
// Response: {"success": true, "teachers": [...]}
```

#### 4.3 提交前端變更
```bash
# 只提交前端檔案
git add frontend/
git commit -m "feat(frontend): 新增教師查詢頁面

- 新增 TeacherPage 組件
- 整合 /api/teachers API
- 支援即時搜尋過濾
- 新增教師卡片組件"

# 推送到 develop
git push origin develop
```

### 階段 5：Staging 測試

#### 5.1 自動部署到 Staging
```bash
# develop 分支推送後，Zeabur 自動部署到 staging
# Frontend: https://kcislk-timetable-develop.zeabur.app
# Backend: https://kcislk-backend.zeabur.app (main 分支)
```

#### 5.2 完整功能測試

**測試清單**：
- [ ] 頁面載入正常
- [ ] 教師列表顯示完整（66 位教師）
- [ ] 搜尋功能正常（即時過濾）
- [ ] 點擊教師能查看課表
- [ ] 錯誤處理正常（無效搜尋、網路錯誤）
- [ ] 響應式設計（手機、平板、電腦）
- [ ] 深色模式切換正常
- [ ] 瀏覽器相容性（Chrome, Safari, Firefox）

#### 5.3 效能測試

```bash
# 使用 Chrome DevTools Lighthouse
# 檢查以下指標：
# - Performance > 90
# - Accessibility > 90
# - Best Practices > 90
# - SEO > 90
```

### 階段 6：Production 部署

#### 6.1 測試通過後合併到 main
```bash
# 確認 staging 測試完全通過
git checkout main
git pull origin main
git merge develop

# 解決衝突（如果有）
# 最終測試
git push origin main
```

#### 6.2 驗證 Production 部署
```bash
# 等待 Zeabur 自動部署
# Frontend: https://kcislk-timetable.zeabur.app
# Backend: https://kcislk-backend.zeabur.app

# 快速煙霧測試
curl https://kcislk-timetable.zeabur.app
curl https://kcislk-backend.zeabur.app/api/health
```

#### 6.3 監控與回滾準備
```bash
# 監控錯誤日誌（Zeabur Console）
# 準備回滾方案（保留上一個穩定版本的 commit hash）

# 如果發現問題，立即回滾
git checkout main
git revert <problematic-commit>
git push origin main
```

---

## 🌿 分支策略

### 當前架構：雙分支模式

```
main (production)
  └── develop (staging)
```

### 分支說明

| 分支 | 用途 | 部署環境 | 穩定性 |
|------|------|----------|--------|
| `main` | 生產環境 | Frontend Production + Backend Production | 高（必須穩定） |
| `develop` | 測試環境 | Frontend Staging + Backend Production | 中（允許測試新功能） |

### 推薦：Feature Branch 模式

```
main (production)
  └── develop (staging)
       ├── feature/teacher-query
       ├── feature/print-timetable
       └── bugfix/api-format
```

#### 使用時機

**Feature Branch 適用於**：
- 大型功能開發（預計 > 1 天）
- 需要多次 commit 的功能
- 多人協作開發
- 實驗性功能

**直接在 develop 開發適用於**：
- 小型 bug 修復
- 單一 commit 可完成的功能
- 緊急熱修復（hotfix）

#### Feature Branch 工作流程

```bash
# 1. 建立 feature 分支
git checkout develop
git pull origin develop
git checkout -b feature/teacher-query

# 2. 開發功能（可多次 commit）
git add .
git commit -m "feat(backend): 教師 API"
git add .
git commit -m "feat(frontend): 教師頁面"

# 3. 合併回 develop
git checkout develop
git merge feature/teacher-query
git push origin develop

# 4. 刪除 feature 分支（可選）
git branch -d feature/teacher-query
```

---

## 📝 Commit 規範

### Commit Message 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 類型

| Type | 說明 | 範例 |
|------|------|------|
| `feat` | 新功能 | `feat(frontend): 新增教師查詢頁面` |
| `fix` | Bug 修復 | `fix(backend): 修復重複路由問題` |
| `docs` | 文檔更新 | `docs: 更新開發流程文檔` |
| `style` | 格式調整 | `style: 統一程式碼縮排` |
| `refactor` | 重構 | `refactor(frontend): 提取共用組件` |
| `test` | 測試 | `test: 新增 API 單元測試` |
| `chore` | 維護 | `chore: 更新依賴套件` |

### Scope 範圍

| Scope | 說明 |
|-------|------|
| `backend` | 後端相關（API, Model, Route） |
| `frontend` | 前端相關（Component, Page, Style） |
| `database` | 資料庫相關（Schema, Migration） |
| `deploy` | 部署相關（Docker, Config） |
| `docs` | 文檔相關 |

### 範例

```bash
# 後端新功能
git commit -m "feat(backend): 新增教師查詢 API

- 新增 GET /api/teachers 端點
- 支援姓名搜尋過濾
- 回傳完整教師物件格式"

# 前端新功能
git commit -m "feat(frontend): 新增教師課表查詢頁面

- 新增 TeacherPage 組件
- 整合 API 呼叫與錯誤處理
- 支援即時搜尋功能
- 響應式設計適配"

# Bug 修復
git commit -m "fix(backend): 刪除重複的 /teachers 路由

修復 API 回傳格式錯誤問題：
- 刪除 timetable.py 中的重複路由
- 保留 teacher.py 的正確實作
- 確保回傳物件陣列而非字串陣列"
```

---

## 🏗️ 部署架構

### Zeabur 部署配置

```
┌─────────────────────────────────────────────────┐
│ GitHub Repository                                │
│                                                   │
│ ┌──────────────┐      ┌─────────────────────┐  │
│ │ main branch  │─────→│ Backend Service     │  │
│ │              │      │ (Production)        │  │
│ └──────────────┘      │ Port: 5000 (dynamic)│  │
│                        └─────────────────────┘  │
│                                                   │
│ ┌──────────────┐      ┌─────────────────────┐  │
│ │ main branch  │─────→│ Frontend Production │  │
│ │              │      │ (Static Vite Host)  │  │
│ └──────────────┘      └─────────────────────┘  │
│                                                   │
│ ┌──────────────┐      ┌─────────────────────┐  │
│ │develop branch│─────→│ Frontend Staging    │  │
│ │              │      │ (Static Vite Host)  │  │
│ └──────────────┘      └─────────────────────┘  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Deployment URLs                                  │
│                                                   │
│ Backend (main):                                  │
│   https://kcislk-backend.zeabur.app             │
│                                                   │
│ Frontend Production (main):                      │
│   https://kcislk-timetable.zeabur.app           │
│                                                   │
│ Frontend Staging (develop):                      │
│   https://kcislk-timetable-develop.zeabur.app   │
└─────────────────────────────────────────────────┘
```

### 重要配置說明

#### Backend 配置

- **監聽分支**: `main` only
- **部署方式**: Docker (Dockerfile.backend.docker)
- **環境變數**:
  - `PORT`: Zeabur 自動分配
  - `FLASK_ENV`: production
  - `DATABASE_PATH`: /app/database/app.db

#### Frontend 配置

- **Production 監聽**: `main` branch
- **Staging 監聽**: `develop` branch
- **部署方式**: Vite Static Hosting (zeabur.json)
- **環境變數**:
  - `VITE_API_BASE_URL`: https://kcislk-backend.zeabur.app/api
  - `NODE_VERSION`: 20
  - `VITE_ENABLE_EXAM_PROCTOR`: true/false

### CORS 配置

```python
# timetable_api/src/main.py
allowed_origins = [
    'http://localhost:3000',                           # 本地開發
    'https://kcislk-timetable.zeabur.app',            # Production
    'https://kcislk-timetable-develop.zeabur.app',    # Staging
]
```

**新增 Frontend 域名時必須更新此清單！**

---

## ✅ 開發檢查清單

### Backend 開發檢查清單

#### 開發前
- [ ] API 介面設計文件已完成
- [ ] 資料模型設計已確認
- [ ] 了解預期的 Request/Response 格式

#### 開發中
- [ ] Model 定義完整（欄位、型別、約束）
- [ ] Route 實作正確（端點、方法、參數）
- [ ] 錯誤處理完整（try-except, 400/404/500）
- [ ] 回傳格式符合設計文件

#### 測試
- [ ] 本地測試通過（curl 測試成功）
- [ ] 回應格式驗證（使用 `jq` 檢查）
- [ ] 錯誤情境測試（無效參數、資料庫錯誤）
- [ ] 效能測試（回應時間 < 500ms）

#### 部署前
- [ ] Commit message 符合規範
- [ ] 只包含相關檔案（不包含前端）
- [ ] 推送到正確分支（main 或 develop）

#### 部署後
- [ ] Zeabur 建置成功（檢查日誌）
- [ ] 線上 API 可訪問
- [ ] 回應格式正確
- [ ] **等待驗證完成後才開始前端開發** ⚠️

### Frontend 開發檢查清單

#### 開發前
- [ ] **Backend API 已部署並驗證可用** ⚠️
- [ ] API 端點文件已確認
- [ ] 了解 API 回應格式
- [ ] UI/UX 設計已確認

#### 開發中
- [ ] 元件結構清晰（單一職責）
- [ ] API 呼叫正確（使用 apiService）
- [ ] 錯誤處理完整（loading, error, empty states）
- [ ] 型別定義正確（TypeScript）

#### 測試
- [ ] 本地開發環境測試（連接 production API）
- [ ] 瀏覽器 Network 面板驗證 API 呼叫
- [ ] 功能測試（正常流程、錯誤流程）
- [ ] 響應式測試（手機、平板、電腦）
- [ ] 深色模式測試
- [ ] 跨瀏覽器測試（Chrome, Safari, Firefox）

#### 部署前
- [ ] TypeScript 編譯無錯誤（`npm run typecheck`）
- [ ] ESLint 檢查通過（`npm run lint`）
- [ ] Commit message 符合規範
- [ ] 只包含相關檔案（不包含後端）

#### 部署後（Staging）
- [ ] Zeabur 建置成功
- [ ] Staging 環境可訪問
- [ ] 完整功能測試
- [ ] 效能測試（Lighthouse）
- [ ] 測試通過才合併到 main

---

## 🚨 常見問題與解決方案

### 問題 1：Frontend 和 Backend 不同步

#### 症狀
```
- Frontend (develop) 已部署新功能
- Backend (main) 未更新
- Staging 測試時 API 錯誤
```

#### 原因
```
Backend 只監聽 main 分支
Frontend 先開發並推送到 develop
Backend 修復還在 develop 未合併到 main
```

#### 解決方案
```bash
# 立即將 Backend 修復合併到 main
git checkout main
git cherry-pick <backend-fix-commit>
git push origin main

# 等待 Backend 重新部署
# 然後測試 Staging
```

#### 預防措施
```
1. 永遠遵循 "Backend First" 原則
2. Backend 修復應優先合併到 main
3. 開發前確認 Backend API 可用
4. 建立 Feature Branch 避免分支混亂
```

### 問題 2：API 回應格式錯誤

#### 症狀
```javascript
// Frontend 期望
{
  "teachers": [
    {"id": 1, "teacher_name": "Evelyn"}
  ]
}

// Backend 實際回傳
{
  "teachers": ["Evelyn", "John"]
}
```

#### 原因
```
1. 重複的路由定義
2. 不同檔案中有相同的端點
3. Blueprint 註冊順序錯誤
```

#### 解決方案
```bash
# 1. 搜尋重複路由
grep -rn "@.*\.route.*teachers" timetable_api/

# 2. 刪除重複定義
# 保留正確的實作（使用 to_dict()）

# 3. 確認回應格式
curl http://localhost:8081/api/teachers | jq '.teachers[0]'
```

#### 預防措施
```
1. API 開發完成後立即測試回應格式
2. 使用 API 文檔管理工具（Swagger/OpenAPI）
3. 建立 API 測試腳本
4. Code Review 檢查重複路由
```

### 問題 3：CORS 錯誤

#### 症狀
```
Access-Control-Allow-Origin error
Frontend 無法呼叫 Backend API
```

#### 原因
```
Backend allowed_origins 未包含 Frontend 域名
```

#### 解決方案
```python
# timetable_api/src/main.py
allowed_origins = [
    'http://localhost:3000',
    'https://kcislk-timetable.zeabur.app',
    'https://kcislk-timetable-develop.zeabur.app',
    'https://new-frontend-domain.zeabur.app',  # 新增域名
]
```

#### 預防措施
```
1. 新增 Frontend 域名時同時更新 CORS 設定
2. 在 Staging 環境測試 CORS
3. 使用環境變數管理允許的域名
```

### 問題 4：TypeScript 編譯錯誤

#### 症狀
```
error TS2724: has no exported member 'UnifiedTimetableData'
```

#### 原因
```
1. 型別名稱拼寫錯誤
2. 型別定義不存在
3. Import 路徑錯誤
```

#### 解決方案
```bash
# 1. 檢查型別定義檔案
cat frontend/src/types/index.ts | grep -A 5 "UnifiedTimetable"

# 2. 修正 import
# UnifiedTimetableData → UnifiedTimetableDisplay

# 3. 本地測試編譯
npm run typecheck
```

#### 預防措施
```
1. 開發時開啟 TypeScript 嚴格模式
2. 使用 VSCode TypeScript 檢查
3. 提交前執行 `npm run typecheck`
4. CI/CD 加入 TypeScript 檢查
```

---

## 📚 參考資源

### 專案文檔
- [README.md](../../README.md) - 專案總覽
- [API 文檔](../api/README.md) - 完整 API 規格
- [Zeabur 部署指南](../deployment/zeabur.md) - 部署配置說明
- [CLAUDE.md](../../CLAUDE.md) - AI 開發助手指南

### 外部資源
- [Git Flow 工作流程](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Zeabur 官方文檔](https://docs.zeabur.com)
- [Flask Best Practices](https://flask.palletsprojects.com/en/latest/patterns/)
- [React Best Practices](https://react.dev/learn)

---

**文檔維護者**: Claude Code
**聯絡方式**: 透過 GitHub Issues 回報問題
**最後審查**: 2025-11-12
