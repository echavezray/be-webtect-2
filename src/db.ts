import mysql from 'mysql2/promise';

// 👇 force TypeScript to allow query()
export const db: any = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // your MySQL password
  database: 'web-tech-2',
});
