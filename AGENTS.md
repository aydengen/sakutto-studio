# Repository Guidelines

## Project Structure & Module Organization
- Electron 主进程与窗口加载：`src/main.ts`；预加载桥接层：`src/preload.ts`。
- React/Vite 入口：`src/main.tsx`，主界面：`src/App.tsx`，样式：`src/tw.css`。
- UI 组件：`src/components/ui`；通用工具：`src/lib/utils.ts`；静态资源：`src/assets`。
- 业务服务：`src/services/*`（如 `ffmpeg.ts`、`history.ts`）；类型定义：`src/types.d.ts`、`src/types/`。
- 构建配置：`forge.config.ts`、`vite.*.config.mts`、`tsconfig.json`。输出目录：`out/`。

## Build, Test, and Development Commands
- `pnpm install`：安装依赖，保持锁定一致。
- `pnpm start`：Electron Forge + Vite 开发模式，热重载主进程/预加载/渲染进程。
- `pnpm lint`：运行 ESLint（TS/React/Import 规则），提交前需通过。
- `pnpm package`：生成未签名分发包；`pnpm make` 构建安装包。
- `pnpm publish`：按 Forge 配置发布（需预先配置 GitHub 发布者）。

## Coding Style & Naming Conventions
- 语言：TypeScript + React 函数组件，2 空格缩进，路径别名 `@/` 指向 `src`。
- 命名：组件/文件 PascalCase 或 kebab-case，函数/变量小驼峰；保持周边引号与分号习惯。
- 样式：Tailwind 工具类 + `cn` 聚合；主题变量集中在 `src/tw.css`。
- 导入顺序：标准模块在前，本地模块在后。

## Testing Guidelines
- 目前无自动化测试；新增功能至少提供可复现的手动验证步骤（平台、输入、期望）。
- 若补充自动化测试，推荐 Vitest + React Testing Library；用例放在相关模块旁的 `*.test.tsx` 或 `__tests__/`。
- 优先覆盖：视频压缩流程、窗口生命周期、预加载 API。

## Commit & Pull Request Guidelines
- 提交信息：遵循类 Conventional Commits，如 `feat: ...`、`chore: ...`、`refactor: ...`，保持动词式摘要与小粒度变更。
- PR 内容：说明目的、主要实现点、验证方式（命令或手动步骤）；UI 改动附截图/录屏。确保 `pnpm lint` 通过。
- 影响打包/发布时注明目标平台、所需环境变量/证书；关联对应 issue/任务便于审阅。

## Security & Configuration Tips
- 仅在预加载层暴露必要接口，保持 `contextIsolation` 开启、禁用渲染层 Node API。
- 机密信息放 `.env`（已忽略），不要提交密钥/证书。发布前确认 GitHub 令牌与签名证书配置。
- 拖拽/文件路径等 IPC 参数需校验类型，避免异常；长任务提供取消与清理（如 ffmpeg 任务）。
