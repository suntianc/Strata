# Strata OS - 实施指南

## 项目架构迁移概览

本项目已从纯 Web 应用架构迁移到 **Electron + 三大数据库** 架构。主要改造如下：

### 已完成的核心架构

#### 1. Electron 双进程架构 ✅

**主进程 (Main Process)**
- 入口: `electron/main.ts`
- 职责: 窗口管理、数据库初始化、IPC 处理

**预加载脚本 (Preload)**
- 文件: `electron/preload.ts`
- 职责: 通过 contextBridge 暴露安全的 API

**渲染进程 (Renderer)**
- 原有 React 组件保持不变
- 通过 `window.strataAPI` 调用主进程功能

#### 2. 三大数据库集成 ✅

**PGlite (关系型数据库)** - `electron/db/pg.ts`
- 存储: tasks, messages, attachments, tags
- 功能: CRUD 操作、版本控制、关系查询
- Schema: 完整的表结构和索引

**LanceDB (向量数据库)** - `electron/db/vector.ts`
- 存储: 文本片段的向量表示
- 功能: 语义搜索、相似度检索
- 支持: Metadata 过滤、任务范围检索

**KuzuDB (图数据库)** - `electron/db/graph.ts`
- 存储: 任务层级、消息关系、标签链接
- 功能: 复杂图查询、关系推理
- Schema: Task, Message, Tag, Document 节点及关系

#### 3. 业务服务层 ✅

**MessageService** - `electron/services/messageService.ts`
- 消息的完整 CRUD
- 跨数据库同步（PGlite + KuzuDB）
- 自动触发向量化摄入

**TaskService** - `electron/services/taskService.ts`
- 任务树管理
- 层级结构维护
- 状态更新

**IngestionService** - `electron/services/ingestion.ts`
- 文档解析（PDF, DOCX）
- 文本分块（LangChain）
- 向量化（Ollama Embeddings）
- 标签提取（LLM）
- Inbox 智能归类

**RetrievalService** - `electron/services/retrieval.ts`
- 混合检索（Vector + Graph）
- RRF 结果融合
- RAG 对话生成

#### 4. React 集成层 ✅

**IPC Hooks** - `hooks/useStrataAPI.ts`
- `useMessages()`: 消息操作
- `useTasks()`: 任务管理
- `useChat()`: AI 对话
- `useInboxOrganization()`: 智能归类
- `useSearch()`: 混合搜索

**Electron App** - `App.electron.tsx`
- 使用 IPC hooks 替代 mock 数据
- 完整的错误处理
- Loading 状态管理

---

## 下一步实施计划

### 阶段 1: 依赖安装和环境配置 🔄

```bash
# 安装所有依赖
npm install

# 如果遇到版本冲突，使用 --legacy-peer-deps
npm install --legacy-peer-deps

# 安装 Ollama（用于本地 AI）
# 访问 https://ollama.ai 下载并安装

# 拉取所需模型
ollama pull llama3.2
ollama pull nomic-embed-text
```

### 阶段 2: 类型声明修复

某些库可能缺少 TypeScript 类型定义，需要创建声明文件：

```typescript
// types/global.d.ts
declare module '@lancedb/lancedb' {
  export function connect(path: string): Promise<Connection>;
  export interface Connection {
    openTable(name: string): Promise<Table>;
    createTable(name: string, data: any[]): Promise<Table>;
  }
  export interface Table {
    add(data: any[]): Promise<void>;
    search(vector: number[]): SearchQuery;
    delete(filter: string): Promise<void>;
  }
  export interface SearchQuery {
    limit(n: number): SearchQuery;
    where(filter: string): SearchQuery;
    execute(): Promise<any[]>;
  }
}

declare module 'kuzu' {
  export class Database {
    constructor(path: string);
  }
  export class Connection {
    constructor(db: Database);
    query(sql: string, params?: any): Promise<any>;
  }
  export default { Database, Connection };
}
```

### 阶段 3: 切换到 Electron 应用

1. **重命名原始 App.tsx 为备份**
```bash
mv App.tsx App.web.tsx
mv App.electron.tsx App.tsx
```

2. **更新 index.html**
确保 `index.html` 中的脚本标签正确：
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Strata OS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>
```

3. **测试启动**
```bash
# 只启动 Vite（用于调试 UI）
npm run dev

# 启动 Electron 应用
npm run dev:electron
```

### 阶段 4: 功能验证测试

按优先级测试各功能：

1. **数据库初始化测试**
   - 启动应用，检查控制台日志
   - 验证 `~/.config/Strata OS/` 目录下数据库文件已创建

2. **基础 CRUD 测试**
   - 创建一个任务
   - 在任务中创建消息
   - 编辑消息内容
   - 归档消息

3. **向量搜索测试**
   - 创建多条消息
   - 使用搜索功能
   - 验证语义相关性

4. **AI 功能测试**
   - 测试 Inbox 智能归类
   - 测试 RAG 对话
   - 验证标签自动提取

### 阶段 5: UI 组件适配

现有组件可能需要的小调整：

1. **MessageStream 组件**
   - 添加文件选择器（用于附件）
   - 显示 Loading 状态
   - 错误提示优化

2. **RightPanel 组件**
   - 集成 `useChat()` hook
   - 实现流式响应显示

3. **Sidebar 组件**
   - 实时更新 inbox 计数

### 阶段 6: 生产构建

```bash
# 构建 Electron 应用
npm run build

