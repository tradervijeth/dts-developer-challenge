const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 3100;

// Serve static files
app.use(express.static(path.join(__dirname, 'src/main/public')));

// Proxy API requests to the backend
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:8080',
  changeOrigin: true,
  secure: false,
  pathRewrite: {
    '^/api': ''  // Remove /api prefix when forwarding to backend
  },
  // Add timeout configuration
  proxyTimeout: 120000,  // 120 seconds (2 minutes)
  timeout: 120000       // 120 seconds (2 minutes)
}));

// Serve the main HTML file for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/main/views/tasks.njk'));
});

app.listen(port, () => {
  console.log(`Frontend server running at http://localhost:${port}`);
});
