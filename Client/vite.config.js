import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'positive-liberal-treefrog.ngrok-free.app',
      'personally-allowing-lacewing.ngrok-free.app',
      'one-famous-sculpin.ngrok-free.app',
    ],
    historyApiFallback: true,
  },
});
