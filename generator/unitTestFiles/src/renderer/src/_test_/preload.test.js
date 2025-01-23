import { describe, it, expect, beforeAll, vi } from 'vitest';
const mockContextBridge = {
  exposeInMainWorld: vi.fn(),
};
const mockIpcRenderer = {
  invoke: vi.fn(),
};

const mockElectronAPI = { someMethod: vi.fn() };

vi.mock('electron', async () => {
  const actual = await vi.importActual('electron'); 

  return {
    ...actual,
    contextBridge: mockContextBridge,
    ipcRenderer: mockIpcRenderer,
  };
});

vi.mock('@electron-toolkit/preload', () => ({
  electronAPI: mockElectronAPI,
}));

describe('Preload script', () => {
  let preload;

  beforeAll(async () => {
    preload = await import('../../../../src/preload/index.js');
  });

  it('should expose ipcRenderer.invoke to the renderer process', () => {
    expect(mockContextBridge.exposeInMainWorld).toHaveBeenCalledWith('electron', {
      ipcRenderer: {
        invoke: expect.any(Function),
      },
    });
  });

  it('should expose electronAPI to the renderer process', () => {
    expect(mockContextBridge.exposeInMainWorld).toHaveBeenCalledWith('electronAPI', mockElectronAPI);
  });

  it('should expose custom api to the renderer process', () => {
    expect(mockContextBridge.exposeInMainWorld).toHaveBeenCalledWith('api', {});
  });

  it('should call ipcRenderer.invoke correctly', () => {
    global.window = { electron: { ipcRenderer: mockIpcRenderer } };

    window.electron.ipcRenderer.invoke('test-channel', 'test-data');
    expect(mockIpcRenderer.invoke).toHaveBeenCalledWith('test-channel', 'test-data');
  });

  it('should call electronAPI method correctly', () => {
    global.window.electronAPI = mockElectronAPI;

    window.electronAPI.someMethod('test-arg');
    expect(mockElectronAPI.someMethod).toHaveBeenCalledWith('test-arg');
  });

  it('should return the correct heading', () => {
    expect(preload.showElectron('with Vue')).toBe('Electron with Vue!');
  });
});
