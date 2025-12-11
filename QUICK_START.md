# 快速启动指南

**版本**: 0.1.0
**更新日期**: 2025-12-11

---

## 🚀 启动应用

### 开发模式（推荐用于测试）

```bash
npm run dev:electron2
```

这会启动：
- Vite 开发服务器（端口 3000）
- Electron 应用窗口
- 热重载功能

---

## ✅ 测试会话管理功能

### 1. 基础测试流程

#### 步骤 1: 启动应用
```bash
npm run dev:electron2
```

#### 步骤 2: 创建测试数据
1. 在左侧 Sidebar 创建一个新的 Project 或 Task
2. 点击右侧面板的 **Copilot** 按钮（Sparkles 图标）

#### 步骤 3: 测试会话功能
1. **发送消息**：
   - 在输入框输入："你好，请介绍一下这个项目"
   - 按 Enter 发送
   - 观察消息是否正确显示

2. **查看会话列表**：
   - 点击右上角的会话按钮（显示数字的按钮）
   - 左侧会显示会话列表
   - 当前会话应该高亮显示

3. **创建新会话**：
   - 点击会话列表顶部的 "+" 按钮
   - 发送一些不同的消息
   - 验证新会话独立于旧会话

4. **切换会话**：
   - 在会话列表中点击不同的会话
   - 验证聊天区域切换到对应的消息历史

5. **重命名会话**：
   - 悬停在会话上
   - 点击编辑图标（铅笔）
   - 输入新名称："项目讨论"
   - 按 Enter 保存

6. **测试持久化** ⭐ 重要：
   - 发送几条消息
   - 完全关闭应用（Ctrl+Q 或关闭窗口）
   - 重新启动应用
   - 选择相同的 Project/Task
   - 打开 Copilot 模式
   - **验证**：所有会话和消息应该完整保留

---

## 🔍 验证数据库

### 检查数据库文件

```bash
# 查看数据库文件
ls -lh ~/.config/"Strata OS"/strata.db*

# 应该看到：
# strata.db      - 主数据库文件
# strata.db-shm  - 共享内存文件（WAL 模式）
# strata.db-wal  - 预写日志文件（WAL 模式）
```

### 查询数据库内容（可选）

```bash
# 安装 sqlite3（如果没有）
sudo apt install sqlite3  # Ubuntu/Debian
# 或
brew install sqlite3      # macOS

# 查看会话表
sqlite3 ~/.config/"Strata OS"/strata.db "SELECT * FROM chat_sessions;"

# 查看消息表
sqlite3 ~/.config/"Strata OS"/strata.db "SELECT id, role, substr(content, 1, 50) as content FROM chat_messages ORDER BY position;"
```

---

## 🎯 功能清单

### ✅ 已实现的功能

- [x] 会话创建和自动保存
- [x] 消息持久化到 SQLite
- [x] 会话列表显示
- [x] 会话切换
- [x] 会话重命名
- [x] 会话删除
- [x] 应用重启后数据保留
- [x] 多上下文支持（Project/Task/Message）
- [x] 响应式 UI
- [x] 深色模式支持

### 🔄 待实现的功能

- [ ] LanceDB 语义搜索
- [ ] KuzuDB 图查询
- [ ] 会话导出
- [ ] 会话搜索
- [ ] 消息引用跳转

---

## 🐛 常见问题

### 问题 1: 应用无法启动

**症状**: `npm run dev:electron2` 报错

**解决方案**:
```bash
# 重新安装依赖
rm -rf node_modules package-lock.json
npm install

# 重新编译 better-sqlite3
npx electron-rebuild -v 30.5.1 -f -w better-sqlite3
```

### 问题 2: 会话不保存

**症状**: 重启后会话消失

**检查步骤**:
1. 查看控制台日志（Ctrl+Shift+I）
2. 检查是否有 SQLite 错误
3. 验证数据库文件是否创建

**解决方案**:
```bash
# 检查数据库文件权限
ls -la ~/.config/"Strata OS"/

# 如果没有写权限，修复：
chmod 755 ~/.config/"Strata OS"/
```

### 问题 3: 消息不显示

**症状**: 发送消息后没有反应

**检查步骤**:
1. 打开开发者工具（Ctrl+Shift+I）
2. 查看 Console 标签页的错误信息
3. 检查 Network 标签页的 IPC 调用

**可能原因**:
- LLM 配置错误（检查 Settings）
- 网络连接问题
- API Key 无效

---

## 📊 性能监控

### 查看应用性能

1. 打开开发者工具（Ctrl+Shift+I）
2. 切换到 Performance 标签页
3. 点击 Record 开始录制
4. 执行操作（发送消息、切换会话等）
5. 停止录制并分析

### 内存使用

```bash
# 查看 Electron 进程
ps aux | grep electron

# 查看数据库大小
du -h ~/.config/"Strata OS"/strata.db
```

---

## 🎨 UI 功能说明

### 右侧面板布局

```
┌─────────────────────────────────────────┐
│ [<] [Info] [Copilot] 🟢 AI Online [📋3]│  ← 头部
├─────────────────────────────────────────┤
│ ┌─────────┐ │                           │
│ │Sessions │ │  Chat Area                │  ← 主体
│ │  List   │ │                           │
│ │         │ │  [Messages...]            │
│ └─────────┘ │                           │
├─────────────────────────────────────────┤
│ Ask Copilot...                   [Send] │  ← 输入框
└─────────────────────────────────────────┘
```

### 会话列表功能

- **[+] 按钮**: 创建新会话
- **会话项**: 点击切换会话
- **编辑图标**: 重命名会话
- **删除图标**: 删除会话（需确认）
- **消息计数**: 显示会话中的消息数量
- **时间戳**: 显示最后活动时间

---

## 🔧 开发工具

### 热重载

开发模式下，修改代码会自动重载：
- **前端代码**: 自动热重载（无需刷新）
- **后端代码**: 需要重启 Electron 进程

### 调试

```bash
# 启动时打开开发者工具
npm run dev:electron2

# 在应用中按 Ctrl+Shift+I 打开开发者工具
```

### 日志

查看不同级别的日志：
- **[SQLite]**: 数据库操作
- **[IPC]**: 前后端通信
- **[Main]**: 主进程日志
- **[RightPanel]**: UI 组件日志

---

## 📝 下一步

### 立即测试
1. 启动应用：`npm run dev:electron2`
2. 创建会话并发送消息
3. 重启应用验证持久化

### 继续开发
1. 实现 LanceDB 语义搜索
2. 实现 KuzuDB 图查询
3. 优化 UI/UX
4. 添加更多功能

---

## 📚 相关文档

- [SESSION_IMPLEMENTATION_COMPLETE.md](SESSION_IMPLEMENTATION_COMPLETE.md) - 完整实现总结
- [SESSION_TESTING_GUIDE.md](SESSION_TESTING_GUIDE.md) - 详细测试指南
- [ARCHITECTURE_THREE_DB_DESIGN.md](ARCHITECTURE_THREE_DB_DESIGN.md) - 架构设计
- [WINDOWS_BUILD_GUIDE.md](WINDOWS_BUILD_GUIDE.md) - Windows 打包指南

---

**准备好了吗？运行 `npm run dev:electron2` 开始测试！** 🚀
