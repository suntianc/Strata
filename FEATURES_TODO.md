# Strata 待实现功能清单

## 🎯 当前待修复问题

### 1. 添加项目/任务的 + 按钮未显示

**当前状态**: Sidebar 中"DEEP STRATA"区域缺少添加按钮

**需要实现**:
- [ ] 在 "DEEP STRATA" 标题旁添加 + 按钮
- [ ] 点击后显示输入框创建新项目
- [ ] 支持在项目下添加子任务
- [ ] 实现 hover 显示添加按钮的交互

**技术方案**:
```typescript
// Sidebar.tsx 需要添加的 props
interface SidebarProps {
  // ... 现有 props
  onAddProject: (title: string) => void;
  onAddTask: (parentId: string, title: string) => void;
}

// App.tsx 需要添加的handlers
const handleAddProject = (title: string) => {
  const newProject: TaskNode = {
    id: `project-${Date.now()}`,
    title,
    status: 'pending',
    children: []
  };
  setTasks(prev => [...prev, newProject]);
};
```

---

### 2. 鼠标操作能力缺失

#### 2.1 点击项目查看相关消息
**状态**: ✅ 已实现 (onSelectProject)

#### 2.2 右键点击项目查看更多操作
**当前状态**: 未实现

**需要实现**:
- [ ] 右键菜单组件 (ContextMenu)
- [ ] 重命名项目/任务
- [ ] 删除项目/任务
- [ ] 更改状态 (Active/Pending/Blocked/Completed)
- [ ] 归档项目

**技术方案**:
```typescript
// 创建 components/ContextMenu.tsx
interface ContextMenuProps {
  x: number;
  y: number;
  items: Array<{
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    danger?: boolean;
  }>;
  onClose: () => void;
}
```

#### 2.3 拖拽项目调整顺序
**当前状态**: 未实现

**需要实现**:
- [ ] 项目之间的拖拽排序
- [ ] 任务在不同项目间移动
- [ ] 拖拽时的视觉反馈

**技术方案**:
使用 `react-beautiful-dnd` 或原生 HTML5 Drag & Drop API

```typescript
// 使用 react-beautiful-dnd
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const handleDragEnd = (result: DropResult) => {
  if (!result.destination) return;

  const items = Array.from(tasks);
  const [reorderedItem] = items.splice(result.source.index, 1);
  items.splice(result.destination.index, 0, reorderedItem);

  setTasks(items);
};
```

---

### 3. 文件上传功能缺失

**当前状态**: MessageStream 显示附件,但无上传功能

**需要实现**:
- [ ] 点击附件图标打开文件选择器
- [ ] 支持拖拽上传文件
- [ ] 文件预览 (PDF, 图片, Excel)
- [ ] 文件大小限制和类型验证
- [ ] 上传进度显示

**技术方案**:
```typescript
// MessageStream.tsx 新增
const handleFileUpload = (files: FileList) => {
  const attachments: Attachment[] = Array.from(files).map(file => ({
    id: `att-${Date.now()}-${Math.random()}`,
    type: getFileType(file),
    name: file.name,
    meta: formatFileSize(file.size),
    data: file // 或转换为 base64/上传到服务器
  }));

  setSelectedAttachments(prev => [...prev, ...attachments]);
};

// 文件类型检测
const getFileType = (file: File): Attachment['type'] => {
  if (file.type.includes('pdf')) return 'pdf';
  if (file.type.includes('spreadsheet') || file.name.endsWith('.xlsx')) return 'excel';
  if (file.type.startsWith('image/')) return 'image';
  if (file.name.match(/\.(js|ts|py|java|cpp)$/)) return 'code';
  return 'other';
};
```

---

### 4. 自定义标签输入功能

**当前状态**: 标签显示正常,但无添加/编辑功能

**需要实现**:
- [ ] 输入时按 # 触发标签输入
- [ ] 标签自动完成 (显示已有标签)
- [ ] 点击 Deposit 前可以添加/删除标签
- [ ] 标签建议 (基于历史标签)

**UI 设计**:
```
┌─────────────────────────────────────────┐
│ 输入消息内容...                          │
│                                         │
│ #research #experiment                   │  <- 标签显示区
│ ┌─────────────────────────────────────┐ │
│ │ + Add Tag                           │ │  <- 添加标签按钮
│ └─────────────────────────────────────┘ │
│                                         │
│ [📎 Attach] [#] [Deposit] ->           │
└─────────────────────────────────────────┘
```

**技术方案**:
```typescript
// MessageStream.tsx 新增状态
const [inputTags, setInputTags] = useState<string[]>([]);
const [tagInput, setTagInput] = useState('');
const [showTagSuggestions, setShowTagSuggestions] = useState(false);

// 标签自动完成
const allExistingTags = Array.from(
  new Set(messages.flatMap(m => m.tags))
);

const tagSuggestions = allExistingTags.filter(tag =>
  tag.toLowerCase().includes(tagInput.toLowerCase())
);

// 添加标签
const handleAddTag = (tag: string) => {
  if (tag && !inputTags.includes(tag)) {
    setInputTags([...inputTags, tag]);
    setTagInput('');
  }
};

// 删除标签
const handleRemoveTag = (tag: string) => {
  setInputTags(inputTags.filter(t => t !== tag));
};
```

---

## 📅 实施计划

### Phase 1: 基础功能 (优先级: 高)
1. ✅ 数据持久化 (已完成)
2. ⏳ 添加项目/任务按钮
3. ⏳ 自定义标签输入
4. ⏳ 文件上传基础功能

### Phase 2: 交互增强 (优先级: 中)
5. ⏳ 右键菜单
6. ⏳ 拖拽排序
7. ⏳ 文件预览

### Phase 3: 高级功能 (优先级: 低)
8. ⏳ 标签自动完成
9. ⏳ 键盘快捷键
10. ⏳ 批量操作

---

## 💡 建议的优先顺序

根据用户反馈,建议按以下顺序实施:

1. **自定义标签输入** - 用户最常用的功能
2. **添加项目/任务按钮** - 基础功能缺失
3. **文件上传** - 完善附件功能
4. **右键菜单** - 提升操作便利性
5. **拖拽排序** - 锦上添花的功能

---

## 🔧 技术依赖

需要安装的库:
```bash
# 拖拽功能
npm install react-beautiful-dnd
npm install @types/react-beautiful-dnd -D

# 文件处理
# (可选) 如果需要客户端压缩/预览
npm install pdfjs-dist
npm install xlsx
```

---

## 📝 注意事项

1. **数据持久化**: 所有新功能的数据都需要同步到 localStorage
2. **性能**: 大文件上传需要考虑性能和存储限制
3. **用户体验**: 每个操作都应有清晰的反馈
4. **错误处理**: 文件上传、标签验证等需要完善的错误提示

---

**最后更新**: 2025-12-11
**状态**: 规划中
