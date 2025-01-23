const { _electron: electron } = require('playwright');
const { Before, After, BeforeAll, AfterAll } = require('@cucumber/cucumber');
const { setDefaultTimeout } = require('@cucumber/cucumber');

setDefaultTimeout(1000 * 1000);

let electronApp, window;

BeforeAll(async () => {
  console.log('Launching Electron Application...');
  electronApp = await electron.launch({ args: ['out/main/index.js'] });
  console.log('Electron Application Launched');
});

AfterAll(async () => {
  console.log('Closing Electron Application...');
  if (electronApp) {
    await electronApp.close();
  }
  console.log('Electron Application Closed');
});

Before(async function (Scenario) {
  console.log(`Setting up for Scenario: ${Scenario.pickle.name}`);
  window = await electronApp.firstWindow();
  await window.waitForLoadState('domcontentloaded');
  console.log('Window Ready');
});

After(async function (){ 

  console.log('Closing Electron Window');
  if (window) {
    await window.close();
  }
});

