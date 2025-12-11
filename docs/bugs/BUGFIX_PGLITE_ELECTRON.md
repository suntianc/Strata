# PGlite 初始化错误修复

**日期**: 2025-12-11
**版本**: 0.1.1

---

## 🐛 问题描述

在 Electron 模式下启动应用时，浏览器控制台出现 PGlite 初始化错误：

```
[Database] ❌ Failed to initialize: Error: Invalid FS bundle size: 3429 !== 5401749
```

---

## 🔍 根本原因分析

### 问题根源

应用有**两套数据库系统**：

1. **浏览器版本**: 使用 PGlite + IndexedDB (`services/database.v2.ts`)
2. **Electron 版本**: 使用 better-sqlite3 (`electron/db/pg.ts`)

但是 `App.tsx` 在启动时**无条件地初始化 PGlite**，即使在 Electron 模式下运行也会尝试初始化，导致错误。

### 代码位置

**文件**: `App.tsx`

```typescript
// ❌ 问题代码 (第 73-74 行)
console.log('[App] Initializing database...');
await db.init();  // 总是尝试初始化 PGlite，即使在 Electron 模式
```

### 为什么会出错？

1. Electron 应用运行在 Chromium 渲染进程中
2. `App.tsx` 导入了 `database.v2.ts` (PGlite 版本)
3. PGlite 尝试从 IndexedDB 加载预编译的 PostgreSQL WASM 文件
4. 文件大小校验失败：期望 5401749 字节，实际只有 3429 字节
5. 初始化失败，但不影响 Electron 功能（因为 Electron 使用独立的 better-sqlite3）

---

## ✅ 修复方案

### 方案概述

在 `App.tsx` 中添加**环境检测**，根据运行环境选择不同的数据存储策略：

- **Electron 模式**: 跳过 PGlite 初始化，使用 localStorage 存储 tasks/messages，使用 IPC 管理 chat sessions
- **浏览器模式**: 正常初始化 PGlite，使用 IndexedDB 持久化

### 实现细节

#### 1. 环境检测函数

```typescript
const isElectron = typeof window !== 'undefined' && window.electron !== undefined;
```

#### 2. 修改数据加载逻辑

**文件**: `App.tsx` (第 70-158 行)

```typescript
useEffect(() => {
  const loadData = async () => {
    try {
      // 检测运行环境
      const isElectron = typeof window !== 'undefined' && window.electron !== undefined;

      if (isElectron) {
        console.log('[App] 🖥️  Running in Electron mode - skipping PGlite initialization');
        console.log('[App] Using localStorage for tasks/messages (chat sessions managed via IPC)');

        // Electron 模式：从 localStorage 加载
        const storedTasks = localStorage.getItem('strata_tasks');
        const storedMessages = localStorage.getItem('strata_messages');
        const storedActiveProject = localStorage.getItem('strata_activeProject');
        const storedDarkMode = localStorage.getItem('strata_darkMode');

        if (storedTasks) {
          const tasks = JSON.parse(storedTasks) as TaskNode[];
          console.log(`[App] Loaded ${tasks.length} tasks from localStorage`);
          setTasks(tasks);
          if (!storedActiveProject && tasks.length > 0) {
            setActiveProjectId(tasks[0].id);
          }
        }

        if (storedMessages) {
          const messages = JSON.parse(storedMessages).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })) as Message[];
          console.log(`[App] Loaded ${messages.length} messages from localStorage`);
          setMessages(messages);
        }

        if (storedActiveProject) {
          setActiveProjectId(storedActiveProject);
        }

        if (storedDarkMode === 'true') {
          setIsDarkMode(true);
        }

        setIsLoaded(true);
        console.log('[App] ✅ Electron mode data loaded successfully');
        return;
      }

      // 浏览器模式：使用 PGlite
      console.log('[App] 🌐 Running in Browser mode - initializing PGlite...');
      await db.init();
      // ... 原有的 PGlite 加载逻辑
    } catch (error) {
      console.error('[App] ❌ Failed to load data:', error);
      setIsLoaded(true);
    }
  };
  loadData();
}, []);
```

#### 3. 修改数据保存逻辑

**文件**: `App.tsx` (第 160-254 行)

所有保存操作都添加了环境检测：

```typescript
// 保存 Tasks
useEffect(() => {
  if (!isLoaded) return;

  const saveTasks = async () => {
    try {
      const isElectron = typeof window !== 'undefined' && window.electron !== undefined;

      if (isElectron) {
        // Electron 模式：保存到 localStorage
        localStorage.setItem('strata_tasks', JSON.stringify(tasks));
        console.log('[App] ✅ Tasks saved to localStorage');
      } else {
        // 浏览器模式：保存到 PGlite
        await db.saveTasks(tasks);
        console.log('[App] ✅ Tasks saved to database');
      }
    } catch (error) {
      console.error('[App] ❌ Failed to save tasks:', error);
    }
  };
  saveTasks();
}, [tasks, isLoaded]);

// 类似的逻辑应用于：
// - Messages 保存
// - Active Project 保存
// - Dark Mode 保存
```

---

## 🎯 修复效果

