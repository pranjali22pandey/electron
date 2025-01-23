<%_ if(promptResults.isFileBarRequired ) { _%>
import { app, shell, BrowserWindow, ipcMain, Menu} from 'electron';
  <%_ } else { _%>
import { app, shell, BrowserWindow, ipcMain} from 'electron';
  <%_ } _%>
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import path from 'path';
import icon from '../../resources/icon.png?asset'; // Ensure your icon path is correct

<%_ if (promptResults.authRequired === "Authentication using MIAMI (OAuth)") { _%>
// Set NODE_ENV explicitly
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
const isDev = process.env.NODE_ENV === 'development';
<%_ } _%>

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    <%_ if (!promptResults.isFileBarRequired) { _%>autoHideMenuBar: true,<%_ } _%>


    icon: process.platform === 'linux' ? icon : path.join(__dirname, '../../resources/icon.png'),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: true,
      enableRemoteModule: false,
      headless:true,
    },
  });

  <%_ if (promptResults.isFileBarRequired) { _%>
    // Menu template
    const isMac = process.platform === 'darwin';
    const template = [
      ...(isMac ? [{
        label: app.name,
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' },
        ],
      }] : []),
      {
        label: 'File',
        submenu: [
          isMac ? { role: 'close' } : { role: 'quit' },
        ],
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          ...(isMac
            ? [
              { role: 'pasteAndMatchStyle' },
              { role: 'delete' },
              { role: 'selectAll' },
              { type: 'separator' },
              {
                label: 'Speech',
                submenu: [
                  { role: 'startSpeaking' },
                  { role: 'stopSpeaking' },
                ],
              },
            ]
            : [
              { role: 'delete' },
              { type: 'separator' },
              { role: 'selectAll' },
            ]),
        ],
      },
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' },
        ],
      },
      {
        label: 'Window',
        submenu: [
          { role: 'minimize' },
          { role: 'zoom' },
          ...(isMac
            ? [
              { type: 'separator' },
              { role: 'front' },
              { type: 'separator' },
              { role: 'window' },
            ]
            : [
              { role: 'close' },
            ]),
        ],
      },
      {
        role: 'help',
        submenu: [
          {
            label: 'Learn More',
            click: async () => {
              await shell.openExternal('https://electronjs.org');
            },
          },
        ],
      },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  <%_ } _%>

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

// Conditional Rendering Based on Authentication Requirement
<%_ if (promptResults.authRequired == "No Authentication") { _%>
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
<%_ } _%>

<%_ if (promptResults.authRequired === "Authentication using MIAMI (OAuth)") { _%>
  if (isDev) {
    console.log("Development Mode: Loading from localhost");
    mainWindow.loadURL('http://localhost:8088');
  } else {
    const filePath = path.join(__dirname, '../renderer/index.html');


    // Run the Python script and handle IPC communication
  const appPath = app.getAppPath();
  const pythonScriptPath = isDev ? path.join(appPath, 'src/scripts/poll.py') : path.join(appPath, 'src/scripts/poll.py');
  // console.log(`Resolved Python script path: ${pythonScriptPath}`);

  const pythonScript = spawn('python', [pythonScriptPath]);

  const logFile = fs.createWriteStream(path.join(app.getPath('userData'), 'python_script.log'), { flags: 'a' });
  const errorFile = fs.createWriteStream(path.join(app.getPath('userData'), 'python_script_error.log'), { flags: 'a' });

  pythonScript.stdout.pipe(logFile);
  pythonScript.stderr.pipe(errorFile);

  pythonScript.stdout.on('data', (data) => {
    // console.log(`Python script output: ${data}`);
    const lines = data.toString().split('\n');
    for (const line of lines) {
      if (line.startsWith('JSON_MESSAGE: ')) {
        try {
          const message = JSON.parse(line.replace('JSON_MESSAGE: ', ''));
          console.log(`Parsed message: ${message.message}`);
          mainWindow.webContents.send('new-artifact', message.message);
        } catch (err) {
          console.error('Failed to parse message from Python script:', err);
        }
      }
    }
  });

  // pythonScript.stderr.on('data', (data) => {
  //   console.error(`Python script error: ${data}`);
  // });

  // pythonScript.on('close', (code) => {
  //   console.log(`Python script exited with code ${code}`);
  // });

  // Test IPC communication
  // ipcMain.on('test-message', (event, arg) => {
  //   console.log(`Received test message in main: ${arg}`);
  //   event.sender.send('test-reply', 'Reply from main');
  // });
}

    
    mainWindow.loadFile(filePath).catch((err) => {
      console.error("Failed to load file:", err);
    });
  }
  
  
<%_ } _%>
}

// Initialize the app once Electron is ready
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron'); // Set app user model ID for Windows

  // Watch window shortcuts for development
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on('ping', () => console.log('pong'));

  createWindow();

  app.on('activate', () => {
    // Re-create a window in the app when the dock icon is clicked on macOS
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit the app when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// This is where you can include the rest of your app's specific main process code
// You can also put them in separate files and require them here.