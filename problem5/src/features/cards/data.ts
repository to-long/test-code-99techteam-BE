import type { Card } from '../../../db/index.js';
import { insert, queryAll, queryOne, run } from '../../db.js';

export type { Card };

export const cardRepo = {
  findAll(): Card[] {
    return queryAll<Card>('SELECT * FROM cards ORDER BY created_at DESC');
  },

  findById(id: number): Card | undefined {
    return queryOne<Card>('SELECT * FROM cards WHERE id = ?', [id]);
  },

  findByStackId(stackId: number): Card[] {
    return queryAll<Card>('SELECT * FROM cards WHERE stack_id = ? ORDER BY created_at DESC', [
      stackId,
    ]);
  },

  find(query: { 
    name?: string; 
    stackId?: number; 
    limit?: number; 
    offset?: number 
  }): Card[] {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (query.name) {
      conditions.push('(name LIKE ? OR description LIKE ?)');
      params.push(`%${query.name}%`, `%${query.name}%`);
    }

    if (query.stackId !== undefined) {
      conditions.push('stack_id = ?');
      params.push(query.stackId);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limitClause = query.limit ? `LIMIT ${query.limit}` : '';
    const offsetClause = query.offset ? `OFFSET ${query.offset}` : '';

    return queryAll<Card>(`
      SELECT * FROM cards 
      ${whereClause}
      ORDER BY created_at DESC
      ${limitClause} ${offsetClause}
    `, params);
  },

  create(data: { stackId: number; name: string; cover: string; description?: string }): Card {
    const id = insert(
      'INSERT INTO cards (stack_id, name, cover, description, created_at) VALUES (?, ?, ?, ?, ?)',
      [data.stackId, data.name, data.cover, data.description ?? null, new Date().toISOString()],
    );
    return this.findById(id)!;
  },

  update(
    id: number,
    data: { name?: string; cover?: string; description?: string; stackId?: number },
  ): Card | undefined {
    const card = this.findById(id);
    if (!card) return undefined;

    run('UPDATE cards SET name = ?, cover = ?, description = ?, stack_id = ? WHERE id = ?', [
      data.name ?? card.name,
      data.cover ?? card.cover,
      data.description ?? card.description,
      data.stackId ?? card.stack_id,
      id,
    ]);
    return this.findById(id);
  },

  move(id: number, stackId: number): Card | undefined {
    const card = this.findById(id);
    if (!card) return undefined;

    run('UPDATE cards SET stack_id = ? WHERE id = ?', [stackId, id]);
    return this.findById(id);
  },

  delete(id: number): boolean {
    return run('DELETE FROM cards WHERE id = ?', [id]) > 0;
  },
};

