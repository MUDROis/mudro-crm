#!/bin/bash

# Скрипт резервного копирования базы данных PostgreSQL
# Использование: ./scripts/backup.sh

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/mudro_crm_backup_$TIMESTAMP.sql"

# Создаем директорию для резервных копий, если её нет
mkdir -p "$BACKUP_DIR"

# Выполняем бэкап
docker compose exec -T db pg_dump -U mudro_admin mudro_crm > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Резервная копия успешно создана: $BACKUP_FILE"
else
    echo "❌ Ошибка при создании резервной копии"
    exit 1
fi

# Удаляем старые резервные копии (старше 7 дней)
find "$BACKUP_DIR" -name "mudro_crm_backup_*.sql" -mtime +7 -delete

echo "🧹 Старые резервные копии удалены"
