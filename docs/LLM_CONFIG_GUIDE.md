# LLM 配置指南

本指南将帮助您正确配置 Strata 的 AI 对话功能。

## 🎯 问题症状

如果您遇到以下问题:
- ✅ 已在设置中配置了 Ollama/其他 LLM 服务商
- ❌ 对话功能不工作
- ❌ 收到 API 错误提示

这是因为**您需要在应用的设置界面中配置 LLM,而不仅仅是安装服务**。

---

## 📝 配置步骤

### 1. 打开设置界面

在 Strata 应用中:
1. 点击右上角的设置图标 ⚙️
2. 切换到 "Models" 标签页

### 2. 配置 LLM (对话模型)

根据您选择的提供商进行配置:

#### 选项 A: 使用 Ollama (本地免费)

**前提条件**: 确保 Ollama 已安装并运行
```bash
# 检查 Ollama 是否运行
curl http://localhost:11434/api/tags

# 如果未运行,启动它
ollama serve
```

**在 Strata 设置中配置**:
- **Provider**: 选择 `ollama`
- **Model Name**: `llama3.2` (或其他已安装的模型)
- **Base URL**: `http://localhost:11434` (Ollama 默认地址)
- **API Key**: 留空 (本地 Ollama 不需要)

**推荐模型**:
```bash
# 对话模型
ollama pull llama3.2           # 3B 参数,快速响应
ollama pull mistral            # 7B 参数,质量更好
ollama pull qwen2.5:7b         # 中文支持好

# 向量化模型
ollama pull nomic-embed-text   # 用于 Embedding
```

---

#### 选项 B: 使用 Google Gemini (云端)

**前提条件**: 获取 Gemini API Key
1. 访问 https://aistudio.google.com/app/apikey
2. 点击 "Create API Key"
3. 复制 API Key (以 `AIza` 开头)

**在 Strata 设置中配置**:
- **Provider**: 选择 `gemini`
- **Model Name**: `gemini-2.5-flash` (推荐) 或 `gemini-pro`
- **Base URL**: 留空
- **API Key**: 粘贴您的 Gemini API Key

---

#### 选项 C: 使用 OpenAI

**前提条件**: 获取 OpenAI API Key
1. 访问 https://platform.openai.com/api-keys
2. 创建新的 API Key
3. 复制 API Key (以 `sk-` 开头)

**在 Strata 设置中配置**:
- **Provider**: 选择 `openai`
- **Model Name**: `gpt-3.5-turbo` 或 `gpt-4`
- **Base URL**: `https://api.openai.com/v1` (或留空使用默认值)
- **API Key**: 粘贴您的 OpenAI API Key

---

#### 选项 D: 使用自定义 API (兼容 OpenAI 格式)

适用于:
- LM Studio
- vLLM
- Text Generation WebUI
- 其他 OpenAI 兼容服务

**在 Strata 设置中配置**:
- **Provider**: 选择 `custom`
- **Model Name**: 您的模型名称
- **Base URL**: 您的 API 地址 (例如: `http://localhost:1234/v1`)
- **API Key**: 根据服务要求填写 (可选)

---

### 3. 配置 Embedding (向量化模型)

用于语义搜索和相关消息查找:

**推荐配置** (使用本地 Ollama):
- **Provider**: `ollama`
- **Model Name**: `nomic-embed-text`
- **Base URL**: `http://localhost:11434`
- **API Key**: 留空

---

### 4. 保存并测试

1. 点击右下角的 "Save" 按钮 💾
2. 等待保存成功提示 ✓
3. 关闭设置界面
4. 打开右侧面板的 "Copilot" 模式
5. 输入测试问题,例如: "你好,测试一下"

---

## 🔧 故障排查

### 问题 1: "Ollama connection failed"

**原因**: Ollama 服务未启动

**解决方案**:
```bash
# 检查 Ollama 是否运行
ps aux | grep ollama

# 启动 Ollama
ollama serve

# 在新终端测试
curl http://localhost:11434/api/tags
```

---

### 问题 2: "Model not found"

**原因**: 模型未下载

**解决方案**:
```bash
# 查看已安装的模型
ollama list

# 下载所需模型
ollama pull llama3.2
ollama pull nomic-embed-text
```

---

### 问题 3: "API key is required"

**原因**:
- 使用 Gemini/OpenAI 但未填写 API Key
- API Key 格式错误

**解决方案**:
- 检查 API Key 是否正确复制
- Gemini Key 应以 `AIza` 开头
- OpenAI Key 应以 `sk-` 开头
- 确保没有多余的空格

---

### 问题 4: "Connection refused"

**原因**: Base URL 配置错误

**解决方案**:
- Ollama 默认地址: `http://localhost:11434`
- 不要添加 `/api` 后缀
- 确保端口号正确
- 检查防火墙设置

---

### 问题 5: 设置保存后仍然不工作

**原因**: 浏览器缓存问题

**解决方案**:
1. 按 `Ctrl+Shift+I` 打开开发者工具
2. 切换到 Console 标签
3. 查看是否有错误信息
4. 检查 Application > Local Storage > strata_settings
5. 确认配置已保存

---

## 💡 最佳实践

### 推荐配置组合

**方案 1: 完全本地 (隐私优先)**
```
LLM: Ollama (llama3.2)
Embedding: Ollama (nomic-embed-text)
优点: 免费、隐私、离线可用
缺点: 需要本地资源
```

**方案 2: 云端混合 (质量优先)**
```
LLM: Gemini (gemini-2.5-flash)
Embedding: Ollama (nomic-embed-text)
优点: AI 质量高、响应快
缺点: 需要网络、API 费用
```

**方案 3: 纯云端 (简单快速)**
```
LLM: Gemini (gemini-2.5-flash)
Embedding: Gemini (text-embedding-004)
优点: 无需本地部署
缺点: 完全依赖网络
```

---

## 📊 性能对比

| 提供商 | 速度 | 质量 | 成本 | 隐私 |
|--------|------|------|------|------|
| Ollama (llama3.2) | ⭐⭐⭐ | ⭐⭐⭐ | 免费 | ⭐⭐⭐⭐⭐ |
| Gemini Flash | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 低 | ⭐⭐⭐ |
| OpenAI GPT-3.5 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 中 | ⭐⭐⭐ |
| OpenAI GPT-4 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 高 | ⭐⭐⭐ |

---

## 🆘 获取帮助

如果问题仍未解决:

1. **查看控制台日志**:
   - 按 `F12` 打开开发者工具
   - 查看 Console 标签的错误信息

2. **检查配置**:
   - 打开开发者工具 > Application > Local Storage
   - 查找 `strata_settings` 键
   - 确认配置格式正确

3. **提供问题报告**:
   - LLM Provider: (gemini/ollama/openai/custom)
   - 错误信息: (从控制台复制)
   - 配置截图

---

## ✅ 快速检查清单

在寻求帮助前,请确认:

- [ ] 已在**设置界面**中配置 LLM (不是 .env 文件)
- [ ] 点击了 "Save" 按钮并看到保存成功提示
- [ ] Ollama 服务正在运行 (如果使用 Ollama)
- [ ] API Key 已正确填写 (如果使用云端服务)
- [ ] Base URL 格式正确,无多余的 `/api` 后缀
- [ ] 浏览器控制台没有明显错误
- [ ] 已重新加载页面或重启应用

---

**祝配置成功!** 🎉

如有问题,欢迎查看控制台日志并提供详细的错误信息。
