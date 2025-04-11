import fs from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'wxt'

// 读取 package.json 获取版本号
const packageJson = JSON.parse(
  fs.readFileSync('./package.json', 'utf8'),
)
const appVersion = packageJson.version || '0.0.0'

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['storage'],
    version: appVersion, // 自动更新扩展版本号
  },
  vite: () => ({
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
      },
    },
    define: {
      __APP_VERSION__: JSON.stringify(appVersion),
    },
  }),
})
