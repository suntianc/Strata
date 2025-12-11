# 三库联动完整指南

**日期**: 2025-12-11
**状态**: ✅ 已实现并测试

---

## 📊 架构概览

Strata 使用三个数据库协同工作，提供强大的数据管理和检索能力：

```
┌─────────────────────────────────────────────────────────┐
│                    Strata 应用                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   SQLite     │  │   LanceDB    │  │   KuzuDB     │ │
│  │  (PGlite)    │  │   (向量)     │  │   (图)       │ │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤ │
│  │ • 任务       │  │ • 消息向量   │  │ • 任务节点   │ │
│  │ • 消息       │  │ • 文档向量   │  │ • 消息节点   │ │
│  │ • 会话       │  │ • 语义搜索   │  │ • 关系查询   │ │
│  │ • 附件       │  │ • 相似度     │  │ • 图遍历     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 三库职责

### 1. SQLite (better-sqlite3)

**文件**: `electron/db/pg.ts`

**职责**: 结构化数据存储和快速查询

**表结构**:
- `tasks` - 任务和项目
- `messages` - 研究笔记
- `message_tags` - 标签
- `attachments` - 附件
- `chat_sessions` - 会话
- `chat_messages` - 对话消息

**特点**:
- ✅ ACID 事务保证
- ✅ WAL 模式（高性能）
- ✅ 本地文件存储
- ✅ SQL 查询能力

### 2. LanceDB (向量数据库)

**文件**: `electron/db/vector.ts`

**职责**: 语义搜索和相似度匹配

**数据结构**:
```typescript
{
  id: string;
  vector: number[768];  // 向量维度
  text: string;
  metadata: {
    message_id: string;
    task_id?: string;
    source: 'text' | 'file';
  }
}
```

**特点**:
- ✅ 向量相似度搜索
- ✅ 语义理解
- ✅ 快速检索（ANN）
- ✅ 支持过滤条件

### 3. KuzuDB (图数据库)

**文件**: `electron/db/graph.ts`

**职责**: 复杂关系查询和图遍历

**节点类型**:
- `Task` - 任务节点
- `Message` - 消息节点
- `Tag` - 标签节点
- `Document` - 文档节点

**关系类型**:
- `PARENT_OF` - 任务层级
- `BELONGS_TO` - 消息归属
- `HAS_TAG` - 标签关系
- `HAS_DOC` - 文档关系
- `REFERS_TO` - 消息引用

**特点**:
- ✅ 图遍历查询
- ✅ 路径查找
- ✅ 关系分析
- ✅ Cypher 查询语言

---

## 🔄 数据流程

### 消息创建流程

```
用户创建消息
    ↓
MessageService.create()
    ├─ 1. 保存到 SQLite
    │   └─ INSERT INTO messages
    │
    ├─ 2. 创建图节点 (KuzuDB)
    │   ├─ CREATE (m:Message)
    │   ├─ CREATE (m)-[:BELONGS_TO]->(t:Task)
    │   └─ CREATE (m)-[:HAS_TAG]->(tag:Tag)
    │
    └─ 3. 异步摄取 (IngestionService)
        ├─ 文本分块 (RecursiveCharacterTextSplitter)
        ├─ 生成 embeddings (Ollama/Gemini)
        ├─ 存储到 LanceDB
        └─ LLM 标签提取
```

### 会话对话流程

```
用户发送 Copilot 消息
    ↓
RightPanel.handleSend()
    ├─ 1. 自动创建会话（如果不存在）
    │   └─ SessionManager.createSession()
    │
    ├─ 2. 保存用户消息
    │   └─ INSERT INTO chat_messages
    │
    ├─ 3. 调用 LLM
    │   └─ Gemini/Ollama API
    │
    └─ 4. 保存 AI 回复
        └─ INSERT INTO chat_messages
```

### 语义搜索流程

```
用户搜索 "机器学习"
    ↓
1. 生成查询向量
    └─ embeddings.embedQuery("机器学习")
    ↓
2. LanceDB 向量搜索
    └─ table.search(queryVector).limit(10)
    ↓
3. 返回相似消息
    └─ 按相似度排序
```

---

## 🛠️ 核心服务

### 1. MessageService

**文件**: `electron/services/messageService.ts`

**方法**:
- `create()` - 创建消息
- `getByTask()` - 获取任务消息
- `update()` - 更新消息
- `archive()` - 归档消息

### 2. IngestionService

**文件**: `electron/services/ingestion.ts`

**方法**:
- `ingestMessage()` - 完整摄取流程
- `reingestMessage()` - 重新摄取
- `analyzeMessage()` - 分析消息
- `suggestInboxOrganization()` - 智能收件箱

**功能**:
- ✅ 文档解析
- ✅ 文本分块
- ✅ 向量化
- ✅ 标签提取
- ✅ 智能组织

### 3. SessionManager

**文件**: `electron/services/sessionManager.ts`

**方法**:
- `createSession()` - 创建会话
- `getOrCreateSession()` - 获取或创建
- `listSessions()` - 列出会话
- `deleteSession()` - 删除会话
- `addMessage()` - 添加消息
- `getSessionMessages()` - 获取消息

### 4. EmbeddingService

**文件**: `electron/services/embeddingService.ts`

**方法**:
- `initialize()` - 初始化模型
- `generateEmbedding()` - 生成单个向量
- `generateEmbeddings()` - 批量生成
- `cosineSimilarity()` - 计算相似度

**模型**: Xenova/all-MiniLM-L6-v2 (384维)

---

## 🚀 快速开始

### 1. 环境配置

#### 选项 A: 使用 Ollama（本地）

```bash
# 安装 Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 下载模型
ollama pull llama3.2
ollama pull nomic-embed-text

