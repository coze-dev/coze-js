import { createProxyMiddleware } from 'http-proxy-middleware';
import express from 'express';

import { apiKey, baseURL } from '../client';

const app = express();
const port = 8080;

// Create proxy middleware
const proxyMiddleware = createProxyMiddleware({
  target: baseURL,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // Rewrite path: http://localhost:8080/api/xxx -> http://api.coze.com/xxx
  },
  // Support websocket && SSE
  ws: true,
  on: {
    proxyReq: (proxyReq, req) => {
      // Add PAT authentication header
      proxyReq.setHeader('Authorization', `Bearer ${apiKey}`);
      if (
        req.headers.accept &&
        req.headers.accept.includes('text/event-stream')
      ) {
        proxyReq.setHeader('Cache-Control', 'no-cache');
        proxyReq.setHeader('Connection', 'keep-alive');
        proxyReq.setHeader('Content-Type', 'text/event-stream');
      }
      console.log(`Proxy request: ${proxyReq.path}`);
    },
    error: (err, req, res) => {
      console.error(`Proxy error: ${err}`);
    },
  },
});

// Apply proxy middleware to all routes
app.use('/', proxyMiddleware);

app.listen(port, () => {
  console.log(`Proxy server is running on http://localhost:${port}`);
});
