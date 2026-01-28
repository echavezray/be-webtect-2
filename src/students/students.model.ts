import type { RowDataPacket } from "mysql2";

export interface Student extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  age: string;
  created_at: string;
}