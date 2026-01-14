import type { Database } from 'sql.js';

export const name = '001_create_tables';

export function up(db: Database): void {
  db.run(`
    CREATE TABLE stacks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      cover_type TEXT NOT NULL CHECK (cover_type IN ('color', 'gradient', 'image')),
      cover_value TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stack_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      cover TEXT NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (stack_id) REFERENCES stacks(id) ON DELETE CASCADE
    )
  `);

  db.run('CREATE INDEX idx_cards_stack_id ON cards(stack_id)');
}

