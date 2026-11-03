const { execSync } = require('child_process');
const path = require('path');

console.log('Building backend...');
execSync('npm.cmd run build', {
  cwd: path.join(__dirname, 'Insurance-Claims-Portal', 'backend'),
  stdio: 'inherit'
});

console.log('\nBuilding frontend...');
execSync('npm.cmd run build', {
  cwd: path.join(__dirname, 'Insurance-Claims-Portal', 'frontend'),
  stdio: 'inherit'
});

console.log('\nAll builds completed successfully!');

