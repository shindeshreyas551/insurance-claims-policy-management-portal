const { spawn } = require('child_process');
const path = require('path');

console.log('=====================================================================');
console.log('  INSURANCE CLAIMS & POLICY MANAGEMENT PORTAL');
console.log('  Group 20 - Individual Academic Project (Final Assessment)');
console.log('=====================================================================');

const backendDir = path.join(__dirname, 'backend');
const frontendDir = path.join(__dirname, 'frontend');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

console.log('[1/2] Launching Backend API (Port 5000)...');
const backend = spawn(npmCmd, ['start'], {
  cwd: backendDir,
  shell: true,
  stdio: 'inherit'
});

console.log('[2/2] Launching Frontend Web Portal (Port 4200)...');
const frontend = spawn(npmCmd, ['start'], {
  cwd: frontendDir,
  shell: true,
  stdio: 'inherit'
});

process.on('SIGINT', () => {
  console.log('\nStopping servers...');
  backend.kill();
  frontend.kill();
  process.exit();
});

console.log('\nBoth servers are running:');
console.log(' -> Backend API:  http://localhost:5000/api/health');
console.log(' -> Frontend App: http://localhost:4200');
console.log('=====================================================================\n');
