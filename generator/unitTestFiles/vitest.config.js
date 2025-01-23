import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'happy-dom',
      root: fileURLToPath(new URL('./', import.meta.url)),
      exclude: [...configDefaults.exclude, '**/e2e/**', './src/_stories/*','**/out/**'],
      coverage: {
        enabled: true,
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        exclude: [
          '**/_stories/*',
          '**/html/*',
          '**/e2e/*',
          '**/out/*',
          '**/.storybook/*',
          '**/.stroybook/*',
          '**/setup/*',
          '**/main.js',
          '**/Versions.vue',
          '**/Toaster.js',
          '.eslintrc.cjs',
          'cucumber.js',
          'playwright.config.js',
          'reporter.js'
        ]
      },
      reporter: ['html']
    }
  })
);