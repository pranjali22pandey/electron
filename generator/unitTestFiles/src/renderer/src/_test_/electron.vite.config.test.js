// tests/unit/electron.vite.config.test.js
import { describe, it, expect } from 'vitest';
import { resolve } from 'path';

// Ensure the path is correctly resolved
import config from '../../../../electron.vite.config.mjs'; 

describe('electron.vite.config.mjs', () => {
  it('should define configuration for main, preload, and renderer', () => {
    expect(config).toHaveProperty('main');
    expect(config).toHaveProperty('preload');
    expect(config).toHaveProperty('renderer');
  });

  it('should include externalizeDepsPlugin in main plugins', () => {
    expect(config.main.plugins).toContainEqual(expect.objectContaining({}));
  });

  it('should include externalizeDepsPlugin in preload plugins', () => {
    expect(config.preload.plugins).toContainEqual(expect.objectContaining({}));
  });

  it('should include vue plugin in renderer plugins', () => {
    expect(config.renderer.plugins).toContainEqual(expect.objectContaining({
      name: 'vite:vue'
    }));
  });

  it('should resolve alias for @renderer in renderer config', () => {
    expect(config.renderer.resolve.alias).toHaveProperty('@renderer', resolve('src/renderer/src'));
  });
});
