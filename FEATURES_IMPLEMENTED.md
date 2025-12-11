# 🎉 已实现功能 - 快速指南

## ✅ Sprint 1 核心功能 (2025-12-11)

### 1. 添加项目/任务按钮

#### 📍 位置: 侧边栏 (Sidebar)

**添加项目**:
```
DEEP STRATA [+]  ← 点击这里添加新项目
  │
  ├─ 📚 Research Project
  └─ 💻 Development
```

**添加子任务**:
```
📚 Research Project  [+] ← 鼠标悬停时显示,点击添加子任务
  │
  ├─ 📖 Literature Review
  └─ 🧪 Experiment 1
```

#### 🎮 使用方法

**创建项目**:
1. 找到侧边栏的 "DEEP STRATA" 标题
2. 点击右侧的 **[+]** 按钮
3. 输入框出现,输入项目名称
4. 按 **Enter** 确认 或 **Esc** 取消
5. 新项目出现在列表底部

**创建子任务**:
1. 将鼠标悬停在任意项目/任务上
2. 右侧出现 **[+]** 按钮
3. 点击按钮
4. 输入框出现,输入任务名称
5. 按 **Enter** 确认 或 **Esc** 取消
6. 父节点自动展开,显示新子任务

#### 🎨 视觉效果

- ✨ 输入框带 **terracotta** 橙色边框
- ✨ 悬停时 **+** 按钮平滑淡入
- ✨ 创建后自动展开父节点
- ✨ 支持无限层级嵌套

---

### 2. 自定义标签输入

#### 📍 位置: 消息输入框下方

```
┌─────────────────────────────────────┐
│ Type your message here...           │
│                                     │
├─────────────────────────────────────┤
│ [#experiment] [#research] [+ Add tag] │ ← 标签区域
├─────────────────────────────────────┤
│ [📎] [#]                    [Deposit] │
└─────────────────────────────────────┘
```

#### 🎮 使用方法

**方法 1 - 点击添加**:
1. 点击消息输入框 (会展开标签区域)
2. 点击 **[+ Add tag]** 按钮
3. 输入标签名称
4. 按 **Enter** 确认 或 **Esc** 取消

