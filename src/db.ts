import mysql from 'mysql2/promise';

export const db: any = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'echavez12345'
});
