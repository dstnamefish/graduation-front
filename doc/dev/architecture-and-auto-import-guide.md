# 🚀 现代企业级架构与自动化开发指南

本文档旨在指导开发者如何利用本项目最新的 **FSD (Feature-Sliced Design)** 架构以及 **Vite 自动化特性** 进行高效开发。

## 1. 核心架构：FSD (特性大分类)

项目不再按照技术类型（如 `api`, `views`）划分根目录，而是按照 **业务领域** 划分。

- **`src/features/`**: 业务的核心。每个功能块（如 `appointment`, `doctor`）都是独立的文件夹，包含自己的 `api.ts`, `types.ts`, `composables/` 和 `views/`。
- **`src/shared/`**: 基础设施。包含公共 UI 组件 (`ui/`)、工具函数 (`lib/utils/`) 和 Hooks (`lib/hooks/`)。
- **`src/entities/`**: 业务实体层。例如全局的 `user` 模型定义。
- **`src/app/`**: 应用配置层。包含全局 Layout、全局样式和全局 Store。

---

## 2. ⚡ 零导入开发 (Auto Import)

为了减少样板代码，项目配置了 `unplugin-auto-import` 和 `unplugin-vue-components`。**以下内容在 `.vue` 和 `.ts` 文件中无需手动 `import`：**

### A. 全局包 API

- **Vue**: `ref`, `reactive`, `computed`, `watch`, `onMounted` 等。
- **Vue Router**: `useRouter`, `useRoute`。
- **Pinia**: `defineStore`, `storeToRefs`。
- **Vue-i18n**: `useI18n`。
- **VueUse**: `@vueuse/core` 中的常用方法。

### B. 本地业务逻辑 (Hooks & Utils)

以下目录下的导出函数会被 **自动探测并注入全局**：

- `src/shared/lib/hooks/**` (例如: `useTable`, `useCommon`)
- `src/shared/lib/utils/**` (例如: `formatDate`, `storage`)
- `src/features/**/composables/**` (例如: `useAppointmentQuery`)

> **[重要]**：只要你在这些目录下定义并 `export` 的函数，在任何页面可以直接使用，无需写 `import` 语句。

### C. UI 组件 (Components)

以下目录下的 Vue 组件会被 **自动按需加载**：

- `src/shared/ui/` 下的所有组件 (例如: `<WnButton />`, `<WnTable />`)
- `src/app/layouts/` 下的布局组件
- **Element Plus**: 所有 `ElXXXX` 组件。

---

## 3. 最佳实践建议

1. **优先使用 Feature 内部逻辑**：如果一个 Hook 只被 `appointment` 使用，请放在 `features/appointment/composables` 下，而不是 `shared/lib/hooks`。
2. **逻辑与视图分离**：尽量将复杂的 `ref`/`reactive` 逻辑提取到 `composables` 中，保持 `.vue` 文件清爽。
3. **利用 IDE 提示**：项目根目录生成的 `src/types/import/auto-imports.d.ts` 为这些自动导入提供了完美的类型提示，IDE 会自动识别。

---

## 4. 如何新增一个业务页面？

1. 在 `src/features/` 下找到或创建一个业务目录。
2. 在该目录下编写 `api.ts` 处理请求，`types.ts` 处理类型。
3. 在 `composables/` 下编写业务逻辑钩子。
4. 在 `views/` 下编写界面。
5. 在 `src/router/modules/` 中配置路由指向该特性的视图。

---

_本项目已由架构优化脚本执行深度净化，请保持目录结构的纯净。_
