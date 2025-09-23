# KCISLK 課表查詢系統

康橋國際學校林口校區小學部課表查詢系統

## 📋 專案簡介

本系統提供康橋國際學校林口校區小學部的課表查詢功能，支援：
- 班級課表查詢（週課表、日課表）
- 教師課表查詢
- 教室使用狀況查詢
- 中英文雙語介面
- 響應式網頁設計

## 🚀 快速開始

### 環境需求

- Python 3.11+
- Node.js 16+
- SQLite 3 (開發環境)

### 安裝步驟

1. **啟動 Python 虛擬環境**
```bash
source timetable_api/venv/bin/activate  # Linux/Mac
# 或
timetable_api\venv\Scripts\activate     # Windows
```

2. **安裝 Python 相依套件**
```bash
pip install -r requirements.txt
```

3. **安裝 Node.js 套件**
```bash
npm install
```

4. **初始化資料庫**
```bash
python manage.py db init
python manage.py db migrate
python manage.py db upgrade
```

5. **啟動開發伺服器**
```bash
# 後端 API
python app.py

# 前端應用
npm run dev
```

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