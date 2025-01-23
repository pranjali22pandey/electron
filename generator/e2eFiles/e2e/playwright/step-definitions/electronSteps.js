const { Given, When, Then, After } = require('@cucumber/cucumber');
const { _electron: electron } = require('playwright');
const { expect } = require('chai'); 

let electronApp, window;

Given('the Electron application is launched', async function () {
  console.log('Launching Electron App...');
  electronApp = await electron.launch({ args: ['out/main/index.js'] });
  window = await electronApp.firstWindow();
  await window.waitForLoadState('domcontentloaded');
  console.log('Electron App Launched');
});

Then('the application path should be displayed', async function () {
  const appPath = await electronApp.evaluate(async ({ app }) => app.getAppPath());
  console.log('App Path:', appPath);
  expect(appPath).to.not.be.empty;
});

When('the user navigates to the Home page', async function () {
  console.log('Navigating to Home Page...');
  try {
    // Click on the Home link
    await window.click('a[href="/./"]');
    console.log('Home link clicked');
    
    // Wait for a specific element on the Home page to ensure it's loaded
    await window.waitForSelector('#hello-world', { state: 'visible', timeout: 60000 });
    console.log('Home Page Loaded');
  } catch (error) {
    console.error('Error navigating to Home Page:', error);
    throw error;
  }
});

Then('the Home page should be displayed', async function () {
  const url = await window.url();
  console.log(`Current URL: ${url}`);
  expect(url).to.contain("///");

  // Capture screenshot of Home page
  const fileName = 'Home_Page';
  await window.screenshot({ path: `./screenshots/${fileName}.png` });
  console.log('Screenshot of Home Page saved');
});

Then('the title of the first window should be {string}', async function (title) {
  const windowTitle = await window.title();
  console.log(`Window Title: ${windowTitle}`);
  expect(windowTitle).to.equal(title);
});

When('the title of page should be displayed', async function () {
  const windowTitle = await window.title();
  console.log(`Window Title: ${windowTitle}`);
  expect(windowTitle).to.contain("Electron");
});

When('the user navigates to the Aggrid page', async function () {
  console.log('Navigating to Aggrid Page...');
  
  try {
    await window.click('a[href="/./ag-grid"]');
    console.log('Aggrid link clicked');
    
    // Wait for a specific element on the Aggrid page to ensure it's loaded
    await window.waitForSelector('.ag-grid-container', { state: 'visible', timeout: 60000 });
    console.log('Aggrid Page Loaded');
  } catch (error) {
    console.error('Error navigating to Aggrid Page:', error);
    throw error;
  }
});

Then('the Aggrid page should be displayed', async function () {
  const url = await window.url();
  console.log(`Current URL: ${url}`);
  expect(url).to.contain("///ag-grid");
  
  // Capture screenshot of Aggrid page
  const fileName = 'Aggrid_Page';
  await window.screenshot({ path: `./screenshots/${fileName}.png` });
  console.log('Screenshot of Aggrid Page saved');
});

After(async function () {
  if (electronApp) {
    await electronApp.close();
  }
});