import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    define: {
      __APP_NAME__: JSON.stringify(env.APP_NAME),
      __API_BASE_URL__: JSON.stringify(env.API_BASE_URL),
      __APP_VERSION__: JSON.stringify(env.APP_VERSION)
    }
  }
})
