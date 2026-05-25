-- Создание таблицы преподавателей
CREATE TABLE IF NOT EXISTS teachers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'teacher', -- 'admin' или 'teacher'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы учеников
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    subject VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    group_name VARCHAR(100), -- Для групповых занятий
    rate_per_lesson DECIMAL(10,2), -- Цена за урок
    payment_type VARCHAR(20) DEFAULT 'hourly', -- 'hourly', 'subscription', 'monthly'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы расписания (уроков)
CREATE TABLE IF NOT EXISTS schedule (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id), -- NULL если это группа
    group_name VARCHAR(100), -- Если урок групповой
    teacher_id INTEGER REFERENCES teachers(id),
    date DATE NOT NULL,
    time_start TIME NOT NULL,
    time_end TIME NOT NULL,
    subject VARCHAR(100),
    telemost_link TEXT, -- Ссылка на онлайн-урок
    cabinet VARCHAR(10), -- Номер кабинета
    status VARCHAR(20) DEFAULT 'planned', -- 'planned', 'done', 'cancelled', 'moved'
    lesson_notes TEXT, -- Заметки по уроку
    homework TEXT, -- Домашнее задание
    homework_due DATE, -- Срок сдачи ДЗ
    attendance_status VARCHAR(20), -- Для отметки посещаемости
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы оплат
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE DEFAULT CURRENT_DATE,
    payment_type VARCHAR(50), -- Наличные, карта, перевод
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создадим индекс для быстрого поиска уроков по дате
CREATE INDEX idx_schedule_date ON schedule(date);
