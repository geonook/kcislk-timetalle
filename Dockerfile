# Stage 1: 建置前端
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# 複製前端 package.json 並安裝依賴
COPY frontend/package*.json ./
RUN npm install

# 複製前端源碼並建置
COPY frontend/ ./
RUN npm run build

# Stage 2: 建置 Python 後端
FROM python:3.11-slim AS backend

WORKDIR /app

# 安裝系統依賴
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# 複製 Python requirements 並安裝依賴
COPY timetable_api/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 複製後端源碼
COPY timetable_api/ ./

# 從前端建置階段複製靜態檔案
COPY --from=frontend-builder /app/frontend/dist ./src/static/

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