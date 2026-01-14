import { initDb, saveDb } from './index.js';
import { migrations } from './migrations/index.js';

async function migrate() {
  console.log('🔄 Running migrations...');
  const db = await initDb();

  db.run(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const isApplied = (name: string) => {
    const result = db.exec(`SELECT id FROM migrations WHERE name = '${name}'`);
    return result.length > 0 && result[0].values.length > 0;
  };

  for (const migration of migrations) {
    if (isApplied(migration.name)) {
      console.log(`  ⏭️  ${migration.name} (already applied)`);
      continue;
    }
    migration.up(db);
    db.run(`INSERT INTO migrations (name) VALUES ('${migration.name}')`);
    console.log(`  ✅ ${migration.name}`);
  }

  saveDb();
  console.log('✨ Migrations complete!');
}

migrate().catch(console.error);

