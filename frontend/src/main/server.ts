#!/usr/bin/env node
import { app } from './app';

// used by shutdownCheck in readinessChecks
app.locals.shutdown = false;

// TODO: set the right port for your application
const port: number = parseInt(process.env.PORT || '3100', 10);

// For development, we'll use HTTP to avoid mixed content issues
app.listen(port, () => {
  console.log(`Application started: http://localhost:${port}`);
});

function gracefulShutdownHandler(signal: string) {
  console.log(`⚠️ Caught ${signal}, gracefully shutting down. Setting readiness to DOWN`);
  // stop the server from accepting new connections
  app.locals.shutdown = true;

  setTimeout(() => {
    console.log('Shutting down application');
    // @ts-ignore
    process.exit(0);
  }, 4000);
}

// @ts-ignore
process.on('SIGINT', gracefulShutdownHandler);
// @ts-ignore
process.on('SIGTERM', gracefulShutdownHandler);
