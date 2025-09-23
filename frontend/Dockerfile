# 使用 Node.js 20 Alpine 版本（輕量且相容性好）
FROM node:20-alpine AS builder

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json（如果存在）
COPY package*.json ./

# 安裝依賴
RUN npm ci

# 複製所有源碼
COPY . .

# 執行建置
RUN npm run build:zeabur

# 第二階段：使用 Nginx 提供靜態檔案
FROM nginx:alpine

# 複製建置結果到 Nginx 目錄
COPY --from=builder /app/dist /usr/share/nginx/html

# 複製自訂 Nginx 設定
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露 80 埠
EXPOSE 80

# 啟動 Nginx
CMD ["nginx", "-g", "daemon off;"]