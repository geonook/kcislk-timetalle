# Zeabur 部署配置指南

## 📋 環境概覽

本專案使用兩個獨立的 Zeabur 服務，分別對應 Staging 和 Production 環境：

| 環境 | Git 分支 | Zeabur 服務名稱 | URL | 配置檔案 |
|------|----------|----------------|-----|----------|
| **Production** | `main` | `kcislk-timetable-frontend` | https://kcislk-timetable.zeabur.app | `zeabur.json` |
| **Staging** | `develop` | `kcislk-timetable-frontend-staging` | https://frontend-develop.zeabur.app | `zeabur-staging.json` |

---

## 🚀 Production 服務設定

### 1. 基本設定

在 Zeabur 控制台創建服務時：

- **Service Name**: `kcislk-timetable-frontend`
- **Git Repository**: `geonook/kcislk-timetable`
- **Git Branch**: `main`
- **Root Directory**: `/`
- **Config File**: `zeabur.json`

### 2. 環境變數

```bash
NODE_VERSION=20
NODE_ENV=production
VITE_API_BASE_URL=https://kcislk-backend.zeabur.app/api
VITE_APP_NAME=KCISLK Timetable System
VITE_ENABLE_EXAM_PROCTOR=false
```

### 3. 建置設定

- **Framework**: Vite
- **Build Command**: `npm run build:production`
- **Install Command**: `npm ci --legacy-peer-deps`
- **Output Directory**: `dist`
- **Root Directory**: `frontend`

### 4. 自動部署

- ✅ 當 `main` 分支有新提交時自動觸發部署
- ⚠️ 建議：只有經過 Staging 測試通過的代碼才合併到 main

---

## 🧪 Staging 服務設定

### 1. 基本設定

在 Zeabur 控制台創建**第二個**服務時：

- **Service Name**: `kcislk-timetable-frontend-staging`
- **Git Repository**: `geonook/kcislk-timetable`
- **Git Branch**: `develop`
- **Root Directory**: `/`
- **Config File**: `zeabur-staging.json`

### 2. 環境變數

```bash
NODE_VERSION=20
NODE_ENV=staging
VITE_API_BASE_URL=https://kcislk-backend.zeabur.app/api
VITE_APP_NAME=KCISLK Timetable System (Staging)
VITE_ENABLE_EXAM_PROCTOR=true
```

### 3. 建置設定

- **Framework**: Vite
- **Build Command**: `npm run build:staging`
- **Install Command**: `npm ci --legacy-peer-deps`
- **Output Directory**: `dist`
- **Root Directory**: `frontend`

### 4. 自動部署

- ✅ 當 `develop` 分支有新提交時自動觸發部署
- ✅ 用於日常開發測試，所有功能開關皆啟用

---

## 🔄 標準開發工作流程

### 日常開發

```bash
# 1. 切換到 develop 分支
git checkout develop
git pull origin develop

# 2. 開發新功能
# 編輯 frontend/ 下的檔案...

# 3. 提交並推送（自動部署到 Staging）
git add .
git commit -m "feat: 新功能描述"
git push origin develop

# 4. 在 Staging 環境測試
# 訪問 https://frontend-develop.zeabur.app
# 確認功能正常運作

# 5. 測試通過後，合併到 main（部署到 Production）
git checkout main
git merge develop
git push origin main

# 6. 在 Production 環境驗證
# 訪問 https://kcislk-timetable.zeabur.app
```

### 緊急修復（Hotfix）

```bash
# 1. 從 main 創建 hotfix 分支
git checkout main
git checkout -b hotfix/緊急問題描述

# 2. 修復問題並提交
git add .
git commit -m "fix: 緊急問題修復"

# 3. 合併到 main（立即部署到 Production）
git checkout main
git merge hotfix/緊急問題描述
git push origin main

# 4. 同步回 develop
git checkout develop
git merge hotfix/緊急問題描述
git push origin develop

# 5. 刪除 hotfix 分支
git branch -d hotfix/緊急問題描述
```

---

## ✅ 驗證清單

### Staging 環境驗證

訪問 https://frontend-develop.zeabur.app 並確認：

- [ ] 顯示 React 前端應用（非 Flask API）
- [ ] 學生課表查詢功能正常
- [ ] 期中考監考功能顯示（VITE_ENABLE_EXAM_PROCTOR=true）
- [ ] 中英文雙語切換正常
- [ ] 深色模式切換正常
- [ ] Console 無錯誤訊息

### Production 環境驗證

訪問 https://kcislk-timetable.zeabur.app 並確認：

- [ ] 顯示 React 前端應用（非 Flask API）
- [ ] 學生課表查詢功能正常
- [ ] 期中考監考功能隱藏（VITE_ENABLE_EXAM_PROCTOR=false）
- [ ] 中英文雙語切換正常
- [ ] 深色模式切換正常
- [ ] Console 無錯誤訊息

---

## 🛠️ 常見問題

### Q1: 推送代碼後 Zeabur 沒有自動部署？

**解決方案：**
1. 檢查 Zeabur 服務設定中的 Git 分支是否正確
2. 確認 GitHub webhook 是否正常運作
3. 在 Zeabur 控制台手動點擊「Redeploy」按鈕
4. 檢查 Zeabur 部署日誌是否有錯誤

### Q2: 部署時出現 "vite: not found" 錯誤？

**解決方案：**
1. 確認 `installCommand` 設定為 `npm ci --legacy-peer-deps`
2. 確認 `NODE_VERSION` 設定為 `20`
3. 確認 `rootDirectory` 設定為 `frontend`

### Q3: Production 顯示 Flask API 而非 React 應用？

**解決方案：**
1. 確認 Zeabur 服務類型設定為「Frontend」
2. 確認 `framework` 設定為 `vite`
3. 確認配置檔案 `zeabur.json` 正確
4. 檢查 Zeabur 服務是否連接到正確的 Git 分支（main）

### Q4: 如何更新環境變數？

**步驟：**
1. 登入 Zeabur 控制台
2. 選擇對應的服務（Production 或 Staging）
3. 進入「Settings」→「Environment Variables」
4. 修改或新增環境變數
5. 點擊「Save」
6. 手動觸發「Redeploy」讓新環境變數生效

---

## 📞 支援

如有任何問題，請參考：
- CLAUDE.md - 完整的專案文檔
- README.md - 專案說明
- GitHub Issues - 問題追蹤

---

**最後更新**: 2025-11-10
**版本**: 1.0.0
