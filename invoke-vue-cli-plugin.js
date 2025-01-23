#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

function runCommand(command, options = {}) {
  try {
    execSync(command, { stdio: 'inherit', shell: true, ...options });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    process.exit(1);
  }
}

const argv = yargs(hideBin(process.argv))
  .option('projectName', { type: 'string', demandOption: true })
  .option('systemsRequired', { type: 'string', demandOption: true })
  .option('authRequired', { type: 'string', demandOption: true })
  .option('isSideBarRequired', { type: 'string', demandOption: true })
  .option('isFileBarRequired', { type: 'boolean', demandOption: true })
  .option('playwright_automation', { type: 'boolean', demandOption: true })
  .option('t4j_key', { type: 'string', default: 'testProject' })
  .option('unit_test_case', { type: 'boolean', demandOption: true })
  .argv;

const {
  projectName,
  systemsRequired,
  authRequired,
  isSideBarRequired,
  isFileBarRequired,
  playwright_automation,
  t4j_key,
  unit_test_case,
} = argv;

// Navigate to project directory
const projectPath = path.resolve(projectName);
process.chdir(projectPath);

// Install dependencies
runCommand('npm install');

// Install the local plugin
const pluginPath = path.resolve('C:\\Users\\PandeyPranja\\vuePluginConditional');
runCommand(`npm install ${pluginPath}`);

// Invoke Vue CLI Plugin
runCommand(`vue invoke @ifxglobal/vue-cli-plugin-electron-dashboard --systemsRequired ${systemsRequired} --authRequired ${authRequired} --isSideBarRequired ${isSideBarRequired} --isFileBarRequired ${isFileBarRequired} --playwright_automation ${playwright_automation} --t4j_key ${t4j_key} --unit_test_case ${unit_test_case}`);
