# 🚀 Strata OS 快速启动指南

## ✅ 已完成的步骤

1. ✅ 安装所有依赖（882 个包）
2. ✅ 配置国内镜像（.npmrc）
3. ✅ 修复 TypeScript 编译错误
4. ✅ Electron 架构文件已创建

## 📋 下一步操作

### 1. 安装 Ollama（必需）

Ollama 提供本地 AI 能力，用于向量化和对话。

```bash
# 安装 Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# 启动服务（后台运行）
ollama serve &

# 拉取所需模型（约 4GB，需要一些时间）
ollama pull llama3.2           # 用于 AI 对话和标签提取
ollama pull nomic-embed-text   # 用于文本向量化（768维）
```

**验证 Ollama 是否正常运行：**
```bash
curl http://localhost:11434/api/tags
```

如果看到 JSON 响应，说明 Ollama 已启动成功。

---

### 2. 启动开发环境

```bash
# 确保在项目根目录
cd /home/suntc/project/Strata

# 启动 Electron 开发模式
npm run dev:electron
```

这个命令会：
1. 启动 Vite 开发服务器（端口 3000）
2. 编译 TypeScript（Electron 主进程）
3. 启动 Electron 应用

**首次启动会自动创建数据库：**
- PGlite: `~/.config/Electron/strata.db`
- LanceDB: `~/.config/Electron/lance/`
- KuzuDB: `~/.config/Electron/kuzu/`

---

### 3. 验证功能（测试清单）

在应用启动后，依次测试以下功能：

#### 3.1 基础功能测试
- [ ] 打开应用，检查控制台是否有数据库初始化日志
- [ ] 创建一个任务（例如："测试项目"）
- [ ] 在任务下创建一条消息
- [ ] 查看消息是否正确显示

#### 3.2 AI 功能测试
- [ ] 在 Inbox 中创建几条消息
- [ ] 点击"AI 整理"按钮
- [ ] 查看是否有归类建议

#### 3.3 搜索功能测试
- [ ] 在搜索框输入关键词
- [ ] 验证混合检索结果

#### 3.4 聊天功能测试
- [ ] 打开 Chat 面板
- [ ] 输入问题，测试 RAG 对话
- [ ] 验证是否有流式响应

---

## 🛠️ 开发工具

### 查看日志
```bash
# Electron 主进程日志在终端中显示
# 渲染进程日志在 DevTools 中查看（Ctrl+Shift+I）
```

### 数据库调试
```bash
# 查看 PGlite 数据
# 数据库文件：~/.config/Electron/strata.db
# 可以使用 SQLite 工具打开查看

# 查看 LanceDB 向量
# 目录：~/.config/Electron/lance/

# 查看 KuzuDB 图数据
# 目录：~/.config/Electron/kuzu/
```

### 热重载
- **前端代码**：保存后自动刷新（Vite HMR）
- **主进程代码**：需要重启应用（Ctrl+C 后重新运行 `npm run dev:electron`）

---

## ⚠️ 常见问题

### Q1: Ollama 连接失败
**错误信息**：`ECONNREFUSED localhost:11434`

**解决方案**：
```bash
# 检查 Ollama 是否运行
ps aux | grep ollama

# 如果没有运行，启动它
ollama serve &
```

### Q2: 模型未找到
**错误信息**：`model 'llama3.2' not found`

**解决方案**：
```bash
# 拉取模型
ollama pull llama3.2
ollama pull nomic-embed-text
```

### Q3: 端口 3000 被占用
**错误信息**：`Port 3000 is already in use`

**解决方案**：
```bash
# 方法1：杀掉占用进程
lsof -ti:3000 | xargs kill -9

# 方法2：修改 vite.config.ts 中的端口
```

### Q4: Electron 无法启动
**解决方案**：
```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 相关文档

- [ARCHITECTURE_SUMMARY.md](./ARCHITECTURE_SUMMARY.md) - 架构详细说明
- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - 完整实施指南
- [详细设计文档.md](./详细设计文档.md) - 原始设计规范

---

## 🎯 下一步开发建议

1. **完善 UI 组件**：
   - 优化消息列表样式
   - 添加加载状态指示器
   - 实现拖拽排序

2. **增强 AI 功能**：
   - 实现文件上传（PDF、DOCX）
   - 添加 OCR 图片识别
   - 实现自动摘要生成

3. **性能优化**：
   - 添加虚拟滚动（大量消息时）
   - 实现增量向量化（后台队列）
   - 优化数据库查询索引

4. **用户体验**：
   - 添加键盘快捷键
   - 实现全局搜索（Cmd+K）
   - 添加主题切换

---

## 💡 提示

- **首次启动较慢**：需要初始化三个数据库和创建索引
- **向量化异步**：创建消息后，向量化在后台进行，不会阻塞 UI
- **开发模式调试**：按 `Ctrl+Shift+I` 打开 DevTools
- **数据持久化**：所有数据保存在 `~/.config/Electron/` 目录

---

**祝开发顺利！** 🎉

如果遇到问题，请查看：
- 控制台日志（主进程和渲染进程）
- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) 中的故障排查章节
