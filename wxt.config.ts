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
  modules: ['@wxt-dev/module-react', '@wxt-dev/i18n/module'],
  manifest: {
    permissions: ['storage'],
    version: appVersion, // 自动更新扩展版本号
    name: 'OneSearch - 一键搜索多个平台',
    description: 'OneSearch 是一个强大的浏览器扩展，让您能够在选择文本后，通过简单的点击快速在多个搜索引擎和平台上搜索该内容。',
  },
  vite: () => ({
    plugins: [
      tailwindcss(),
    ],
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
