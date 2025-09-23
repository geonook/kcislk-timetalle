# 單階段建構：Flask 單體應用
FROM python:3.11-slim

WORKDIR /app

# 安裝系統依賴
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# 複製 Python requirements 並安裝依賴
COPY timetable_api/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 複製後端源碼和模板
COPY timetable_api/ ./

# 確保數據目錄存在
RUN mkdir -p data

# 設置環境變數
ENV FLASK_APP=run_server.py
ENV FLASK_ENV=production
ENV PORT=8080

# 暴露端口
EXPOSE 8080

# 建立資料目錄
RUN mkdir -p /app/data

# 啟動命令
CMD ["python", "run_server.py"]