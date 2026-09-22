import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // la chunk delle shader non va precaricata: la chiediamo noi, e solo
    // quando WebGPU c'è davvero
    modulePreload: {
      resolveDependencies: (_url, deps) => deps.filter((d) => !d.includes('shaders')),
    },
  },
  server: { port: 4186, host: '127.0.0.1' },
  preview: { port: 4187, host: '127.0.0.1' },
});
