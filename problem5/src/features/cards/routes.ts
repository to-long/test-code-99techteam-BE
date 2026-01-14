import { Hono } from 'hono';
import { cardService } from './service.js';

const app = new Hono();

/**
 * @openapi
 * components:
 *   schemas:
 *     Card:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         stackId:
 *           type: integer
 *         name:
 *           type: string
 *         cover:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */

/**
 * @openapi
 * /api/cards:
 *   get:
 *     tags: [Cards]
 *     summary: Get all cards
 *     responses:
 *       200:
 *         description: List of all cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'
 */
app.get('/api/cards', (c) => {
  return c.json(cardService.getAll());
});

/**
 * @openapi
 * /api/cards/search:
 *   get:
 *     tags: [Cards]
 *     summary: Search cards by name or description
 *     parameters:
 *       - name: name
 *         in: query
 *         description: Search by card name or description
 *         schema:
 *           type: string
 *       - name: stackId
 *         in: query
 *         description: Filter by stack ID
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         description: Limit results
 *         schema:
 *           type: integer
 *       - name: offset
 *         in: query
 *         description: Offset for pagination
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of matching cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'
 */
app.get('/api/cards/search', (c) => {
  const name = c.req.query('name');
  const stackId = c.req.query('stackId') ? Number.parseInt(c.req.query('stackId')!) : undefined;
  const limit = c.req.query('limit') ? Number.parseInt(c.req.query('limit')!) : undefined;
  const offset = c.req.query('offset') ? Number.parseInt(c.req.query('offset')!) : undefined;
  
  return c.json(cardService.find({ name, stackId, limit, offset }));
});

/**
 * @openapi
 * /api/cards/{id}:
 *   get:
 *     tags: [Cards]
 *     summary: Get card by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Card found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       404:
 *         description: Card not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/api/cards/:id', (c) => {
  const id = Number.parseInt(c.req.param('id'));
  const card = cardService.getById(id);
  if (!card) return c.json({ error: 'Card not found' }, 404);
  return c.json(card);
});

/**
 * @openapi
 * /api/stacks/{stackId}/cards:
 *   get:
 *     tags: [Cards]
 *     summary: Get all cards in a stack
 *     parameters:
 *       - name: stackId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'
 *       404:
 *         description: Stack not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/api/stacks/:stackId/cards', (c) => {
  const stackId = Number.parseInt(c.req.param('stackId'));
  const result = cardService.getByStackId(stackId);
  if ('error' in result) return c.json(result, 404);
  return c.json(result.cards);
});

/**
 * @openapi
 * /api/stacks/{stackId}/cards:
 *   post:
 *     tags: [Cards]
 *     summary: Create a card in a stack
 *     parameters:
 *       - name: stackId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, cover]
 *             properties:
 *               name:
 *                 type: string
 *               cover:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Card created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       404:
 *         description: Stack not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/api/stacks/:stackId/cards', async (c) => {
  const stackId = Number.parseInt(c.req.param('stackId'));
  const body = await c.req.json();
  const result = cardService.create(stackId, body);
  if ('error' in result) return c.json(result, 404);
  return c.json(result, 201);
});

/**
 * @openapi
 * /api/cards/{id}:
 *   put:
 *     tags: [Cards]
 *     summary: Update a card
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               cover:
 *                 type: string
 *               description:
 *                 type: string
 *               stackId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Card updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       404:
 *         description: Card not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.put('/api/cards/:id', async (c) => {
  const id = Number.parseInt(c.req.param('id'));
  const body = await c.req.json();
  const result = cardService.update(id, body);
  if ('error' in result) return c.json(result, 404);
  return c.json(result);
});

/**
 * @openapi
 * /api/cards/{id}:
 *   delete:
 *     tags: [Cards]
 *     summary: Delete a card
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Card deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Card not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.delete('/api/cards/:id', (c) => {
  const id = Number.parseInt(c.req.param('id'));
  const result = cardService.delete(id);
  if ('error' in result) return c.json(result, 404);
  return c.json(result);
});

/**
 * @openapi
 * /api/cards/{id}/move:
 *   patch:
 *     tags: [Cards]
 *     summary: Move a card to a different stack
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [stackId]
 *             properties:
 *               stackId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Card moved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       404:
 *         description: Card or stack not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.patch('/api/cards/:id/move', async (c) => {
  const id = Number.parseInt(c.req.param('id'));
  const body = await c.req.json();
  const result = cardService.move(id, body.stackId);
  if ('error' in result) return c.json(result, 404);
  return c.json(result);
});

export { app as cardsRoutes };
