import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import initSqlJs, { type Database } from 'sql.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../data.db');

let db: Database;

export async function initDb(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs();
  db = fs.existsSync(dbPath) ? new SQL.Database(fs.readFileSync(dbPath)) : new SQL.Database();
  db.run('PRAGMA foreign_keys = ON');

  return db;
}

export function getDb(): Database {
  if (!db) throw new Error('Database not initialized. Call initDb() first.');
  return db;
}

export function saveDb(): void {
  if (!db) return;
  fs.writeFileSync(dbPath, Buffer.from(db.export()));
}

// Types
export interface Stack {
  id: number;
  name: string;
  cover_type: 'color' | 'gradient' | 'image';
  cover_value: string;
  created_at: string;
}

export interface Card {
  id: number;
  stack_id: number;
  name: string;
  cover: string;
  description: string | null;
  created_at: string;
}

// Helper to generate random covers for stacks
const colors = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#14b8a6',
  '#06b6d4',
  '#3b82f6',
];

export const generateRandomCover = (): { type: Stack['cover_type']; value: string } => {
  const types: Stack['cover_type'][] = ['color', 'gradient', 'image'];
  const type = types[Math.floor(Math.random() * types.length)];

  if (type === 'color') {
    return { type: 'color', value: colors[Math.floor(Math.random() * colors.length)] };
  }
  if (type === 'gradient') {
    const c1 = colors[Math.floor(Math.random() * colors.length)];
    const c2 = colors[Math.floor(Math.random() * colors.length)];
    return {
      type: 'gradient',
      value: `linear-gradient(${Math.floor(Math.random() * 360)}deg, ${c1}, ${c2})`,
    };
  }
  return { type: 'image', value: `https://picsum.photos/seed/${Date.now()}/400/200` };
};

