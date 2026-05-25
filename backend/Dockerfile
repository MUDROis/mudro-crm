FROM node:18-alpine

# Устанавливаем wget для healthcheck
RUN apk add --no-cache wget

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем код приложения
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
