## Dockerfile
#FROM node:20-alpine
#
#WORKDIR /app
#
## Копируем package.json и устанавливаем зависимости
#COPY package*.json ./
## RUN npm ci --only=production
#RUN npm install --omit=dev
#
## Копируем остальные файлы
#COPY . .
#
## Собираем Next.js
#RUN npm run build
#
## Открываем порт
#EXPOSE 3000
#
## Запускаем
#CMD ["npm", "start"]

# 1. Качаем Node.js 22 на базе ультра-легкого Alpine Linux
FROM node:22-alpine
WORKDIR /app

# 2. Копируем манифесты
COPY package*.json ./

# 3. Устанавливаем ВСЕ пакеты, чтобы гарантировать успешную сборку Next.js и Tailwind
RUN npm install

# 4. Копируем исходный код и запускаем компиляцию продакшен-билда
COPY . .
RUN npm run build

# 5. СЕНЬОР-ФИКС: Убираем root-права внутри контейнера для безопасности
RUN chown -R node:node /app
USER node

EXPOSE 3000
CMD ["npm", "start"]
