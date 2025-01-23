#!/usr/bin/env node

const { spawn } = require('child_process');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .option('projectName', { type: 'string', demandOption: true })
  .option('template', { type: 'string', demandOption: true })
  .option('typescript', { type: 'string', choices: ['yes', 'no'], default: 'no' })
  .option('updater', { type: 'string', choices: ['yes', 'no'], default: 'no' })
  .option('downloadProxy', { type: 'string', choices: ['yes', 'no'], default: 'no' })
  .argv;

const { projectName, template, typescript, updater, downloadProxy } = argv;

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const createProcess = spawn(npmCmd, [
  'create', '@quick-start/electron', projectName, '--', '--template', template
], {
  stdio: 'pipe'
});

createProcess.stdout.on('data', data => {
  const output = data.toString();
  console.log(output);

  if (output.includes('Add TypeScript?')) {
    createProcess.stdin.write(`${typescript}\n`);
  } else if (output.includes('Add Electron updater plugin?')) {
    createProcess.stdin.write(`${updater}\n`);
  } else if (output.includes('Enable Electron download mirror proxy?')) {
    createProcess.stdin.write(`${downloadProxy}\n`);
  }
});

createProcess.stderr.on('data', data => {
  console.error(`Error: ${data}`);
});

createProcess.on('error', error => {
  console.error(`Failed to start process: ${error}`);
});

createProcess.on('close', code => {
  console.log(`Process exited with code ${code}`);
});
