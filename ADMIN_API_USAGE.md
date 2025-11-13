# Admin API 使用說明

## 📋 概述

Admin API 提供資料庫維護和遷移功能，用於解決生產環境資料庫無法自動更新 CSV 變更的問題。

## 🔐 認證

所有 Admin API 端點（除了 health check）都需要在 HTTP Header 中提供 API 金鑰：

```
X-Admin-Key: <your-admin-key>
```

### 環境變數配置

在 Zeabur 環境變數中設定：

```bash
ADMIN_API_KEY=<your-secure-admin-key>
```

**開發環境預設值**: `dev-admin-key-change-in-production`

⚠️ **重要**: 生產環境務必更改為安全的金鑰！

## 📡 API 端點

### 1. 健康檢查（無需認證）

**端點**: `GET /api/admin/health`

**用途**: 確認 Admin API 正常運行

**範例**:
```bash
curl https://kcislk-backend.zeabur.app/api/admin/health
```

**回應**:
```json
{
  "success": true,
  "message": "Admin API is running"
}
```

---

### 2. 驗證 John 教師資料狀態

**端點**: `GET /api/admin/verify-john-teacher`

**用途**: 檢查資料庫中 John 相關教師的當前狀態

**範例**:
```bash
curl -X GET https://kcislk-backend.zeabur.app/api/admin/verify-john-teacher \
  -H "X-Admin-Key: your-admin-key"
```

**回應範例**:
```json
{
  "success": true,
  "data": {
    "teachers": ["John", "John Adams Villamoran"],
    "english_timetable": [
      {"teacher": "John", "course_count": 2},
      {"teacher": "John Adams Villamoran", "course_count": 4}
    ],
    "timetable": [
      {"teacher": "John", "course_count": 2},
      {"teacher": "John Adams Villamoran", "course_count": 4}
    ]
  }
}
```

---

### 3. 執行 John 教師合併遷移

**端點**: `POST /api/admin/migrate-john-teacher`

**用途**: 將重複的 "John" 教師記錄合併至 "John Adams Villamoran"

**範例**:
```bash
curl -X POST https://kcislk-backend.zeabur.app/api/admin/migrate-john-teacher \
  -H "X-Admin-Key: your-admin-key"
```

**成功回應**:
```json
{
  "success": true,
  "message": "教師記錄合併完成",
  "details": {
    "timetable_updated": 2,
    "english_timetable_updated": 2,
    "teachers_deleted": 1,
    "final_teacher_count": 1,
    "final_teacher_names": ["John Adams Villamoran"],
    "final_course_count": 6
  }
}
```

**錯誤回應（未授權）**:
```json
{
  "success": false,
  "error": "Unauthorized: Invalid or missing X-Admin-Key header"
}
```

**錯誤回應（資料庫錯誤）**:
```json
{
  "success": false,
  "error": "資料庫操作失敗: <error message>"
}
```

---

## 🚀 完整執行流程

### 步驟 1: 等待 Zeabur 部署完成

推送到 GitHub main 分支後，等待 Zeabur 自動部署完成（通常 2-3 分鐘）。

可以監控 Zeabur 控制台的部署狀態。

### 步驟 2: 驗證 API 部署成功

```bash
curl https://kcislk-backend.zeabur.app/
```

應該看到 version `2.3.1` 和新的 admin 端點。

### 步驟 3: 檢查當前資料狀態

```bash
curl -X GET https://kcislk-backend.zeabur.app/api/admin/verify-john-teacher \
  -H "X-Admin-Key: dev-admin-key-change-in-production"
```

如果看到兩個 John 教師，繼續下一步。

### 步驟 4: 執行遷移

```bash
curl -X POST https://kcislk-backend.zeabur.app/api/admin/migrate-john-teacher \
  -H "X-Admin-Key: dev-admin-key-change-in-production"
```

### 步驟 5: 再次驗證

```bash
curl -X GET https://kcislk-backend.zeabur.app/api/admin/verify-john-teacher \
  -H "X-Admin-Key: dev-admin-key-change-in-production"
```

應該只看到一個教師："John Adams Villamoran"，6 門課程。

### 步驟 6: 確認前端顯示

訪問: https://kcislk-timetable-develop.zeabur.app/teachers

應該只看到一個 John Adams Villamoran。

---

## 🔒 安全建議

1. **更改預設 API 金鑰**: 在 Zeabur 環境變數中設定強密碼
2. **限制訪問**: 只在需要時執行 Admin API
3. **監控日誌**: 檢查 Zeabur 日誌確認操作成功
4. **備份資料**: 雖然遷移是安全的（使用事務），但仍建議定期備份

---

## 📊 預期結果

執行成功後：

- ✅ teachers 表: 1 筆記錄 "John Adams Villamoran"
- ✅ english_timetable: 6 筆記錄全部為 "John Adams Villamoran"
- ✅ timetable: 6 筆記錄全部為 "John Adams Villamoran"
- ✅ 課程: G2 Guardians + G4 Navigators + G4 Visionaries

---

## 🛠️ 故障排除

### 問題 1: API 回應 404

**解決方案**: 確認 Zeabur 已完成部署，檢查服務日誌

### 問題 2: 401 Unauthorized

**解決方案**: 檢查 X-Admin-Key header 是否正確

### 問題 3: 資料庫操作失敗

**解決方案**:
1. 檢查 Zeabur 服務日誌
2. 確認資料庫 Volume 正常掛載
3. 聯繫開發者支援

---

**版本**: v2.3.1
**建立日期**: 2025-11-13
**作者**: KCISLK 開發團隊
