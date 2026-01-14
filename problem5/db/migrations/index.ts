import type { Database } from 'sql.js';

import * as m001 from './001_create_tables.js';
import * as m002 from './002_seed_data.js';

export interface Migration {
  name: string;
  up: (db: Database) => void;
}

export const migrations: Migration[] = [m001, m002];

