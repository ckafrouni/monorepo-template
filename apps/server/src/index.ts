import { createTRPCHandler } from '@worspace/api/hono';
import { auth } from '@worspace/auth';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { streamText, convertToCoreMessages } from 'ai';
import { openai } from '@ai-sdk/openai';
import { stream } from 'hono/streaming';
import { serve } from '@hono/node-server';
import { env } from './env.js';

const app = new Hono();

app.use(logger());
app.use(
	'/*',
	cors({
		origin: env.CORS_ORIGIN?.split(',') || [],
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		credentials: true,
	})
);

app.on(['POST', 'GET'], '/api/auth/**', (c) => auth.handler(c.req.raw));

const trpcHandler = createTRPCHandler({ endpoint: '/api/trpc' });
app.use('/api/trpc/*', trpcHandler);

app.post('/ai', async (c) => {
	const body = await c.req.json();
	const messages = body.messages || [];

	const result = streamText({
		model: openai('gpt-4.1-mini'),
		messages: convertToCoreMessages(messages),
	});

	c.header('X-Vercel-AI-Data-Stream', 'v1');
	c.header('Content-Type', 'text/plain; charset=utf-8');
	c.header('Transfer-Encoding', 'chunked');
	c.header('Connection', 'keep-alive');

	return stream(c, (stream) => stream.pipe(result.toDataStream()));
});

app.get('/', (c) => {
	return c.text('OK');
});

// Start server
const port = env.PORT;
console.log(`🚀 Server running on http://localhost:${port}`);

serve({
	fetch: app.fetch,
	port,
});
