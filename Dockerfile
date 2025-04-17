# 1단계: 빌드 이미지로 Vite 앱 빌드
FROM node:22 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# 2단계: Nginx로 서빙
FROM nginx:alpine

# 빌드된 Vite 파일을 Nginx에 복사
COPY --from=build /app/dist /usr/share/nginx/html

# 커스텀 nginx.conf 복사
COPY nginx.conf /etc/nginx/nginx.conf

# 80번 포트로 접근 가능하게 설정
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
