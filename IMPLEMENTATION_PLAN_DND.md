# 拖拽功能实现计划

**日期**: 2025-12-11
**功能**: 拖拽排序 + 消息转任务 + 任务创建增强

---

## 🎯 需求分析

### 1. 左侧菜单事项拖拽排序
**需求**: 用户可以拖拽侧边栏中的项目/任务进行重新排序

**技术方案**:
- 使用 `@dnd-kit/core` 和 `@dnd-kit/sortable`
- 在 Sidebar 组件中包装 `DndContext`
- 每个 TreeNode 使用 `useSortable` hook
- 实现 `handleDragEnd` 来更新任务顺序

**实现难点**:
- 嵌套树形结构的拖拽
- 跨层级拖拽支持
- 保持展开/折叠状态

### 2. 消息拖拽转为任务
**需求**:
- 从消息流拖拽消息到左侧任务节点
- 消息变成该节点的子任务
- 如果消息有附件，创建包含附件的新消息
- 如果消息内容>30字符，使用LLM生成短标题

**技术方案**:
- MessageCard 作为可拖拽项 (`useDraggable`)
- TreeNode 作为放置目标 (`useDroppable`)
- 实现 `handleMessageDrop` 处理转换逻辑
- 调用 LLM 服务生成标题（如需要）

**数据流**:
```
1. 用户拖拽消息到任务节点
2. 检查消息内容长度
   - ≤ 30字符: 使用原内容作为标题
   - > 30字符: 调用 LLM 生成标题
3. 创建新任务节点
4. 如果有附件:
   - 创建新消息，内容=原消息内容
   - 附件=原消息附件
   - projectId=新任务ID
5. 删除或归档原消息
```

### 3. 任务创建时添加描述和附件
**需求**:
- 创建任务时，除标题外，还可以添加描述和上传附件
- 描述和附件作为该任务的第一条消息

**技术方案**:
- 扩展 Sidebar 的"添加任务"UI
- 添加描述输入框（textarea）
- 添加附件上传按钮（复用 MessageStream 的文件上传逻辑）
- 创建任务时，如果有描述/附件，自动创建首条消息

**UI 设计**:
```
当前: [图标] [输入框: "Enter task name..."] [✓] [X]

改进:
┌──────────────────────────────────────┐
│ [图标] Task Name                      │
│ [Description...]                      │
│ [Attachments: file1.pdf]              │
│ [Paperclip] [✓] [X]                  │
└──────────────────────────────────────┘
```

---

## 📋 实现步骤

### Phase 1: 侧边栏拖拽排序 (2-3小时)

1. **安装依赖** ✅
   ```bash
   npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
   ```

2. **更新 Sidebar.tsx**
   - 导入 DndKit 组件
   - 包装 `<DndContext>`
   - 实现 `handleDragEnd`
   - 添加拖拽指示器

3. **更新 TreeNode**
   - 使用 `useSortable` hook
   - 添加拖拽手柄样式
   - 实现拖拽预览

4. **更新 App.tsx**
   - 添加 `handleReorderTasks` 函数
   - 处理嵌套树的重新排序

### Phase 2: 消息转任务 (3-4小时)

1. **扩展 types.ts**
   ```typescript
   interface Message {
     // 现有字段...
     isDraggable?: boolean; // 标记是否可拖拽
   }
   ```

2. **更新 MessageCard (MessageStream.tsx)**
   - 使用 `useDraggable` hook
   - 添加拖拽手柄图标
   - 实现拖拽样式

3. **更新 TreeNode (Sidebar.tsx)**
   - 使用 `useDroppable` hook
   - 添加放置区高亮
   - 显示"放置此处转为任务"提示

4. **创建 LLM 标题生成服务**
   - 在 `services/geminiService.ts` 添加 `generateTaskTitle`
   - 输入: 消息内容
   - 输出: 简短标题 (≤30字符)

5. **实现转换逻辑 (App.tsx)**
   ```typescript
   const handleMessageToTask = async (
     messageId: string,
     targetTaskId: string
   ) => {
     const message = messages.find(m => m.id === messageId);
     if (!message) return;

     // 生成标题
     let title = message.content;
     if (title.length > 30) {
       title = await generateTaskTitle(title);
     }

     // 创建任务
     const newTask: TaskNode = {
       id: `task-${Date.now()}`,
       title,
       status: 'pending',
       children: []
     };

     // 如果有附件，创建首条消息
     if (message.attachments.length > 0) {
       const firstMessage: Message = {
         id: `msg-${Date.now()}`,
         content: message.content,
         timestamp: new Date(),
         version: 1,
         author: 'user',
         tags: message.tags,
         attachments: message.attachments,
         projectId: newTask.id
       };
       setMessages(prev => [firstMessage, ...prev]);
     }

     // 添加任务到目标节点
     handleAddTaskToNode(targetTaskId, newTask);

     // 归档原消息
     handleArchiveMessage(messageId);
   };
   ```

