import { defineConfig } from 'vitest/config';
import viteReactPlugin from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [viteReactPlugin()],
  test: {
    environment: 'jsdom',
  },
});
