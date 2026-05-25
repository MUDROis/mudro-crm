const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к PostgreSQL
const pool = new Pool({
  // Используем переменные окружения, которые задаст Docker
  connectionString: process.env.DATABASE_URL || 'postgresql://mudro_admin:mudro2024secure@localhost:5432/mudro_crm',
  ssl: false
});

// Тест подключения к БД
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Ошибка подключения к БД', err.stack);
  }
  console.log('✅ База данных подключена успешно');
  release();
});

// --- API Маршруты ---

// 1. Получить всех учеников
app.get('/api/students', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка базы данных' });
  }
});

// 2. Создать нового ученика
app.post('/api/students', async (req, res) => {
  const { name, subject, phone, email, group_name, rate_per_lesson, payment_type, notes } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO students (name, subject, phone, email, group_name, rate_per_lesson, payment_type, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, subject, phone, email, group_name, rate_per_lesson, payment_type, notes]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при создании ученика' });
  }
});

// 3. Получить расписание
app.get('/api/schedule', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, st.name as student_name 
      FROM schedule s
      LEFT JOIN students st ON s.student_id = st.id
      ORDER BY s.date, s.time_start
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка базы данных' });
  }
});

// 4. Создать урок
app.post('/api/schedule', async (req, res) => {
  const { student_id, group_name, teacher_id, date, time_start, time_end, subject, telemost_link, cabinet, status } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO schedule (student_id, group_name, teacher_id, date, time_start, time_end, subject, telemost_link, cabinet, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [student_id, group_name, teacher_id, date, time_start, time_end, subject, telemost_link, cabinet, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при создании урока' });
  }
});

// 5. Отметить посещаемость
app.put('/api/attendance/:id', async (req, res) => {
  const { id } = req.params;
  const { attendance_status, lesson_notes } = req.body;
  try {
    const result = await pool.query(
      'UPDATE schedule SET attendance_status = $1, lesson_notes = $2 WHERE id = $3 RETURNING *',
      [attendance_status, lesson_notes, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка базы данных' });
  }
});

// 6. Получить оплаты
app.get('/api/payments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM payments ORDER BY payment_date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка базы данных' });
  }
});

// 7. Добавить оплату
app.post('/api/payments', async (req, res) => {
  const { student_id, amount, payment_type, notes } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO payments (student_id, amount, payment_type, notes) VALUES ($1, $2, $3, $4) RETURNING *',
      [student_id, amount, payment_type, notes]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при добавлении оплаты' });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
