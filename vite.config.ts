/// <reference types="vitest"/>

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/fitflix-trainers-marketplace/",
test: {
  environment: "jsdom",
  globals: true
}
})
