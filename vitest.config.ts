import {fileURLToPath} from 'node:url';
import {mergeConfig, configDefaults, defineConfig} from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      env: {
        BASE_URL: 'veggies',
      },
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      globals: true,
      clearMocks: true,
      mockReset: true,
      restoreMocks: true,
      setupFiles: ['./vitest.setup.ts'],
      coverage: {
        provider: 'istanbul',
        include: ['src/**/*'],
        exclude: ['src/App.vue', 'src/main.ts', 'src/router/index.ts'],
        reporter: ['text'],
      },
    },
  }),
);