# 启动服务
ollama serve

# 配置 .env
echo "LLM_PROVIDER=ollama" > .env
```

#### 选项 B: 使用 Gemini（云端）

```bash
# 配置 .env
echo "LLM_PROVIDER=gemini" > .env
echo "GEMINI_API_KEY=your_key_here" >> .env
```

### 2. 启动应用

```bash
npm run dev:electron2
```

### 3. 验证初始化

查看控制台输出：

```
✅ 预期输出：
[Main] Initializing databases...
[PGlite] ✅ Database initialized
[LanceDB] ✅ Database initialized
[KuzuDB] ✅ Database initialized
[Main] Databases initialized successfully
```

---

## 🧪 测试指南

### 测试 1: 消息创建和向量化

**步骤**:
1. 创建一个 Project
2. 输入消息：`这是一条关于人工智能的测试消息`
3. 点击发送

**验证**:
```
✅ 控制台输出：
[MessageService] Creating message...
[PGlite] Message inserted: msg-xxx
[KuzuDB] Created message node: msg-xxx
[Ingestion] Starting ingestion...
[LanceDB] Inserted 1 vectors
[Ingestion] ✅ Completed
```

### 测试 2: 会话管理

**步骤**:
1. 选择一个 Project
2. 打开 Copilot 面板
3. 点击 "+" 创建新会话
4. 发送消息

**验证**:
```
✅ 控制台输出：
[SessionManager] Creating session...
[PGlite] Session created: session-xxx
[SessionManager] Adding message...
```

### 测试 3: 语义搜索

**步骤**:
1. 创建多条相关消息
2. 在开发者工具中执行：

```javascript
const results = await window.electron.ipcRenderer.invoke(
  'searchMessages',
  '机器学习',
  { taskId: 'your-task-id' }
);
console.log('Search results:', results);
```

**验证**:
- ✅ 返回相关消息
- ✅ 按相似度排序

### 测试 4: 智能收件箱

**步骤**:
1. 在收件箱创建消息
2. 执行：

```javascript
const suggestions = await window.electron.ipcRenderer.invoke(
  'getInboxSuggestions'
);
console.log('Suggestions:', suggestions);
```

**验证**:
- ✅ 返回组织建议
- ✅ 置信度 > 0.85

---

## 📊 性能基准

| 操作 | 预期时间 | 说明 |
|------|---------|------|
| 数据库初始化 | < 2s | 首次启动 |
| 消息创建 | < 100ms | 同步操作 |
| 向量化 | 1-3s | 异步操作 |
| 语义搜索 | < 500ms | 10条消息 |
| 图查询 | < 200ms | 深度3层 |
| 智能组织 | 2-5s | 10条收件箱消息 |

---

## 🔍 调试技巧

### 查看数据库内容

#### SQLite
```bash
sqlite3 ~/.config/"Strata OS"/strata.db "SELECT * FROM chat_sessions;"
```

#### LanceDB
查看控制台日志：
```
[LanceDB] Inserted 5 vectors
[LanceDB] Total vectors: 25
```

#### KuzuDB
查看控制台日志：
```
[KuzuDB] Created message node: msg-xxx
[KuzuDB] Linked message to task: task-xxx
```

### 开发者工具

```javascript
// 测试消息创建
await window.electron.ipcRenderer.invoke('createMessage', {
  content: '测试消息',
  tags: ['test'],
  taskId: 'task-id'
});

// 测试会话列表
await window.electron.ipcRenderer.invoke('session:list', 'project', 'proj-id');
```

---

## 🐛 常见问题

### 问题 1: 向量化失败

**症状**: `[Ingestion] Failed for message`

**解决方案**:
1. 检查 LLM 配置（.env 文件）
2. 确认 Ollama 服务运行中
3. 或使用 Gemini API Key

### 问题 2: 数据库初始化失败

**解决方案**:
```bash
# 删除旧数据库
rm -rf ~/.config/"Strata OS"/

# 重新启动
npm run dev:electron2
```

### 问题 3: 语义搜索无结果

**原因**: 消息尚未完成向量化

**解决方案**: 等待几秒后重试

---

## 🎯 下一步开发

### Phase 1: RAG 增强 ✅
- [x] 基础向量存储
- [x] 语义搜索
- [ ] 上下文检索服务
- [ ] 引用和溯源

### Phase 2: 文档解析
- [ ] PDF 解析
- [ ] DOCX 解析
- [ ] 图片 OCR
- [ ] 代码文件解析

### Phase 3: 高级功能
- [ ] 多模态搜索
- [ ] 知识图谱可视化
- [ ] 智能推荐
- [ ] 协作功能

---

## 📚 相关文档

- [ARCHITECTURE_THREE_DB_DESIGN.md](../architecture/ARCHITECTURE_THREE_DB_DESIGN.md) - 详细架构设计
- [SESSION_IMPLEMENTATION_COMPLETE.md](../architecture/SESSION_IMPLEMENTATION_COMPLETE.md) - 会话实现
- [WINDOWS_BUILD_GUIDE.md](WINDOWS_BUILD_GUIDE.md) - Windows 构建指南

---

## ✅ 总结

三库联动架构已经完整实现：

- ✅ SQLite - 结构化数据存储
- ✅ LanceDB - 语义搜索
- ✅ KuzuDB - 图关系查询
- ✅ 数据同步机制
- ✅ 智能摄取服务
- ✅ 会话管理系统

**现在可以开始使用和测试了！** 🚀
