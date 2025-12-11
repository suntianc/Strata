# DeepSeek / 自定义 API 故障排查指南

## ⚠️ 常见问题:"Failed to fetch" 错误

您遇到的 "Failed to fetch" 错误通常由以下原因造成:

### 1. 浏览器 CORS 限制 (最常见)

**问题**: 浏览器阻止前端直接调用第三方 API

**症状**:
```
Error: Failed to fetch
Please check your LLM configuration in Settings.
```

**为什么会发生**:
- 浏览器安全策略要求 API 服务器返回 CORS 头
- DeepSeek API 可能不允许从浏览器直接调用
- 这是浏览器的限制,不是代码的问题

**解决方案 (3 个选项)**:

#### 选项 A: 使用代理服务器 (推荐)

创建一个本地代理来转发请求:

```bash
# 安装 CORS 代理
npm install -g cors-anywhere

# 启动代理 (在新终端)
cors-anywhere
```

然后在 Strata 设置中修改 Base URL:
```
原来: https://api.deepseek.com/v1
改为: http://localhost:8080/https://api.deepseek.com/v1
```

#### 选项 B: 使用浏览器插件

安装 CORS 解除插件 (仅用于开发):
- Chrome: "CORS Unblock"
- Firefox: "CORS Everywhere"

⚠️ 注意: 仅在开发环境使用,不要在生产环境启用!

#### 选项 C: 改用 Electron 版本 (推荐生产使用)

Electron 版本不受 CORS 限制:

```bash
# 构建 Electron 版本
npm run build:electron

# 启动 Electron 应用
npm run electron
```

---

### 2. API Key 错误

**症状**: API 返回 401 或 403 错误

**检查清单**:
- [ ] API Key 是否正确复制 (无多余空格)
- [ ] API Key 是否已激活/未过期
- [ ] API Key 是否有调用权限
- [ ] 是否点击了"Save Changes"保存配置

**测试方法**:
```bash
# 在终端测试 API Key
curl -X POST https://api.deepseek.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "deepseek-chat",
    "messages": [{"role": "user", "content": "Hi"}]
  }'
```

如果终端能成功,但浏览器不行 → CORS 问题

---

### 3. Base URL 配置错误

**常见错误**:
- ✗ `https://api.deepseek.com` (缺少 `/v1`)
- ✗ `https://api.deepseek.com/v1/chat/completions` (多了 `/chat/completions`)
- ✓ `https://api.deepseek.com/v1` (正确)

**验证方法**:
在设置界面点击 "Test Connection" 按钮查看详细错误。

---

### 4. 网络连接问题

**症状**: 长时间无响应或超时

**检查清单**:
- [ ] 是否能访问 https://api.deepseek.com
- [ ] 防火墙是否阻止连接
- [ ] 是否在国内网络 (可能需要代理)

**测试连通性**:
```bash
# 测试网络
ping api.deepseek.com

# 测试 HTTPS
curl -I https://api.deepseek.com/v1
```

---

## 🔧 使用新增的"测试连接"功能

1. 打开 Strata 设置 > Models 标签
2. 配置好 Provider、Model Name、Base URL、API Key
3. **点击 "Test Connection" 按钮**
4. 查看测试结果:
   - ✓ 绿色 = 连接成功
   - ✗ 红色 = 连接失败,查看错误详情

---

## 🎯 推荐配置方案

### 方案 1: 本地 Ollama (最简单,无 CORS 问题)

```yaml
Provider: ollama
Model Name: llama3.2
Base URL: http://localhost:11434
API Key: (留空)
```

**优点**:
- ✓ 无 CORS 限制
- ✓ 完全免费
- ✓ 隐私保护

**安装 Ollama**:
```bash
# 安装
curl -fsSL https://ollama.ai/install.sh | sh

# 启动服务
ollama serve

# 拉取模型
ollama pull llama3.2
```

---

### 方案 2: DeepSeek + CORS 代理

```yaml
Provider: custom
Model Name: deepseek-chat
Base URL: http://localhost:8080/https://api.deepseek.com/v1
API Key: sk-xxx (您的 DeepSeek Key)
```

**前提**: 运行 CORS 代理 (见上文选项 A)

---

### 方案 3: Gemini (无 CORS 问题)

```yaml
Provider: gemini
Model Name: gemini-2.5-flash
Base URL: (留空)
API Key: AIza... (您的 Gemini Key)
```

**优点**:
- ✓ 官方 SDK,无 CORS 问题
- ✓ 响应快速
- ✓ 质量高

**获取 Key**: https://aistudio.google.com/app/apikey

---

## 🐛 调试工具

### 查看浏览器控制台

1. 按 `F12` 打开开发者工具
2. 切换到 **Console** 标签
3. 查找错误信息:
   - `[LLMService]` 开头的日志
   - `CORS` 相关错误
   - `Failed to fetch` 详情

### 查看网络请求

1. 开发者工具 > **Network** 标签
2. 输入对话后观察请求:
   - 红色 = 失败
   - 点击请求查看详细错误
   - 查看 Response Headers 是否有 CORS 头

### 查看本地配置

1. 开发者工具 > **Application** 标签
2. 左侧 > Local Storage > 选择您的域名
3. 查找 `strata_settings` 键
4. 确认 JSON 格式正确:
```json
{
  "llm": {
    "provider": "custom",
    "modelName": "deepseek-chat",
    "baseUrl": "https://api.deepseek.com/v1",
    "apiKey": "sk-xxx"
  }
}
```

---

## ✅ 完整检查清单

在寻求帮助前,请确认:

- [ ] 已在设置界面配置 LLM (不是 .env 文件)
- [ ] Provider 选择 "Custom"
- [ ] Model Name 填写 "deepseek-chat"
- [ ] Base URL 是 `https://api.deepseek.com/v1` (注意 /v1)
- [ ] API Key 已正确填写 (无空格)
- [ ] 已点击 "Save Changes" 保存
- [ ] 已点击 "Test Connection" 测试连接
- [ ] 查看了浏览器控制台的错误日志

---

## 💡 快速解决方案总结

| 问题 | 最快解决方案 |
|------|------------|
| CORS 错误 | 改用 Ollama 或 Gemini |
| 没有本地环境 | 使用 Gemini |
| 必须用 DeepSeek | 运行 CORS 代理或 Electron 版 |
| 测试连接失败 | 检查 API Key 和 Base URL |
| 配置保存失败 | 清除浏览器缓存,重新配置 |

---

## 📞 获取更多帮助

如果以上方法都不能解决,请提供:

1. **配置信息**:
   - Provider: ?
   - Model Name: ?
   - Base URL: ?
   - 是否有 API Key: 是/否

2. **错误信息**:
   - 从浏览器控制台复制完整错误
   - 包括 `[LLMService]` 开头的日志

3. **测试连接结果**:
   - "Test Connection" 按钮显示什么?
   - 截图或复制错误详情

4. **环境信息**:
   - 浏览器: Chrome/Firefox/Safari?
   - 是否使用了 Electron 版?
   - 网络环境: 国内/国外?

---

**祝您早日解决问题!** 🎉

如果改用 Ollama,可以在 10 分钟内完成配置并开始使用。
