import { Hono } from 'hono';
import { db } from './db';

const app = new Hono();

/* GET all students */
app.get('/students', async (c) => {
  const [rows]: any = await db.query('SELECT * FROM students');
  return c.json(rows);
});

/* GET student by ID */
app.get('/students/:id', async (c) => {
  const id = c.req.param('id');

  const [rows]: any = await db.query(
    'SELECT * FROM students WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    return c.json({ message: 'Student not found' }, 404);
  }

  return c.json(rows[0]);
});

/* POST student */
app.post('/students', async (c) => {
  const data = await c.req.json();

  const {
    first_name,
    last_name,
    email,
    age,
    course,
    year_level,
    gpa,
    enrollment_status,
  } = data;

  if (!first_name || !last_name || !email || !course) {
    return c.json({ message: 'Required fields missing' }, 400);
  }

  if (age < 16 || age > 100) {
    return c.json({ message: 'Invalid age' }, 400);
  }

  if (gpa < 0 || gpa > 4) {
    return c.json({ message: 'Invalid GPA' }, 400);
  }

  await db.query(
    `INSERT INTO students
    (first_name, last_name, email, age, course, year_level, gpa, enrollment_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      first_name,
      last_name,
      email,
      age,
      course,
      year_level,
      gpa,
      enrollment_status,
    ]
  );

  return c.json({ message: 'Student created' }, 201);
});

/* PUT student */
app.put('/students/:id', async (c) => {
  const id = c.req.param('id');
  const data = await c.req.json();

  await db.query(
    `UPDATE students SET
      first_name = ?, last_name = ?, email = ?, age = ?,
      course = ?, year_level = ?, gpa = ?, enrollment_status = ?
     WHERE id = ?`,
    [
      data.first_name,
      data.last_name,
      data.email,
      data.age,
      data.course,
      data.year_level,
      data.gpa,
      data.enrollment_status,
      id,
    ]
  );

  return c.json({ message: 'Student updated' });
});

/* DELETE student */
app.delete('/students/:id', async (c) => {
  const id = c.req.param('id');
  await db.query('DELETE FROM students WHERE id = ?', [id]);
  return c.json({ message: 'Student deleted' });
});

export default app;
