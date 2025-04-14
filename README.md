# OneSearch - 一键搜索多个平台

OneSearch 是一个强大的浏览器扩展，让您能够在选择文本后，通过简单的点击快速在多个搜索引擎和平台上搜索该内容。

## 🖼️ 功能预览

<div align="center">
  <h3>选择文本后的气泡菜单</h3>
  <img src="./assets/bubble.gif" alt="气泡功能演示" width="600">

  <h3>自定义搜索引擎设置</h3>
  <img src="./assets/options.png" alt="设置页面" width="600">
</div>

## ✨ 功能特点

- **便捷搜索**: 选择任意文本，即时在多个搜索引擎上搜索
- **气泡界面**: 选择文本后出现悬浮气泡，提供快捷搜索选项
- **搜索面板**: 展开更多搜索提供商和操作选项
- **自定义操作**: 支持搜索、复制、菜单等多种操作类型
- **可配置**: 自定义搜索引擎和显示顺序

## 🔍 支持的搜索网站

OneSearch 支持任意能通过URL传递搜索关键词的网站，包括但不限于：

- 各类搜索引擎（如百度、必应、谷歌等）
- 在线词典和翻译工具（如有道词典、百度翻译等）
- 知识类网站（如维基百科、知乎等）
- 电商平台（如淘宝、京东等）
- 开发者资源（如GitHub、StackOverflow等）

只要网站支持通过URL参数传递搜索关键词，您都可以在设置中添加并自定义其URL模板。

## 📦 安装

### 从商店安装

- [Chrome 网上应用店] (即将上线)
- [Firefox Add-ons] (即将上线)
- [Edge Add-ons] (即将上线)

### 手动安装

1. 从 [Releases](https://github.com/AIchanKimi/oneSearch/releases) 页面下载最新版本的扩展
2. Chrome/Edge 浏览器：
   - 打开扩展管理页面 (`chrome://extensions` 或 `edge://extensions`)
   - 启用"开发者模式"
   - 将下载的 `.zip` 文件解压
   - 点击"加载已解压的扩展程序"并选择解压后的文件夹
3. Firefox 浏览器：
   - 打开 `about:debugging#/runtime/this-firefox`
   - 点击"临时载入附加组件"
   - 选择解压后文件夹中的 `manifest.json` 文件

## 🚀 使用方法

1. 安装扩展后，在任何网页上选择文本
2. 在选择的文本旁边会出现一个小气泡
3. 点击气泡中的搜索引擎图标，直接在新标签页中搜索所选文本
4. 点击"菜单"选项，展开更多搜索选项和操作
5. 点击面板中的任意搜索引擎或操作按钮执行相应功能

## ⚙️ 自定义设置

1. 点击扩展图标，打开扩展弹窗
2. 点击"打开设置"按钮，进入设置页面
3. 在设置页面，您可以：
   - 添加或移除搜索引擎
   - 调整搜索引擎显示顺序
   - 配置气泡和面板中显示的选项
   - 自定义搜索URL模板

## 🛠️ 开发说明

OneSearch 是使用以下技术构建的：

- [WXT](https://wxt.dev) - WebExtension开发框架
- [React](https://react.dev) - 用户界面库
- [Tailwind CSS](https://tailwindcss.com) - CSS框架
- [Radix UI](https://www.radix-ui.com) - 无障碍组件库

### 本地开发

```bash
# 安装依赖
npm install
# 或者
pnpm install

# 开发模式启动
npm run dev
# 或者
pnpm dev

# 为Firefox开发
npm run dev:firefox
# 或者
pnpm dev:firefox

# 构建扩展
npm run build
# 或者
pnpm build

# 打包zip文件
npm run zip
# 或者
pnpm zip
```

### 项目结构

- `components/` - UI组件
- `entrypoints/` - 扩展入口点（popup、options、content script等）
- `provider/` - 搜索提供商定义
- `utils/` - 工具函数
- `types/` - TypeScript类型定义

## 📄 许可证

[MIT License](LICENSE)

## 🔗 相关链接

- [项目主页](https://github.com/AIchanKimi/oneSearch)
- [问题反馈](https://github.com/AIchanKimi/oneSearch/issues)

---

Made by [AIchanKimi](https://github.com/AIchanKimi)
