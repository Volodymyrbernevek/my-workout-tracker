import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.js'],
    coverage: {
      provider: 'v8',
      all: true, // <--- Змушує Vitest включати всі файли, навіть ті, для яких немає тестів
      include: ['src/**/*.{js,vue}'], // <--- Вказує шукати всі файли .js та .vue в папці src
    }
  }
})
