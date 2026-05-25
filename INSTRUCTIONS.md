# Инструкция по запуску CRM системы МУДРО

## Требования
- Docker (версия 20.10+)
- Docker Compose (версия 2.0+)

## Быстрый старт

### 1. Запуск системы
```bash
docker compose up -d --build
```

### 2. Проверка статуса контейнеров
```bash
docker compose ps
```

Все контейнеры должны быть в статусе `healthy`:
- `mudro-db` - база данных PostgreSQL
- `mudro-backend` - backend API (Node.js)
- `mudro-frontend` - frontend (Nginx)

### 3. Открытие CRM в браузере
Откройте в браузере: **http://localhost**

## Просмотр логов

### Логи всех сервисов
```bash
docker compose logs -f
```

### Логи конкретного сервиса
```bash
docker compose logs -f backend
docker compose logs -f db
docker compose logs -f frontend
```

## Остановка системы
```bash
docker compose down
```

### Остановка с удалением данных
```bash
docker compose down -v
```

## Структура проекта

```
/workspace
├── backend/           # Backend API (Node.js + Express)
│   ├── Dockerfile
│   ├── server.js      # Основной сервер
│   └── package.json
├── database/          # База данных
│   └── init.sql       # Скрипт инициализации БД
├── frontend/          # Frontend (HTML + JS)
│   └── index.html     # Single-page приложение
├── nginx/             # Конфигурация Nginx
│   └── default.conf   # Проксирование API
├── docker-compose.yml # Конфигурация Docker Compose
└── scripts/           # Вспомогательные скрипты
    └── backup.sh      # Скрипт резервного копирования
```

## Порты

| Сервис | Порт | Описание |
|--------|------|----------|
| Frontend | 80 | Веб-интерфейс CRM |
| Backend | 3000 | API сервер |
| Database | 5432 | PostgreSQL |

## Переменные окружения

Создайте файл `.env` в корне проекта для настройки:

```bash
# Пароль базы данных
DB_PASSWORD=your_secure_password

# Секретный ключ JWT
JWT_SECRET=your_jwt_secret_key
```

Если файл `.env` не создан, используются значения по умолчанию.

## Health Checks

Система автоматически проверяет здоровье сервисов:
- **PostgreSQL**: проверка подключения через `pg_isready`
- **Backend**: HTTP запрос к `/api/students`
- **Frontend**: HTTP запрос к корню сайта

## Решение проблем

### Контейнер не запускается
1. Проверьте логи: `docker compose logs <сервис>`
2. Убедитесь, что порты не заняты: `netstat -tlnp | grep :80`

### Backend не подключается к базе данных
1. Дождитесь готовности БД (health check)
2. Проверьте переменную DATABASE_URL в логах

### Frontend не показывает данные
1. Проверьте подключение backend через http://localhost/api/students
2. Откройте консоль браузера (F12) для просмотра ошибок

### Сброс состояния
```bash
docker compose down -v
docker compose up -d --build
```

## Резервное копирование

Используйте скрипт backup.sh:
```bash
./scripts/backup.sh
```

## Безопасность

⚠️ **Важно для продакшена:**
1. Измените пароли по умолчанию в `.env`
2. Настройте SSL/TLS для Nginx
3. Ограничьте доступ к порту 5432 (БД)
4. Используйте секреты Docker для чувствительных данных
