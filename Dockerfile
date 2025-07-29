# Stage 1: build
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: serve
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Копируем кастомный конфиг nginx, чтобы фронтенд отдавался с корректными заголовками и fallback для SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
