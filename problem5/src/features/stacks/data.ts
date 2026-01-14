import { type Card, type Stack, generateRandomCover } from '../../../db/index.js';
import { insert, queryAll, queryOne, run } from '../../db.js';

export type { Stack, Card };
export { generateRandomCover };

export const stackRepo = {
  findAll(): (Stack & { cardCount: number })[] {
    return queryAll<Stack & { cardCount: number }>(`
      SELECT s.*, COUNT(c.id) as cardCount 
      FROM stacks s 
      LEFT JOIN cards c ON c.stack_id = s.id 
      GROUP BY s.id 
      ORDER BY s.created_at DESC
    `);
  },

  findById(id: number): Stack | undefined {
    return queryOne<Stack>('SELECT * FROM stacks WHERE id = ?', [id]);
  },

  find(query: { name?: string; limit?: number; offset?: number }): (Stack & { cardCount: number })[] {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (query.name) {
      conditions.push('s.name LIKE ?');
      params.push(`%${query.name}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limitClause = query.limit ? `LIMIT ${query.limit}` : '';
    const offsetClause = query.offset ? `OFFSET ${query.offset}` : '';

    return queryAll<Stack & { cardCount: number }>(`
      SELECT s.*, COUNT(c.id) as cardCount 
      FROM stacks s 
      LEFT JOIN cards c ON c.stack_id = s.id 
      ${whereClause}
      GROUP BY s.id 
      ORDER BY s.created_at DESC
      ${limitClause} ${offsetClause}
    `, params);
  },

  findByIdWithCards(id: number): (Stack & { cards: Card[] }) | undefined {
    const stack = this.findById(id);
    if (!stack) return undefined;

    const cards = queryAll<Card>(
      'SELECT * FROM cards WHERE stack_id = ? ORDER BY created_at DESC',
      [id],
    );
    return { ...stack, cards };
  },

  create(data: { name: string; cover?: { type: Stack['cover_type']; value: string } }): Stack {
    const cover = data.cover || generateRandomCover();
    const id = insert(
      'INSERT INTO stacks (name, cover_type, cover_value, created_at) VALUES (?, ?, ?, ?)',
      [data.name, cover.type, cover.value, new Date().toISOString()],
    );
    return this.findById(id)!;
  },

  update(
    id: number,
    data: { name?: string; cover?: { type: Stack['cover_type']; value: string } },
  ): Stack | undefined {
    const stack = this.findById(id);
    if (!stack) return undefined;

    run('UPDATE stacks SET name = ?, cover_type = ?, cover_value = ? WHERE id = ?', [
      data.name ?? stack.name,
      data.cover?.type ?? stack.cover_type,
      data.cover?.value ?? stack.cover_value,
      id,
    ]);
    return this.findById(id);
  },

  delete(id: number): boolean {
    run('DELETE FROM cards WHERE stack_id = ?', [id]);
    return run('DELETE FROM stacks WHERE id = ?', [id]) > 0;
  },
};

