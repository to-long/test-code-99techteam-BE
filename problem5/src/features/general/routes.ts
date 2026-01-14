import { Hono } from 'hono';

const app = new Hono();

/**
 * @openapi
 * /:
 *   get:
 *     tags: [General]
 *     summary: Welcome
 *     responses:
 *       200:
 *         description: Success
 */
app.get('/', (c) =>
  c.json({
    message: 'Welcome to the BE API',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  })
);

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [General]
 *     summary: Health check
 *     responses:
 *       200:
 *         description: OK
 */
app.get('/health', (c) => c.json({ status: 'ok' }));

export { app as generalRoutes };
