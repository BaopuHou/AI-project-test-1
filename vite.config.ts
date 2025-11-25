import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载当前目录下的环境变量
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // 关键修复：将 process.env.API_KEY 注入到前端代码中
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  }
})