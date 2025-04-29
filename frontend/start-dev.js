const { spawn } = require('child_process');
const path = require('path');

// First, build the frontend assets
console.log('Building frontend assets...');
const buildProcess = spawn('yarn', ['build'], { stdio: 'inherit', shell: true });

buildProcess.on('close', (code) => {
  if (code !== 0) {
    console.error('Build failed with code', code);
    console.log('Continuing anyway...');
  }
  
  // Then start the server
  console.log('Starting server...');
  const serverProcess = spawn('ts-node', ['--transpile-only', './src/main/server.ts'], { 
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, NODE_ENV: 'development' }
  });
  
  serverProcess.on('close', (code) => {
    console.log('Server process exited with code', code);
  });
});
