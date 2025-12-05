# Tailwind CSS v4 + Electron Forge ESM 兼容性问题

## 问题描述

在 Electron Forge + Vite 项目中使用 Tailwind CSS v4 时，运行 `pnpm start` 报错：

```
"@tailwindcss/vite" resolved to an ESM file. ESM file cannot be loaded by `require`.
```

## 原因

- `@tailwindcss/vite` 是 **ESM-only** 的包，只提供 ES Module 格式
- 默认情况下（没有 `"type": "module"`），Node.js 使用 CommonJS 模式
- Electron Forge 的 Vite 插件在加载 `.ts` 配置文件时使用 `require()`，无法加载 ESM 包

## 解决方案

将 Vite 配置文件的扩展名从 `.ts` 改为 `.mts`。

`.mts` 文件会被 Node.js **强制当作 ES Module 处理**，无需修改 `package.json`。

### 步骤

1. **重命名配置文件**：

```bash
mv vite.main.config.ts vite.main.config.mts
mv vite.preload.config.ts vite.preload.config.mts
mv vite.renderer.config.ts vite.renderer.config.mts
```

2. **更新 `forge.config.ts`** 中的引用路径：

```ts
new VitePlugin({
  build: [
    {
      entry: 'src/main/index.ts',
      config: 'vite.main.config.mts',  // 改为 .mts
      target: 'main',
    },
    {
      entry: 'src/main/preload.ts',
      config: 'vite.preload.config.mts',  // 改为 .mts
      target: 'preload',
    },
  ],
  renderer: [
    {
      name: 'main_window',
      config: 'vite.renderer.config.mts',  // 改为 .mts
    },
  ],
}),
```

3. **更新 `tsconfig.json`**，确保包含 `.mts` 文件：

```json
{
  "include": ["src/**/*", "*.mts"]
}
```

## 参考

- 参考项目：[electron-shadcn](https://github.com/LuanRoger/electron-shadcn)

