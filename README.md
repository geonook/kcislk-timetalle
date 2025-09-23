# KCISLK 課表查詢系統

康橋國際學校林口校區小學部課表查詢系統 - 生產環境就緒的 Flask 應用程式

## 🚀 特色功能

- **✅ 學生課表查詢** - 支援三種課表類型整合顯示（英文班級、Home Room、EV & myReading）
- **✅ 智能搜尋** - 中英文姓名、學號即時搜尋，模糊匹配
- **✅ 中英文雙語支援** - 完整 i18n 國際化系統，即時語言切換
- **✅ 響應式設計** - 完美支援手機、平板、電腦各種螢幕尺寸
- **✅ 深色模式** - 自動切換主題，保護用戶視力
- **✅ 生產環境就緒** - Zeabur 雲端部署，高效能與穩定性
- **✅ 色彩編碼課表** - 三種課表類型以不同顏色區分，直觀易懂

## 🛠️ 技術架構

- **後端**: Python 3.11 + Flask + SQLAlchemy + Flask-CORS
- **前端**: Jinja2 模板 + Vanilla JavaScript + Tailwind CSS (生產版本)
- **國際化**: 自建 i18n 系統 (JavaScript + JSON 語言檔案)
- **資料庫**: SQLite（開發與生產環境）
- **部署**: Docker + Zeabur 雲端平台
- **版本控制**: Git + GitHub 自動備份

## 📦 快速啟動

### 本地開發

```bash
# 1. 進入專案目錄
cd kcislk-timetable/timetable_api

# 2. 建立虛擬環境
python -m venv venv
source venv/bin/activate  # macOS/Linux
# 或 venv\Scripts\activate  # Windows

# 3. 安裝依賴
pip install -r requirements.txt

# 4. 啟動應用
python run_server.py
```

### Docker 部署

```bash
# 建構映像檔
docker build -t kcislk-timetable .

# 運行容器
docker run -p 8080:8080 kcislk-timetable
```

### Docker Compose

```bash
docker-compose up -d
```

## 🌐 訪問應用

- **學生課表查詢**: http://localhost:8080/student （主要功能）
- **API 端點**:
  - 學生搜尋: `GET /api/students/search?q={query}`
  - 學生課表: `GET /api/students/{student_id}/timetable`
  - 課表資料: `GET /api/timetables`

## 📁 專案結構

```
kcislk-timetable/
├── timetable_api/                    # 主要應用目錄
│   ├── src/                         # 源代碼
│   │   ├── main.py                  # Flask 主應用
│   │   ├── static/                  # 靜態資源（生產就緒）
│   │   │   ├── css/                 # Tailwind CSS 生產版本
│   │   │   ├── js/                  # JavaScript 模組
│   │   │   │   └── i18n.js          # 國際化系統
│   │   │   └── locales/             # 語言資源檔案
│   │   │       ├── zh-TW.json       # 繁體中文
│   │   │       └── en-US.json       # 英文
│   │   └── models/                  # SQLAlchemy 資料模型
│   ├── templates/                   # Jinja2 模板
│   │   ├── base.html               # 基礎模板
│   │   ├── index.html              # 班級課表頁面
│   │   └── student_timetable.html  # 學生課表頁面
│   ├── requirements.txt             # Python 依賴
│   ├── run_server.py               # 啟動腳本
│   ├── Dockerfile                  # Docker 配置
│   └── instance/                   # 運行時實例檔案
│       └── database.db             # SQLite 資料庫
├── CLAUDE.md                       # 開發指南
└── README.md                       # 專案說明
```

## 📚 API 文檔

### 主要端點

- `GET /api/students/search?q={query}` - 學生搜尋（支援中英文姓名、學號）
- `GET /api/students/{student_id}/timetable` - 取得學生完整課表
- `GET /api/timetables` - 取得所有課表資料

### 頁面路由

- `GET /` - 班級課表查詢首頁
- `GET /student` - 學生課表查詢頁面（主要功能）

## 🛠️ 開發指南

開發前請先閱讀 [CLAUDE.md](CLAUDE.md) 了解專案開發規範。

### 主要技術

- **後端**: Flask 3.11, SQLAlchemy 2.0
- **前端**: Jinja2 模板, Vanilla JavaScript, Tailwind CSS (生產版本)
- **國際化**: 自建 JavaScript i18n 系統
- **資料庫**: SQLite (開發與生產環境)
- **部署**: Docker, Zeabur 雲端平台

### 測試

```bash
# 進入應用目錄
cd timetable_api

# 啟用虛擬環境
source venv/bin/activate

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