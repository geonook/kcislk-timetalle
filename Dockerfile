# Stage 1: 建置前端
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# 調試：列出構建上下文
RUN echo "=== 檢查構建上下文 ==="
COPY . /tmp/build-context/
RUN ls -la /tmp/build-context/ && echo "=== frontend 目錄 ===" && ls -la /tmp/build-context/frontend/ || echo "frontend 目錄不存在"

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

# 調試：再次檢查構建上下文
RUN echo "=== 後端階段：檢查構建上下文 ==="
COPY . /tmp/build-context/
RUN ls -la /tmp/build-context/ && echo "=== timetable_api 目錄 ===" && ls -la /tmp/build-context/timetable_api/ || echo "timetable_api 目錄不存在"

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

# 最終調試：確認所有檔案
RUN echo "=== 最終檔案檢查 ===" && ls -la && echo "=== src 目錄 ===" && ls -la src/ || echo "src 目錄不存在"

# 啟動命令
CMD ["python", "run_server.py"]