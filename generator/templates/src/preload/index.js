import { contextBridge, ipcRenderer } from 'electron';

const api = {
  onNewArtifact: (callback) => ipcRenderer.on('new-artifact', (event, data) => callback(data)),
  sendTestMessage: (message) => ipcRenderer.send('test-message', message),
  onTestReply: (callback) => ipcRenderer.on('test-reply', (event, arg) => callback(arg)),
};

console.log('Preload script loaded');

contextBridge.exposeInMainWorld('electron', {
  api: api,
});

