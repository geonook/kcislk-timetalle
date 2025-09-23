# KCISLK 課表查詢系統 - 完整專案文件

## 專案概述

KCISLK 課表查詢系統是為康橋國際學校林口校區小學部開發的課表查詢系統，支援班級課表查詢和個人學生課表查詢功能，並提供中英文雙語介面。

### 主要功能
- 🏫 班級課表查詢：支援 G1-G6 所有班級的完整週課表查詢
- 👨‍🎓 學生課表查詢：支援學生姓名和學號搜尋，顯示個人課表
- 🌐 雙語支援：完整的中英文介面切換
- 📊 統計資訊：顯示課程統計數據
- 📱 響應式設計：適配桌面和行動裝置

### 技術架構
- **前端**：React + Vite + Tailwind CSS
- **後端**：Flask + SQLAlchemy
- **資料庫**：SQLite（開發環境）
- **部署**：Manus 雲端平台

## 專案結構

```
KCISLK_Timetable_System/
├── backend/                    # 後端 Flask 應用程式
│   ├── src/
│   │   ├── main.py            # Flask 主應用程式
│   │   ├── models/            # 資料模型
│   │   │   ├── timetable.py   # 課表模型
│   │   │   └── student.py     # 學生模型
│   │   ├── routes/            # API 路由
│   │   │   ├── timetable.py   # 課表 API
│   │   │   └── student.py     # 學生 API
│   │   ├── data_loader.py     # 課表資料載入器
│   │   └── data_loader_student.py # 學生資料載入器
│   ├── run_server.py          # 開發伺服器啟動腳本
│   └── requirements.txt       # Python 依賴套件
├── frontend/                  # 前端 React 應用程式
│   ├── src/
│   │   ├── App.jsx           # 主應用程式組件
│   │   ├── ClassApp.jsx      # 班級課表組件
│   │   ├── StudentApp.jsx    # 學生課表組件
│   │   ├── contexts/
│   │   │   └── LanguageContext.jsx # 語言上下文
│   │   └── components/
│   │       └── LanguageToggle.jsx  # 語言切換組件
│   ├── index.html            # HTML 模板
│   ├── package.json          # Node.js 依賴套件
│   └── vite.config.js        # Vite 配置
├── data/                     # 資料檔案
│   ├── students_template.csv # 學生資料模板
│   ├── english_timetable_template.csv # 英文課表模板
│   └── homeroom_timetable_template.csv # Home Room 課表模板
└── docs/                     # 文件
    ├── API_Documentation.md  # API 文件
    ├── Setup_Guide.md        # 安裝指南
    └── User_Manual.md        # 使用手冊
```

## 資料庫設計

### 課表資料表 (Timetable)
- `id`: 主鍵
- `class_name`: 班級名稱
- `day`: 星期 (Monday-Friday)
- `period`: 節次 (1-8)
- `time`: 時間
- `subject`: 科目
- `teacher`: 教師
- `classroom`: 教室
- `course_type`: 課程類型 (English/Home Room/EV & myReading)

### 學生資料表 (Student)
- `id`: 主鍵
- `student_id`: 學號
- `student_name`: 學生姓名
- `english_class_name`: 英文班級
- `home_room_class_name`: Home Room 班級
- `ev_myreading_class_name`: EV & myReading 班級

## API 端點

### 課表 API
- `GET /api/classes` - 取得所有班級列表
- `GET /api/timetable/{class_name}` - 取得指定班級的課表

### 學生 API
- `GET /api/students/search?q={query}` - 搜尋學生
- `GET /api/students/{student_id}` - 取得學生課表

## 部署資訊

### 當前部署狀態
- **後端服務**：https://vgh0i1c1763z.manus.space
- **前端應用**：已部署並發布（branch-7）
- **資料狀態**：已載入 1,512 筆學生資料和 1,289 筆英文課表資料