# 打包成可执行文件
npm run build:electron
```

---

## 技术架构图

```
┌─────────────────────────────────────────────────────────────┐
│                      Renderer Process                       │
│  ┌───────────┐  ┌───────────┐  ┌────────────┐             │
│  │  Sidebar  │  │MessageStr │  │RightPanel  │             │
│  └─────┬─────┘  └─────┬─────┘  └──────┬─────┘             │
│        │              │                 │                    │
│        └──────────────┴─────────────────┘                    │
│                       │                                      │
│              ┌────────▼────────┐                            │
│              │  IPC Hooks      │                            │
│              │ (useStrataAPI)  │                            │
│              └────────┬────────┘                            │
│                       │                                      │
└───────────────────────┼──────────────────────────────────────┘
                        │ IPC Bridge (contextBridge)
┌───────────────────────▼──────────────────────────────────────┐
│                      Main Process                            │
│  ┌────────────────────────────────────────────────────┐     │
│  │              IPC Handlers (main.ts)                │     │
│  └───┬────────────┬────────────┬────────────┬────────┘     │
│      │            │            │            │               │
│  ┌───▼───┐   ┌───▼───┐   ┌───▼───┐   ┌───▼────┐          │
│  │Message│   │ Task  │   │Ingest │   │Retriev │          │
│  │Service│   │Service│   │Service│   │Service │          │
│  └───┬───┘   └───┬───┘   └───┬───┘   └───┬────┘          │
│      │           │           │           │                 │
│  ┌───▼───────────▼───────────▼───────────▼────┐           │
│  │         Database Layer                      │           │
│  │  ┌────────┐  ┌─────────┐  ┌─────────┐     │           │
│  │  │PGlite  │  │LanceDB  │  │ KuzuDB  │     │           │
│  │  └────────┘  └─────────┘  └─────────┘     │           │
│  └──────────────────────────────────────────  │           │
└───────────────────────────────────────────────────────────  ┘
```

---

## 核心数据流

### 1. 消息创建流程

```
User Input (UI)
    ↓
createMessage(content, tags, files)
    ↓
MessageService.create()
    ├─→ PGlite: INSERT messages, attachments, tags
    ├─→ KuzuDB: CREATE (m:Message), relationships
    └─→ IngestionService.ingestMessage() [async]
            ├─→ Parse files (LlamaIndexTS)
            ├─→ Chunk text (LangChain)
            ├─→ Generate embeddings (Ollama)
            ├─→ LanceDB: INSERT vectors
            └─→ Extract tags (LLM) → KuzuDB
```

### 2. 混合检索流程

```
User Query
    ↓
RetrievalService.search(query, scope)
    ├─→ Vector Search (LanceDB)
    │       └─→ embedQuery() → searchVectors()
    ├─→ Graph Search (KuzuDB)
    │       └─→ findMessagesByTag()
    ├─→ RRF Fusion
    │       └─→ mergeResults() → ranked IDs
    └─→ PGlite: Fetch full messages
            └─→ Return Message[]
```

### 3. Inbox 智能归类流程

```
User clicks "Organize Inbox"
    ↓
IngestionService.suggestInboxOrganization()
    ├─→ Get inbox messages (PGlite)
    ├─→ Get active tasks (PGlite)
    ├─→ For each message:
    │       ├─→ embedQuery(message.content)
    │       ├─→ For each task:
    │       │       ├─→ getTaskCenterVector(taskId)
    │       │       └─→ cosineSimilarity(msgVec, taskVec)
    │       └─→ If similarity > 0.85: add suggestion
    └─→ Return InboxSuggestion[]
```

---

## 常见问题排查

### 1. 数据库连接失败
- 检查 `userData` 目录权限
- Linux: `~/.config/Strata OS/`
- macOS: `~/Library/Application Support/Strata OS/`
- Windows: `%APPDATA%/Strata OS/`

### 2. Ollama 连接失败
```bash
# 检查 Ollama 是否运行
curl http://localhost:11434/api/tags

# 启动 Ollama
ollama serve
```

### 3. IPC 通信失败
- 确保 `preload.ts` 已正确编译
- 检查 `contextBridge` 是否正确暴露
- 在渲染进程中检查 `window.strataAPI` 是否存在

### 4. TypeScript 类型错误
- 为缺少类型的库创建 `.d.ts` 声明文件
- 使用 `// @ts-ignore` 临时绕过（不推荐）

---

## 性能优化建议

### 数据库优化
1. PGlite: 定期 VACUUM 清理
2. LanceDB: 定期 Optimize 索引
3. KuzuDB: 限制递归查询深度

### 向量化优化
1. 批量处理文档（避免逐个处理）
2. 使用较小的 chunk_size（减少内存占用）
3. 异步摄入（不阻塞 UI）

### UI 优化
1. 虚拟滚动（MessageStream 长列表）
2. 懒加载附件（按需下载）
3. 防抖搜索输入

---

## 扩展方向

1. **多模态支持**
   - 图片识别（OCR）
   - 音频转录

2. **协作功能**
   - 实时同步（CRDTs）
   - 版本冲突解决

3. **插件系统**
   - 自定义数据源
   - 自定义 AI 模型

4. **云端备份**
   - 加密备份到云存储
   - 增量同步

---

## 参考资源

- [Electron 文档](https://www.electronjs.org/docs/latest)
- [PGlite](https://github.com/electric-sql/pglite)
- [LanceDB](https://lancedb.com/)
- [KuzuDB](https://kuzudb.com/)
- [LangChain.js](https://js.langchain.com/)
- [Ollama](https://ollama.ai/)

---

## 贡献者

如需帮助或有问题，请查看 GitHub Issues 或加入讨论。
