import * as path from 'path';

import { HTTPError } from './HttpError';
import { Nunjucks } from './modules/nunjucks';

import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import { glob } from 'glob';
import favicon from 'serve-favicon';
import { createProxyMiddleware } from 'http-proxy-middleware';

const { setupDev } = require('./development');

const env = process.env.NODE_ENV || 'development';
const developmentMode = env === 'development';

export const app = express();
app.locals.ENV = env;

new Nunjucks(developmentMode).enableFor(app);

app.use(favicon(path.join(__dirname, '/public/assets/images/favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
  next();
});

// Proxy API requests to the backend
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:8080',
  changeOrigin: true,
  secure: false,
  pathRewrite: {
    '^/api': ''  // Remove /api prefix when forwarding to backend
  },
  // Add timeout configuration
  proxyTimeout: 300000,  // 5 minutes
  timeout: 300000,       // 5 minutes
  // Log proxy events for debugging
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying request: ${req.method} ${req.url} -> ${proxyReq.path}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`Proxy response: ${req.method} ${req.url} -> ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    // If the error is a timeout, send a more helpful response
    if (res.headersSent) {
      return;
    }
    const statusCode = err.code === 'ECONNRESET' ? 504 : 500;
    const errorMessage = err.code === 'ECONNRESET'
      ? 'Connection to the backend timed out. Please try again later.'
      : 'An error occurred while connecting to the backend.';

    res.status(statusCode).json({
      error: errorMessage,
      code: err.code
    });
  }
}));

// Add middleware to log API requests
app.use('/api', (req, res, next) => {
  console.log(`API Request: ${req.method} ${req.url}`);

  // Store the original end method
  const originalEnd = res.end;

  // Override the end method
  res.end = function(chunk?: any, encoding?: any, callback?: any) {
    console.log(`API Response: ${res.statusCode}`);
    return originalEnd.call(this, chunk, encoding, callback);
  };

  next();
});

glob
  .sync(__dirname + '/routes/**/*.+(ts|js)')
  .map(filename => require(filename))
  .forEach(route => route.default(app));

setupDev(app, developmentMode);

// error handler
app.use((err: HTTPError, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message || 'An error occurred';
  res.locals.error = env === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});
