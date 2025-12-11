# Strata 业务逻辑完整文档

**版本**: 1.0.0
**日期**: 2025-12-11
**状态**: ✅ 已实现

---

## 📋 目录

1. [项目概述](#项目概述)
2. [核心业务场景](#核心业务场景)
3. [数据模型](#数据模型)
4. [业务流程](#业务流程)
5. [功能模块](#功能模块)
6. [用户交互](#用户交互)
7. [AI 能力](#ai-能力)
8. [数据持久化](#数据持久化)

---

## 项目概述

### 产品定位

**Strata** 是一个基于 Electron 的 **AI 驱动的研究管理和笔记应用**，专为研究人员、学者和知识工作者设计。

### 核心价值

1. **层级化项目管理** - 支持无限层级的项目/任务树结构
2. **智能笔记系统** - 带标签、附件、版本控制的研究笔记
3. **AI Copilot** - 基于上下文的智能对话助手
4. **三库协作** - SQLite + LanceDB + KuzuDB 提供强大的数据管理能力
5. **语义搜索** - 基于向量的智能内容检索
6. **智能收件箱** - AI 自动组织和分类笔记

### 技术架构

```
┌─────────────────────────────────────────────────────────┐
│                    Strata Desktop App                    │
├─────────────────────────────────────────────────────────┤
│  Frontend (React 19)                                     │
│  ├─ Sidebar (项目树)                                     │
│  ├─ MessageStream (笔记流)                               │
│  └─ RightPanel (Info/Copilot)                           │
├─────────────────────────────────────────────────────────┤
│  Backend (Electron Main Process)                         │
│  ├─ SQLite (better-sqlite3) - 结构化数据                │
│  ├─ LanceDB - 向量存储                                   │
│  ├─ KuzuDB - 图数据库                                    │
│  └─ LLM Integration (Gemini/Ollama)                     │
└─────────────────────────────────────────────────────────┘
```

---

## 核心业务场景

### 场景 1: 研究项目管理

**用户故事**: 作为研究人员，我需要管理多个研究项目，每个项目包含多个子任务和研究笔记。

**业务流程**:
1. 创建研究项目（如"AI 伦理研究"）
2. 在项目下创建子任务（如"文献综述"、"实验设计"）
3. 为每个任务添加研究笔记
4. 使用标签组织笔记（如 #ethics, #survey）
5. 附加文档（PDF 论文、Excel 数据）

**涉及功能**:
- 项目树管理
- 任务状态跟踪（pending/active/blocked/completed）
- 笔记创建和编辑
- 标签系统
- 附件管理

---

### 场景 2: 智能笔记收集

**用户故事**: 作为用户，我需要快速记录想法和发现，稍后再整理到具体项目中。

**业务流程**:
1. 在收件箱（Inbox）快速创建笔记
2. 添加标签和附件
3. AI 自动分析笔记内容
4. AI 建议将笔记归类到相关项目
5. 用户确认或调整分类
6. 笔记移动到目标项目

**涉及功能**:
- 收件箱（Inbox）
- 快速笔记创建
- AI 标签提取
- 智能收件箱组织
- 拖拽移动笔记

---

### 场景 3: AI 辅助研究

**用户故事**: 作为研究人员，我需要 AI 帮助我分析项目内容、回答问题、提供建议。

**业务流程**:
1. 选择项目或任务作为上下文
2. 打开 Copilot 面板
3. 创建对话会话
4. 提出问题（如"总结这个项目的主要发现"）
5. AI 基于项目内容回答
6. 会话历史自动保存
7. 可以创建多个会话讨论不同主题

**涉及功能**:
- 上下文感知对话
- 多会话管理
- 会话持久化
- LLM 集成（Gemini/Ollama）
- RAG（检索增强生成）

---

### 场景 4: 语义搜索和知识发现

**用户故事**: 作为用户，我需要找到与特定主题相关的所有笔记，即使它们使用不同的词汇。

**业务流程**:
1. 输入搜索查询（如"机器学习伦理"）
2. 系统生成查询向量
3. 在 LanceDB 中进行向量搜索
4. 返回语义相关的笔记
5. 按相关性排序显示结果
6. 点击笔记查看详情

**涉及功能**:
- 向量化（Embedding）
- 语义搜索
- 相似度计算
- 搜索结果排序

---

### 场景 5: 知识图谱探索

**用户故事**: 作为研究人员，我需要了解不同笔记、任务、文档之间的关系。

**业务流程**:
1. 选择一个笔记或任务
2. 查看其关系图谱
3. 发现相关的笔记（通过引用、标签、项目）
4. 发现相关的文档
5. 追踪引用链
6. 探索知识网络

**涉及功能**:
- 图数据库查询
- 关系可视化
- 引用追踪
- 标签关联

---

### 场景 6: 协作和分享

**用户故事**: 作为团队成员，我需要导出研究成果并与他人分享。

**业务流程**:
1. 选择项目或笔记
2. 导出为 Markdown/PDF
3. 包含所有附件
4. 生成分享链接（未来功能）
5. 团队成员查看和评论（未来功能）

**涉及功能**:
- 导出功能
- 格式转换
- 附件打包

---

## 数据模型

### 核心实体

#### 1. TaskNode（任务/项目）

```typescript
interface TaskNode {
  id: string;                    // 唯一标识
  title: string;                 // 任务标题
  status: 'pending' | 'active' | 'blocked' | 'completed';
  children?: TaskNode[];         // 子任务（树结构）
  expanded?: boolean;            // UI 展开状态
}
```

**业务规则**:
- 支持无限层级嵌套
- 根节点为项目（Project）
- 子节点为任务（Task）
- 状态可以独立设置
- 删除父节点会级联删除所有子节点

#### 2. Message（研究笔记）

```typescript
interface Message {
  id: string;                    // 唯一标识
  content: string;               // 笔记内容（Markdown）
  timestamp: Date;               // 创建时间
  version: number;               // 版本号
  author: 'user' | 'system';     // 作者
  tags: string[];                // 标签列表
  attachments: Attachment[];     // 附件列表
  projectId?: string;            // 所属项目（null = Inbox）
  highlighted?: boolean;         // 是否高亮
  isArchived?: boolean;          // 是否归档
  suggestedProjectId?: string;   // AI 建议的项目
  relatedIds?: string[];         // 相关笔记 ID
}
```

**业务规则**:
- `projectId` 为 null 表示在收件箱
- 支持 Markdown 格式
- 版本号用于编辑历史
- 标签自动提取或手动添加
- 归档后不显示在主列表

#### 3. Attachment（附件）

```typescript
interface Attachment {
  id: string;
  type: 'pdf' | 'excel' | 'image' | 'code' | 'file';
  name: string;
  url?: string;                  // 文件路径
  data?: string;                 // base64 数据
  meta?: string;                 // 元信息（如"12 pages"）
}
```

**业务规则**:
- 支持多种文件类型
- 可以是本地文件或 base64 数据
- 自动提取元信息（页数、大小等）

#### 4. ChatSession（对话会话）

```typescript
interface ChatSession {
  id: string;
  contextType: 'message' | 'task' | 'project';
  contextId: string;             // 上下文实体 ID
  title: string;                 // 会话标题
  createdAt: string;
  updatedAt: string;
  lastActivity: string;
  messageCount?: number;
}
```

**业务规则**:
- 每个上下文可以有多个会话
- 会话标题可以自定义
- 自动更新最后活动时间
- 删除会话会级联删除所有消息

#### 5. ChatMessage（对话消息）

```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'model';        // 用户或 AI
  content: string;               // 消息内容
  citations?: string[];          // 引用的笔记 ID
  position?: number;             // 消息顺序
  createdAt?: string;
}
```

**业务规则**:
- 按 position 排序显示
- 支持引用笔记
- AI 回复可以包含引用

---

## 业务流程

### 流程 1: 项目创建流程

```
用户点击 "+" 创建项目
    ↓
输入项目标题
    ↓
（可选）添加描述和附件
    ↓
生成唯一 ID
    ↓
创建 TaskNode 对象
    ↓
添加到 tasks 数组
    ↓
保存到数据库
    ├─ SQLite: INSERT INTO tasks
    └─ KuzuDB: CREATE (t:Task)
    ↓
更新 UI 显示
```

### 流程 2: 笔记创建流程

```
用户在 MessageStream 输入内容
    ↓
添加标签和附件
    ↓
点击发送
    ↓
生成唯一 ID 和时间戳
    ↓
创建 Message 对象
    ↓
保存到数据库
    ├─ SQLite: INSERT INTO messages
    ├─ KuzuDB: CREATE (m:Message)-[:BELONGS_TO]->(t:Task)
    └─ 异步触发 IngestionService
        ├─ 文本分块
        ├─ 生成 embedding
        ├─ 存储到 LanceDB
        └─ AI 标签提取
    ↓
更新 UI 显示
```

### 流程 3: 智能收件箱组织流程

```
用户点击 "Organize Inbox"
    ↓
获取所有收件箱笔记
    ↓
获取所有活跃项目
    ↓
对每条笔记:
    ├─ 生成笔记向量
    ├─ 计算与每个项目的相似度
    ├─ 找到最佳匹配项目
    └─ 如果相似度 > 0.85，生成建议
    ↓
显示建议列表
    ↓
用户确认建议
    ↓
批量移动笔记到目标项目
    ├─ 更新 Message.projectId
    ├─ 更新 SQLite
    └─ 更新 KuzuDB 关系
    ↓
刷新 UI
```

### 流程 4: Copilot 对话流程

```
用户选择项目/任务作为上下文
    ↓
打开 Copilot 面板
    ↓
自动创建或加载会话
    ├─ 检查是否有现有会话
    ├─ 如果没有，创建新会话
    └─ 加载会话历史
    ↓
用户输入问题
    ↓
保存用户消息到 chat_messages
    ↓
构建 LLM 上下文
    ├─ 获取项目/任务信息
    ├─ 获取相关笔记（通过 projectId）
    ├─ （可选）语义搜索相关内容
    └─ 格式化为 LLM prompt
    ↓
调用 LLM API
    ├─ Gemini API
    └─ 或 Ollama 本地模型
    ↓
接收 AI 回复
    ↓
保存 AI 消息到 chat_messages
    ↓
更新会话 lastActivity
    ↓
显示在 UI
```

### 流程 5: 拖拽移动笔记流程

```
用户拖动笔记卡片
    ↓
DnD 系统检测拖动
    ↓
显示可放置的目标（项目/任务）
    ↓
用户释放到目标项目
    ↓
触发 onDragEnd 事件
    ↓
更新 Message.projectId
    ↓
保存到数据库
    ├─ SQLite: UPDATE messages SET project_id = ?
    └─ KuzuDB: 删除旧关系，创建新关系
    ↓
刷新 UI
    ├─ 从源列表移除
    └─ 添加到目标列表
```

---

## 功能模块

### 模块 1: 项目管理（Sidebar）

**功能列表**:
1. ✅ 项目树显示
2. ✅ 创建项目/任务
3. ✅ 编辑项目标题
4. ✅ 删除项目（带确认）
5. ✅ 项目状态管理
6. ✅ 展开/折叠子任务
7. ✅ 拖拽排序
8. ✅ 右键菜单
9. ✅ 收件箱计数显示
10. ✅ 搜索功能

**交互方式**:
- 单击：选择项目
- 双击：编辑标题
- 右键：打开上下文菜单
- 拖拽：重新排序
- Hover：显示操作按钮

**状态指示**:
- 🔵 Active（活跃）
- ⚪ Pending（待处理）
- 🔴 Blocked（阻塞）
- ✅ Completed（完成）

---

### 模块 2: 笔记流（MessageStream）

**功能列表**:
1. ✅ 笔记列表显示
2. ✅ 创建新笔记
3. ✅ 编辑笔记内容
4. ✅ 添加标签
5. ✅ 附加文件
6. ✅ 归档笔记
7. ✅ 拖拽移动笔记
8. ✅ AI 标签建议
9. ✅ 笔记搜索
10. ✅ 时间戳显示

**笔记卡片信息**:
- 内容预览（Markdown 渲染）
- 标签列表
- 附件列表
- 时间戳
- 所属项目（如果有）
- 操作按钮（编辑、归档、删除）

**附件类型支持**:
- 📄 PDF 文档
- 📊 Excel 表格
- 🖼️ 图片
- 💻 代码文件
- 📎 其他文件

---

### 模块 3: 信息面板（RightPanel - Info Mode）

**功能列表**:
1. ✅ 显示选中笔记详情
2. ✅ 显示相关笔记
3. ✅ 显示附件列表
4. ✅ 显示标签
5. ✅ 显示元数据（时间、版本）

**显示内容**:
- 完整笔记内容
- 所有附件（可点击打开）
- 标签云
- 相关笔记链接
- 创建/修改时间
- 版本历史

---

### 模块 4: AI Copilot（RightPanel - Copilot Mode）

**功能列表**:
1. ✅ 上下文感知对话
2. ✅ 多会话管理
3. ✅ 会话创建/删除
4. ✅ 会话重命名
5. ✅ 会话切换
6. ✅ 消息历史
7. ✅ 自动保存
8. ✅ 引用支持（未来）
9. ✅ 流式输出（未来）

**上下文类型**:
- **Project Context**: 包含项目下所有任务和笔记
- **Task Context**: 包含任务及其子任务的笔记
- **Message Context**: 仅包含单条笔记及其附件

**会话管理**:
- 每个上下文可以有多个会话
- 会话标题自动生成或手动设置
- 会话按最后活动时间排序
- 删除会话需要确认

---

### 模块 5: 设置（SettingsModal）

**功能列表**:
1. ✅ 用户配置
   - 姓名
   - 角色
   - 头像

2. ✅ LLM 配置
   - 提供商（Gemini/Ollama/OpenAI）
   - 模型名称
   - API Key
   - Base URL

3. ✅ Embedding 配置
   - 提供商
   - 模型名称
   - API Key

4. ✅ 主题设置
   - 深色模式
   - 浅色模式

5. ✅ 语言设置
   - 中文
   - English

---

## 用户交互

### 交互模式 1: 键盘快捷键

```
全局:
- Ctrl/Cmd + K: 快速搜索
- Ctrl/Cmd + N: 新建笔记
- Ctrl/Cmd + ,: 打开设置
- Ctrl/Cmd + /: 切换侧边栏

笔记编辑:
- Enter: 发送/保存
- Shift + Enter: 换行
- Esc: 取消编辑

导航:
- ↑/↓: 选择上/下一个项目
- ←/→: 折叠/展开项目
```

### 交互模式 2: 拖拽操作

**支持的拖拽场景**:
1. ✅ 拖拽笔记到项目（移动笔记）
2. ✅ 拖拽项目重新排序
3. ✅ 拖拽文件到笔记（添加附件）

**拖拽反馈**:
- 拖动时半透明显示
- 可放置区域高亮
- 放置后动画过渡

### 交互模式 3: 右键菜单

**项目右键菜单**:
- 重命名
- 添加子任务
- 更改状态
- 删除（带确认）
- 归档

**笔记右键菜单**:
- 编辑
- 复制
- 移动到...
- 归档
- 删除

---

## AI 能力

### AI 功能 1: 智能标签提取

**技术实现**:
```typescript
// 使用 LLM 分析笔记内容
const prompt = `分析以下文本并提取 3-5 个相关标签:
${content}

标签:`;

const tags = await llm.call(prompt);
```

**应用场景**:
- 创建笔记时自动建议标签
- 批量为旧笔记添加标签
- 标签标准化

### AI 功能 2: 智能收件箱组织

**技术实现**:
```typescript
// 1. 生成笔记向量
const noteEmbedding = await embeddings.embedQuery(note.content);

// 2. 计算与每个项目的相似度
for (const project of projects) {
  const projectVector = await getProjectCenterVector(project.id);
  const similarity = cosineSimilarity(noteEmbedding, projectVector);

  if (similarity > 0.85) {
    suggestions.push({
      noteId: note.id,
      projectId: project.id,
      confidence: similarity
    });
  }
}
```

**应用场景**:
- 自动整理收件箱
- 建议笔记归类
- 发现相关项目

### AI 功能 3: 上下文感知对话

**技术实现**:
```typescript
// 1. 收集上下文
const context = {
  project: getProject(contextId),
  tasks: getSubTasks(contextId),
  notes: getNotesByProject(contextId),
  documents: getDocuments(contextId)
};

// 2. 构建 prompt
const systemPrompt = `你是一个研究助手。当前上下文:
项目: ${context.project.title}
任务数: ${context.tasks.length}
笔记数: ${context.notes.length}

请基于以上信息回答用户问题。`;

// 3. 调用 LLM
const response = await llm.call([
  { role: 'system', content: systemPrompt },
  ...conversationHistory,
  { role: 'user', content: userQuestion }
]);
```

**应用场景**:
- 项目总结
- 问题解答
- 建议生成
- 文献综述

### AI 功能 4: 语义搜索

**技术实现**:
```typescript
// 1. 生成查询向量
const queryVector = await embeddings.embedQuery(searchQuery);

// 2. 在 LanceDB 中搜索
const results = await lancedb.search(queryVector)
  .filter({ project_id: currentProjectId })
  .limit(10)
  .execute();

// 3. 返回相关笔记
return results.map(r => ({
  noteId: r.metadata.message_id,
  similarity: r.score,
  content: r.text
}));
```

**应用场景**:
- 查找相关笔记
- 发现知识联系
- 文献检索

---

## 数据持久化

### 持久化策略

#### Electron 模式
```
Tasks & Messages: localStorage
├─ 快速读写
├─ 同步操作
└─ 简单可靠

Chat Sessions: SQLite (better-sqlite3)
├─ 结构化存储
├─ ACID 事务
└─ 高性能查询

Vectors: LanceDB
├─ 向量存储
├─ 语义搜索
└─ 异步更新

Graph: KuzuDB
├─ 关系存储
├─ 图遍历
└─ 复杂查询
```

#### 浏览器模式
```
All Data: PGlite (IndexedDB)
├─ 完整 PostgreSQL 功能
├─ 浏览器持久化
└─ 离线可用
```

### 数据同步

**保存时机**:
- 创建/编辑后立即保存
- 使用 useEffect 监听状态变化
- 自动保存，无需手动操作

**数据一致性**:
- SQLite 事务保证
- 三库异步同步
- 错误重试机制

---

## 总结

### 已实现功能 ✅

**核心功能**:
- ✅ 层级化项目管理
- ✅ 研究笔记系统
- ✅ 标签和附件
- ✅ 收件箱
- ✅ 拖拽操作
- ✅ 搜索功能

**AI 功能**:
- ✅ 智能标签提取
- ✅ 智能收件箱组织
- ✅ 上下文感知对话
- ✅ 多会话管理
- ✅ 语义搜索（基础）

**数据管理**:
- ✅ SQLite 持久化
- ✅ LanceDB 向量存储
- ✅ KuzuDB 图数据库
- ✅ 三库数据同步

**用户体验**:
- ✅ 深色/浅色主题
- ✅ 中英文支持
- ✅ 响应式设计
- ✅ 拖拽交互

### 待实现功能 🔄

**增强功能**:
- 🔄 完整的 RAG 上下文检索
- 🔄 引用和溯源
- 🔄 流式输出
- 🔄 文档解析（PDF/DOCX）
- 🔄 知识图谱可视化
- 🔄 导出功能
- 🔄 协作功能

**优化**:
- 🔄 性能优化
- 🔄 缓存策略
- 🔄 批量操作
- 🔄 快捷键完善

---

## 附录

### 数据库 Schema

详见：
- [docs/architecture/ARCHITECTURE_THREE_DB_DESIGN.md](architecture/ARCHITECTURE_THREE_DB_DESIGN.md)
- [docs/guides/THREE_DB_GUIDE.md](guides/THREE_DB_GUIDE.md)

### API 文档

详见：
- `electron/services/` - 后端服务
- `services/` - 前端 API

### 测试指南

详见：
- [QUICK_START.md](../QUICK_START.md)
- [docs/guides/THREE_DB_GUIDE.md](guides/THREE_DB_GUIDE.md)

---

**文档版本**: 1.0.0
**最后更新**: 2025-12-11
**维护者**: Strata Team