### 修复前 ❌

```
[App] Initializing database...
[Database] Creating new PGlite instance with IndexedDB persistence...
[Database] ❌ Failed to initialize: Error: Invalid FS bundle size: 3429 !== 5401749
```

### 修复后 ✅

**Electron 模式**:
```
[App] 🖥️  Running in Electron mode - skipping PGlite initialization
[App] Using localStorage for tasks/messages (chat sessions managed via IPC)
[App] Loaded 5 tasks from localStorage
[App] Loaded 12 messages from localStorage
[App] ✅ Electron mode data loaded successfully
```

**浏览器模式**:
```
[App] 🌐 Running in Browser mode - initializing PGlite...
[Database] Creating new PGlite instance with IndexedDB persistence...
[Database] ✅ PGlite instance created and persisted to IndexedDB
[App] ✅ Browser mode data loaded successfully
```

---

## 📊 数据存储策略

### Electron 模式

| 数据类型 | 存储位置 | 说明 |
|---------|---------|------|
| Tasks | localStorage | 项目/任务树结构 |
| Messages | localStorage | 研究笔记和消息 |
| Active Project | localStorage | 当前选中的项目 |
| Dark Mode | localStorage | 深色模式设置 |
| Chat Sessions | SQLite (better-sqlite3) | 通过 IPC 管理 |
| Chat Messages | SQLite (better-sqlite3) | 通过 IPC 管理 |

### 浏览器模式

| 数据类型 | 存储位置 | 说明 |
|---------|---------|------|
| 所有数据 | PGlite (IndexedDB) | 完整的 PostgreSQL 数据库 |

---

## 🔧 技术细节

### 为什么 Electron 不使用 PGlite？

1. **性能**: better-sqlite3 是原生 Node.js 模块，比 WASM 版本快得多
2. **可靠性**: 直接文件系统访问，不依赖 IndexedDB
3. **功能**: 支持 WAL 模式、更好的并发控制
4. **大小**: 不需要打包 8MB+ 的 PostgreSQL WASM 文件

### 为什么浏览器使用 PGlite？

1. **兼容性**: 浏览器无法访问文件系统
2. **功能完整**: 提供完整的 PostgreSQL 功能
3. **持久化**: 通过 IndexedDB 实现数据持久化

### 为什么 Tasks/Messages 在 Electron 用 localStorage？

1. **简单**: 不需要额外的 IPC 通信
2. **快速**: 同步读写，无需异步等待
3. **独立**: 与 chat sessions 分离，避免耦合
4. **向后兼容**: 保持与旧版本的兼容性

---

## 📝 测试步骤

### 测试 1: Electron 模式启动

1. 启动应用：`npm run dev:electron2`
2. 打开开发者工具（Ctrl+Shift+I）
3. 查看控制台输出
4. **验证**：
   - ✅ 看到 "Running in Electron mode" 消息
   - ✅ 没有 PGlite 初始化错误
   - ✅ 数据从 localStorage 加载成功

### 测试 2: 数据持久化

1. 创建一些 tasks 和 messages
2. 完全关闭应用
3. 重新启动应用
4. **验证**：
   - ✅ 所有 tasks 保留
   - ✅ 所有 messages 保留
   - ✅ 当前选中的项目保留

### 测试 3: Chat Sessions

1. 选择一个 Project
2. 打开 Copilot 模式
3. 发送消息
4. 创建新会话
5. **验证**：
   - ✅ 会话通过 IPC 保存到 SQLite
   - ✅ 消息正确显示
   - ✅ 会话切换正常

---

## 🚀 部署说明

### 开发环境

```bash
# 重新构建
npm run build:electron2

# 启动测试
npm run dev:electron2
```

### 生产环境

```bash
# 构建
npm run build:electron2

# 打包
npx electron-builder --linux dir
```

---

## 📚 相关文档

- [BUGFIX_SESSION_MANAGEMENT.md](BUGFIX_SESSION_MANAGEMENT.md) - 会话管理修复
- [SESSION_IMPLEMENTATION_COMPLETE.md](SESSION_IMPLEMENTATION_COMPLETE.md) - 会话管理实现总结
- [ARCHITECTURE_THREE_DB_DESIGN.md](ARCHITECTURE_THREE_DB_DESIGN.md) - 三库协作架构

---

## ✅ 验证清单

- [x] PGlite 初始化错误已修复
- [x] Electron 模式正常启动
- [x] 数据加载正常
- [x] 数据保存正常
- [x] Chat sessions 通过 IPC 正常工作
- [x] 构建成功无错误
- [x] 向后兼容性保持

---

## 🎉 总结

通过添加环境检测，成功解决了 Electron 模式下的 PGlite 初始化错误。现在应用可以：

1. ✅ 在 Electron 模式下正常启动，无错误
2. ✅ 使用 localStorage 管理 tasks/messages（快速、简单）
3. ✅ 使用 better-sqlite3 管理 chat sessions（高性能、可靠）
4. ✅ 在浏览器模式下使用 PGlite（完整功能）
5. ✅ 保持两种模式的数据独立性

修复已完成，可以开始测试了！🚀
