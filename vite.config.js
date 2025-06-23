import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  const isProduction = mode === 'production';
  return {
    plugins: [tailwindcss(), react()],
    base: isProduction ? '/my-clone-github/' : '/',
    server: {
      port: 3001,
      host: true,
      open: true,
    },
  };
});
