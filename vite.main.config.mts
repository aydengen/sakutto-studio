import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      external: [
        // FFmpeg 相关包使用动态 require，需要外部化
        '@ffmpeg-installer/ffmpeg',
        'fluent-ffmpeg',
      ],
    },
  },
});
