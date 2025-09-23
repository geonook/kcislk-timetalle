# 課表查詢系統 - 完整說明文件

## 系統概述

課表查詢系統是一個以班級為單位的課表查詢平台，能夠讓使用者選擇特定班級，查看該班級在一週內的完整課表安排，以星期和節次排列顯示。

## 系統網址

**永久網址**: https://vgh0i1c5ej55.manus.space

## 系統功能

### 主要功能
1. **班級選擇**: 提供下拉選單讓使用者選擇班級
2. **週課表顯示**: 以卡片形式顯示一週五天的課表
3. **課程詳細資訊**: 顯示節次、時間、教師、教室等資訊
4. **課表統計**: 顯示本週總課程數、有課程的天數、授課教師數

### 支援的班級
- G1 年級: Achievers, Adventurers, Discoverers, Explorers, Guardians, Innovators, Inventors, Navigators, Pathfinders, Pioneers, Seekers, Trailblazers, Visionaries, Voyagers
- G2 年級: Achievers, Adventurers, Discoverers, Explorers, Guardians, Innovators, Inventors, Navigators, Pathfinders, Pioneers, Seekers, Trailblazers, Visionaries, Voyagers
- G3-G6 年級: 各年級均有相同班級名稱

## 技術架構

### 後端技術
- **框架**: Flask (Python)
- **資料庫**: SQLite
- **API**: RESTful API
- **CORS**: 支援跨域請求

### 前端技術
- **框架**: React
- **UI 組件**: shadcn/ui
- **樣式**: Tailwind CSS
- **圖標**: Lucide React

### 資料庫設計

#### 主要資料表
1. **timetable**: 課表主表
   - day: 星期
   - period_number: 節次 (1-8)
   - time_range: 時間範圍
   - classroom: 教室
   - teacher: 教師
   - class_name: 班級名稱

2. **classes**: 班級資訊
3. **teachers**: 教師資訊
4. **classrooms**: 教室資訊
5. **periods**: 節次時間資訊

## API 端點

### 1. 取得所有班級列表
```
GET /api/classes
```

### 2. 取得特定班級的週課表
```
GET /api/timetable/{class_name}
```

### 3. 取得特定班級在特定日期的課表
```
GET /api/timetable/{class_name}/{day}
```

### 4. 搜尋課程
```
GET /api/search?class_name=&teacher=&classroom=&day=
```

### 5. 取得教師列表
```
GET /api/teachers
```

### 6. 取得教室列表
```
GET /api/classrooms
```

### 7. 取得節次資訊
```
GET /api/periods
```

## 使用方式

1. 開啟系統網址: https://vgh0i1c5ej55.manus.space
2. 點擊「請選擇班級」下拉選單
3. 選擇要查詢的班級
4. 系統會自動載入並顯示該班級的週課表
5. 課表以卡片形式顯示，每天一張卡片
6. 每張卡片顯示該天的所有課程，包含節次、時間、教師、教室
7. 底部顯示課表統計資訊

## 系統特色

1. **響應式設計**: 支援桌面和行動裝置
2. **直觀介面**: 清晰的卡片式佈局
3. **即時載入**: 選擇班級後立即顯示課表
4. **完整資訊**: 顯示課程的所有相關資訊
5. **統計功能**: 提供課表統計數據
6. **美觀設計**: 使用現代化的 UI 設計

## 資料來源

系統載入了完整的課表資料，包含：
- 1270 筆課表資料
- 86 個班級
- 66 位教師
- 55 間教室
- 8 個節次

## 系統維護

系統已部署到永久網址，具有以下特點：
- 24/7 可用性
- 自動備份
- 穩定的網路連線
- 持續的技術支援

## 未來擴展

系統架構支援未來的功能擴展，例如：
- 教師課表查詢
- 教室使用狀況查詢
- 課表匯出功能
- 行動應用程式
- 推播通知功能

