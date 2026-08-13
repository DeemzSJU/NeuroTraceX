import { defineConfig, transformWithOxc } from 'vite';
import react from '@vitejs/plugin-react';

// Custom plugin to parse JSX syntax inside standard .js files during Vite compilation
const transformJsxInJs = () => ({
  name: 'transform-jsx-in-js',
  enforce: 'pre',
  async transform(code, id) {
    if (id.includes('node_modules') || !id.match(/.*\.js$/)) {
      return null;
    }
    return await transformWithOxc(code, id, {
      lang: 'jsx',
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    transformJsxInJs()
  ],
  server: {
    port: 3000,
  },
  optimizeDeps: {
    entries: ['index.html'],
    rolldownOptions: {
      moduleTypes: {
        '.js': 'jsx',
      },
    },
  },
  envDir: '../', // Load environment variables from workspace root .env
});