### Phase 3: 任务创建增强 (2-3小时)

1. **扩展 TreeNode 组件状态**
   ```typescript
   const [newTaskTitle, setNewTaskTitle] = useState('');
   const [newTaskDescription, setNewTaskDescription] = useState('');
   const [newTaskAttachments, setNewTaskAttachments] = useState<Attachment[]>([]);
   ```

2. **创建扩展输入 UI**
   - 标题输入框
   - 描述 textarea (可选)
   - 附件上传按钮
   - 附件预览卡片

3. **复用文件上传逻辑**
   - 从 MessageStream 提取 `handleFileSelect` 到工具函数
   - 在 TreeNode 中复用

4. **更新 handleAddTask**
   ```typescript
   const handleAddTask = () => {
     const newTask: TaskNode = {
       id: `task-${Date.now()}`,
       title: newTaskTitle.trim(),
       status: 'pending',
       children: []
     };

     // 创建首条消息（如果有描述或附件）
     if (newTaskDescription || newTaskAttachments.length > 0) {
       const firstMessage: Message = {
         id: `msg-${Date.now()}`,
         content: newTaskDescription || '(Initial task setup)',
         timestamp: new Date(),
         version: 1,
         author: 'user',
         tags: [],
         attachments: newTaskAttachments,
         projectId: newTask.id
       };
       onAddMessage(firstMessage);
     }

     onAddTask(parentId, newTask);

     // 清空状态
     setNewTaskTitle('');
     setNewTaskDescription('');
     setNewTaskAttachments([]);
     setIsAddingTask(false);
   };
   ```

---

## 🚧 技术挑战

### 1. 嵌套树拖拽
**问题**: @dnd-kit 默认不支持嵌套树形结构

**解决方案**:
- 使用扁平化数组 + indentation 方式
- 或使用 `@dnd-kit/sortable` 的 tree 示例作为参考
- 自定义 `collision detection` 算法

### 2. 跨组件拖拽
**问题**: MessageStream 和 Sidebar 是不同组件

**解决方案**:
- 在 App.tsx 级别创建全局 `DndContext`
- MessageCard 和 TreeNode 都在同一个 DndContext 下

### 3. LLM 标题生成延迟
**问题**: LLM 调用可能需要几秒钟

**解决方案**:
- 显示加载指示器
- 使用临时标题（如 "New Task..."）
- LLM 完成后更新标题

---

## 📁 需要修改的文件

1. **types.ts**
   - 扩展 Message 接口 (isDraggable)

2. **App.tsx**
   - 添加全局 DndContext
   - 实现 handleReorderTasks
   - 实现 handleMessageToTask
   - 传递新的 props 到子组件

3. **components/Sidebar.tsx**
   - 集成 useSortable
   - 实现拖拽排序
   - 实现放置目标（接收消息）

4. **components/MessageStream.tsx**
   - MessageCard 集成 useDraggable
   - 添加拖拽手柄

5. **services/geminiService.ts**
   - 添加 generateTaskTitle 函数

---

## ⏱️ 预估时间

| 功能 | 预估时间 | 难度 |
|------|---------|------|
| 侧边栏拖拽排序 | 2-3 小时 | ⭐⭐⭐ |
| 消息转任务 | 3-4 小时 | ⭐⭐⭐⭐ |
| 任务创建增强 | 2-3 小时 | ⭐⭐ |
| **总计** | **7-10 小时** | - |

---

## 🎯 下一步行动

由于这是一个大型功能，建议用户选择:

**选项 A**: 全部实现 (7-10小时)
- 完整的拖拽功能
- 最佳用户体验

**选项 B**: 分阶段实现
- Phase 1: 侧边栏拖拽排序 (先实现)
- Phase 2-3: 后续迭代

**选项 C**: 简化方案
- 仅实现侧边栏拖拽排序
- 消息转任务使用右键菜单（非拖拽）
- 任务创建保持简单（仅标题）

**建议**: 由于项目复杂度，建议先从 Phase 1 (侧边栏拖拽排序) 开始，确认用户满意后再继续。
