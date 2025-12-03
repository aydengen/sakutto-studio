# Repository Guidelines

## 项目结构与模块组织
- `src/main.ts` 负责 Electron 主进程与窗口加载；`src/preload.ts` 是桥接层，暴露安全 API。
- `src/renderer/main.tsx` 为 React/Vite 入口，`src/renderer/App.tsx` 承载 UI 逻辑，样式集中在 `src/renderer/tw.css`。
- 共享 UI 组件位于 `src/components/ui`，通用工具在 `src/lib/utils.ts`，静态资源放 `src/assets`；打包与构建配置在根目录的 `forge.config.ts`、`vite.*.config.mts`、`tsconfig.json`。

## 构建、测试与开发命令
- `pnpm install`：安装依赖，保持与锁定文件一致；全程使用 pnpm。
- `pnpm start`：启动 Electron Forge + Vite 开发环境，监听主进程、预加载与渲染进程的热更新。
- `pnpm lint`：运行 ESLint（TS/React/Import 规则），在提交前清理警告与错误。
- `pnpm package`：生成未签名的分发包；`pnpm make` 构建平台安装包；`pnpm publish` 按 Electron Forge 配置发布（需预先配置 GitHub 发布者）。

## 代码风格与命名约定
- 统一使用 TypeScript 与 React 函数组件，保持 2 空格缩进，路径优先使用别名 `@/` 指向 `src`。
- 组件/文件采用 PascalCase 或 kebab-case 反映功能，函数与变量使用小驼峰；样式类可通过 `cn` 辅助函数聚合 Tailwind 工具类。
- 遵循 ESLint 推荐规则，延续周边文件的引号与分号习惯；导入顺序以标准模块在前、本地模块在后。

## 测试指南
- 当前仓库尚无自动化测试，新增功能请至少提供可重复的手动验证步骤（平台、输入、期望输出）。
- 若补充测试，建议使用 Vite 生态（Vitest + React Testing Library）；将用例放在相关模块旁的 `*.test.tsx` 或 `__tests__` 目录。
- 优先覆盖视频压缩流程、窗口生命周期与预加载 API 的回归，UI 交互可通过截图或录屏佐证。

## 提交与 Pull Request
- Git 历史使用类 Conventional Commits（如 `feat: ...`、`chore: ...`、`refactor: ...`），保持动词式摘要与小粒度变更。
- PR 描述应包含变更目的、主要实现点、测试/验证方式（命令或手动步骤），UI 变更请附截图/录屏；提交前确保 `pnpm lint` 通过。
- 影响打包或发布时注明目标平台、需要的环境变量或证书；关联对应的 issue/任务，保持 PR 易于审阅。

## 安全与配置提示
- 仅在预加载层暴露必要接口，避免直接在渲染进程使用 Node API；保持默认的 `contextIsolation` 与安全选项。
- 将私密信息放入 `.env`（已被忽略），不要提交密钥或证书；发布前确认 GitHub 令牌与签名证书配置正确。