**方法 2 - 快捷按钮**:
1. 点击消息输入框
2. 点击工具栏的 **[#]** 图标
3. 输入标签名称
4. 按 **Enter** 确认

**标签建议**:
- 输入时自动显示匹配的现有标签
- 最多显示 5 个建议
- 点击建议直接添加

**删除标签**:
- 点击标签右侧的 **[X]** 按钮即可删除

#### 🎨 视觉效果

- ✨ 标签使用 **teal** 配色 (与 active 状态一致)
- ✨ 每个标签带 **#** 图标前缀
- ✨ 悬停高亮、删除按钮
- ✨ 建议下拉菜单平滑动画

#### 🤖 智能特性

- 如果用户没有添加标签,AI 会自动生成 (保留原功能)
- 标签自动小写化,避免重复
- 实时过滤建议,忽略大小写

---

## 📋 完整使用流程示例

### 场景: 创建学术研究项目

#### 步骤 1: 创建项目
```
1. 点击 DEEP STRATA 旁的 [+]
2. 输入: "PhD Thesis: Neural Networks"
3. 按 Enter
```

结果:
```
DEEP STRATA
  ├─ 📚 Welcome to Strata - Demo Project
  └─ 📚 PhD Thesis: Neural Networks  ← 新创建
```

#### 步骤 2: 添加子任务
```
1. 悬停在 "PhD Thesis: Neural Networks" 上
2. 点击右侧的 [+]
3. 输入: "Literature Review"
4. 按 Enter
5. 再次点击 [+]
6. 输入: "Experiment 1: Baseline"
7. 按 Enter
```

结果:
```
📚 PhD Thesis: Neural Networks
  ├─ 📖 Literature Review           ← 新创建
  └─ 🧪 Experiment 1: Baseline      ← 新创建
```

#### 步骤 3: 创建带标签的消息
```
1. 选中 "Literature Review" 任务
2. 点击消息输入框
3. 输入内容: "Read paper: Attention Is All You Need"
4. 点击 [+ Add tag]
5. 输入: "paper" → 按 Enter
6. 再次点击 [+ Add tag]
7. 输入: "transformer" → 按 Enter
8. 点击 Deposit
```

结果:
```
消息创建成功!
- 内容: "Read paper: Attention Is All You Need"
- 标签: [#paper] [#transformer]
- 归属: Literature Review
```

---

## ⌨️ 快捷键总结

### 添加项目/任务
- `Enter` - 确认创建
- `Esc` - 取消输入

### 标签管理
- `Enter` - 确认添加标签
- `Esc` - 取消输入

### 未来快捷键 (计划中)
- `Ctrl/Cmd + N` - 新建消息
- `Ctrl/Cmd + K` - 命令面板
- `Tab` - 导航标签建议

---

## 🎯 使用技巧

### Tip 1: 快速添加多个子任务
```
1. 点击项目的 [+] → 输入任务 1 → Enter
2. [+] 按钮还在 → 再次点击 → 输入任务 2 → Enter
3. 连续添加,无需重复悬停
```

### Tip 2: 统一标签命名
```
推荐格式:
- ✅ lowercase (小写)
- ✅ hyphen-separated (连字符分隔)
- ✅ descriptive (描述性)

示例:
✅ literature-review
✅ bug-fix
✅ meeting-notes

❌ LiteratureReview (大小写混合)
❌ bug_fix (下划线)
❌ misc (无意义)
```

### Tip 3: 利用标签建议
```
1. 输入部分标签名 (如 "exp")
2. 查看建议列表 (experiment, export, ...)
3. 点击建议或继续输入
4. 保持标签一致性
```

### Tip 4: 混合标签模式
```
场景: 实验记录

手动添加核心标签:
- experiment
- baseline

让 AI 补充细节标签:
- performance-test
- accuracy-metrics
- 2025-12-11

→ 最终标签既统一又详细
```

---

## 🔄 数据持久化

所有数据自动保存到浏览器的 **localStorage**:

### 保存的内容
- ✅ 项目/任务结构
- ✅ 消息内容和标签
- ✅ 活动项目 ID
- ✅ 深色模式设置
- ✅ 用户配置 (Profile, LLM)

### 数据安全
- 🔒 刷新页面不丢失
- 🔒 关闭浏览器后仍保留
- ⚠️ 清除浏览器缓存会删除数据

### 备份方法 (临时)
```javascript
// 打开开发者工具 (F12) → Console
// 导出所有数据
JSON.stringify({
  tasks: localStorage.getItem('strata_tasks'),
  messages: localStorage.getItem('strata_messages'),
  settings: localStorage.getItem('strata_settings')
})

// 复制输出并保存到文件
```

---

## 🐛 常见问题

### Q1: 点击 + 按钮没反应?
**解决方案**:
1. 检查浏览器控制台 (F12) 是否有错误
2. 刷新页面重试
3. 确保点击的是正确的 + 按钮 (不是其他图标)

### Q2: 标签没有保存?
**解决方案**:
1. 确保点击了 **Deposit** 按钮 (不是直接关闭)
2. 检查标签是否添加到列表中 (蓝绿色标签)
3. 刷新页面查看消息是否包含标签

### Q3: 创建的项目/任务不见了?
**解决方案**:
1. 检查是否在正确的项目下 (Inbox vs 项目)
2. 刷新页面,数据应该从 localStorage 恢复
3. 检查浏览器控制台是否有存储错误
4. 确认浏览器没有禁用 localStorage

### Q4: 标签建议不准确?
**说明**:
- 标签建议基于**现有消息的标签**
- 如果是新系统,建议列表会为空
- 随着使用积累,建议会越来越准确

---

## 📚 相关文档

- **[SPRINT1_COMPLETE.md](SPRINT1_COMPLETE.md)** - 技术实现细节
- **[IMPLEMENTATION_PRIORITY.md](IMPLEMENTATION_PRIORITY.md)** - 功能优先级规划
- **[FEATURES_TODO.md](FEATURES_TODO.md)** - 待实现功能清单
- **[用户手册](docs/用户手册.md)** - 完整用户指南
- **[User Manual](docs/USER_MANUAL.md)** - English version

---

## 🎉 开始使用

现在您可以:

1. ✅ 创建自己的项目结构
2. ✅ 添加任务和子任务
3. ✅ 使用自定义标签组织消息
4. ✅ 享受流畅的用户体验

**祝您使用愉快!** 🚀

如有问题或建议,请提交 Issue 或联系维护者。

---

**版本**: 1.0.0 (Sprint 1)
**更新日期**: 2025-12-11
