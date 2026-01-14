/**
 * Generate OpenAPI spec from JSDoc comments
 * Run: bun run generate:swagger
 */

import swaggerJsdoc from 'swagger-jsdoc';
import { writeFileSync, mkdirSync } from 'node:fs';

const OUTPUT_DIR = './public';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BE API',
      version: '1.0.0',
      description: 'Backend API - Auto-generated from JSDoc',
    },
    servers: [{ url: 'http://localhost:8000', description: 'Development' }],
  },
  apis: ['./src/features/**/routes.ts'],
};

const spec = swaggerJsdoc(options);

mkdirSync(OUTPUT_DIR, { recursive: true });

writeFileSync(`${OUTPUT_DIR}/swagger.json`, JSON.stringify(spec, null, 2));
console.log('✅ Generated: public/swagger.json');

writeFileSync(
  `${OUTPUT_DIR}/swagger.html`,
  `<!DOCTYPE html>
<html><head>
  <title>BE API</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
</head><body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>SwaggerUIBundle({ url: './swagger.json', dom_id: '#swagger-ui' });</script>
</body></html>`
);
console.log('✅ Generated: public/swagger.html');
