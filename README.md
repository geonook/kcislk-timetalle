# KCISLK 課表查詢系統

康橋國際學校林口校區小學部課表查詢系統 - Flask 單體應用架構

## 🚀 特色功能

- **班級課表查詢** - 完整週課表顯示
- **學生課表查詢** - 支援多班級類型（英文班級、Home Room、EV & myReading）
- **智能搜尋** - 中英文姓名、學號搜尋
- **響應式設計** - 支援手機、平板、電腦
- **深色模式** - 自動切換主題
- **單體架構** - 簡化部署與維護

## 🛠️ 技術架構

- **後端**: Python 3.11 + Flask
- **前端**: Jinja2 模板 + Tailwind CSS
- **資料庫**: SQLite / PostgreSQL
- **部署**: Docker + Zeabur

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

- **首頁（班級課表）**: http://localhost:8080
- **學生課表**: http://localhost:8080/student
- **API 文檔**: http://localhost:8080/api/classes

## 📁 專案結構

```
kcislk-timetable/
├── src/                   # 源代碼
│   ├── main/
│   │   ├── python/        # Flask 後端 API
│   │   ├── javascript/    # 前端應用
│   │   └── resources/     # 設定檔和靜態資源
│   └── test/              # 測試代碼
├── database/              # 資料庫相關
├── docs/                  # 專案文檔
└── output/                # 輸出檔案
```

## 📚 API 文檔

### 主要端點

- `GET /api/classes` - 取得所有班級列表
- `GET /api/timetable/{class_name}` - 取得班級週課表
- `GET /api/timetable/{class_name}/{day}` - 取得班級日課表
- `GET /api/search` - 搜尋課程

詳細 API 文檔請參考 [API Documentation](docs/api/README.md)

## 🛠️ 開發指南

開發前請先閱讀 [CLAUDE.md](CLAUDE.md) 了解專案開發規範。

### 主要技術

- **後端**: Flask, SQLAlchemy
- **前端**: React/Vue, Tailwind CSS
- **資料庫**: SQLite (開發), PostgreSQL (生產)

### 測試

```bash
# 執行所有測試
pytest

# 執行單元測試
pytest src/test/unit/

# 執行整合測試
pytest src/test/integration/
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