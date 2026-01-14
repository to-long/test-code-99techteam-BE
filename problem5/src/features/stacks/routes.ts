import { Hono } from 'hono';
import { stackService } from './service.js';

const app = new Hono();

/**
 * @openapi
 * components:
 *   schemas:
 *     Cover:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [color, gradient, image]
 *         value:
 *           type: string
 *     Stack:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         cover:
 *           $ref: '#/components/schemas/Cover'
 *         cardCount:
 *           type: integer
 *         createdAt:
 *           type: string
 *     StackWithCards:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         cover:
 *           $ref: '#/components/schemas/Cover'
 *         cards:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Card'
 *         createdAt:
 *           type: string
 */

/**
 * @openapi
 * /api/stacks:
 *   get:
 *     tags: [Stacks]
 *     summary: Get all stacks with card counts
 *     responses:
 *       200:
 *         description: List of stacks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Stack'
 */
app.get('/api/stacks', (c) => {
  return c.json(stackService.getAll());
});

/**
 * @openapi
 * /api/stacks/search:
 *   get:
 *     tags: [Stacks]
 *     summary: Search stacks by name
 *     parameters:
 *       - name: name
 *         in: query
 *         description: Search by stack name
 *         schema:
 *           type: string
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
 *         description: List of matching stacks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Stack'
 */
app.get('/api/stacks/search', (c) => {
  const name = c.req.query('name');
  const limit = c.req.query('limit') ? Number.parseInt(c.req.query('limit')!) : undefined;
  const offset = c.req.query('offset') ? Number.parseInt(c.req.query('offset')!) : undefined;
  
  return c.json(stackService.find({ name, limit, offset }));
});

/**
 * @openapi
 * /api/stacks/{id}:
 *   get:
 *     tags: [Stacks]
 *     summary: Get stack by ID with its cards
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stack with cards
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StackWithCards'
 *       404:
 *         description: Stack not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/api/stacks/:id', (c) => {
  const id = Number.parseInt(c.req.param('id'));
  const stack = stackService.getById(id);
  if (!stack) return c.json({ error: 'Stack not found' }, 404);
  return c.json(stack);
});

/**
 * @openapi
 * /api/stacks:
 *   post:
 *     tags: [Stacks]
 *     summary: Create a new stack
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               cover:
 *                 $ref: '#/components/schemas/Cover'
 *     responses:
 *       201:
 *         description: Stack created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stack'
 */
app.post('/api/stacks', async (c) => {
  const body = await c.req.json();
  const stack = stackService.create(body);
  return c.json(stack, 201);
});

/**
 * @openapi
 * /api/stacks/{id}:
 *   put:
 *     tags: [Stacks]
 *     summary: Update a stack
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
 *                 $ref: '#/components/schemas/Cover'
 *     responses:
 *       200:
 *         description: Stack updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stack'
 *       404:
 *         description: Stack not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.put('/api/stacks/:id', async (c) => {
  const id = Number.parseInt(c.req.param('id'));
  const body = await c.req.json();
  const result = stackService.update(id, body);
  if ('error' in result) return c.json(result, 404);
  return c.json(result);
});

/**
 * @openapi
 * /api/stacks/{id}:
 *   delete:
 *     tags: [Stacks]
 *     summary: Delete a stack and all its cards
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stack deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Stack not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.delete('/api/stacks/:id', (c) => {
  const id = Number.parseInt(c.req.param('id'));
  const result = stackService.delete(id);
  if ('error' in result) return c.json(result, 404);
  return c.json(result);
});

export { app as stacksRoutes };
