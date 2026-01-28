import type { Context } from "hono";
import { pool } from "../config/db.js";
import type { Student } from "./students.model.js";
import type { ResultSetHeader } from "mysql2";

export const getStudents = async (c: Context) => {
  try {
    const [rows] = await pool.query<Student[]>('SELECT * FROM students');
    return c.json(rows);
  } catch (error) {
    console.error(error);
    return c.json({ message: 'Error getting students' }, 500);
  }
};

export const createStudent = async (c: Context) => {
  try {
    const { name, email, age } = await c.req.json();
    const createdAt = new Date().toISOString();
    const [result] = await pool.query<ResultSetHeader>('INSERT INTO students (name, email, age, created_at) VALUES (?, ?, ?, ?)', [name, email, age, createdAt]);
    const [newStudent] = await pool.query('SELECT * FROM students WHERE id = ?', [result.insertId]);
    return c.json(newStudent);
  } catch (error) {
    console.error(error);
    return c.json({ message: 'Error creating student' }, 500);
  }
};

export const updateStudent = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const { name, email, age } = await c.req.json();
    const [result] = await pool.query<ResultSetHeader>('UPDATE students SET name = ?, email = ?, age = ? WHERE id = ?', [name, email, age, id]);

    const [updatedStudent] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);
    return c.json(updatedStudent);
  } catch (error) {
    console.error(error);
    return c.json({ message: 'Error updating student' }, 500);
  }
};

export const deleteStudent = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const [result] = await pool.query('DELETE FROM students WHERE id = ?', [id]);
    return c.json(result);
  } catch (error) {
    console.error(error);
    return c.json({ message: 'Error deleting student' }, 500);
  }
};