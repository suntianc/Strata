# LLM 配置指南 / LLM Configuration Guide

Strata OS 支持两种 LLM 提供商：**Gemini (云端)** 和 **Ollama (本地)**。

Strata OS supports two LLM providers: **Gemini (cloud)** and **Ollama (local)**.

---

## 🌐 选项 1: 使用 Gemini (推荐 / Recommended)

Gemini 是 Google 的云端 AI 服务，无需本地配置，响应速度快。

### 配置步骤 / Setup Steps

#### 1. 获取 Gemini API Key

访问 Google AI Studio 获取 API Key：
https://aistudio.google.com/app/apikey

#### 2. 创建 .env 文件

在项目根目录创建 `.env` 文件：

```bash
cp .env.example .env
```

#### 3. 添加 API Key

编辑 `.env` 文件，填入你的 API Key：

```env
GEMINI_API_KEY=your_actual_api_key_here
```

#### 4. 重启应用

```bash
npm run dev:electron
```

### 验证配置 / Verify Configuration

启动应用后，在控制台查看：

```
[LLM] Gemini API key found, using Gemini as default provider
[Main] Databases initialized successfully
```

如果看到以上日志，说明 Gemini 配置成功！

---

## 🏠 选项 2: 使用 Ollama (本地)

Ollama 是本地运行的 LLM 服务，数据完全私有，但需要下载模型。

### 配置步骤 / Setup Steps

#### 1. 安装 Ollama

```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

#### 2. 启动 Ollama 服务

```bash
ollama serve
```

保持这个终端窗口打开。

#### 3. 下载所需模型

在**另一个终端**运行：

```bash
# LLM 模型 (约 2GB)
ollama pull llama3.2

# 向量化模型 (约 500MB)
ollama pull nomic-embed-text
```

#### 4. 配置使用 Ollama

编辑 `.env` 文件（如果你之前配置了 Gemini，可以切换）：

```env
# 方法1: 删除 Gemini API key（应用会自动使用 Ollama）
# GEMINI_API_KEY=

# 方法2: 或者直接在 electron/services/llmConfig.ts 中修改默认 provider
```

或者在代码中修改（`electron/services/llmConfig.ts:21`）：

```typescript
let currentConfig: LLMConfig = {
  provider: 'ollama', // 改为 ollama
  // ...
};
```

#### 5. 重启应用

```bash
npm run dev:electron
```

### 验证配置 / Verify Configuration

启动应用后，在控制台查看：

```
[LLM] No Gemini API key, falling back to Ollama
[Main] Databases initialized successfully
```

---

## 🔄 切换提供商 / Switch Providers

你可以随时在两个提供商之间切换：

### 切换到 Gemini：
1. 在 `.env` 中添加 `GEMINI_API_KEY`
2. 重启应用

### 切换到 Ollama：
1. 确保 Ollama 服务正在运行
2. 从 `.env` 中删除或注释 `GEMINI_API_KEY`
3. 重启应用

---

## 📊 功能对比 / Feature Comparison

| 特性 / Feature | Gemini | Ollama |
|----------------|--------|--------|
| 安装难度 / Setup | ⭐⭐⭐⭐⭐ 简单 | ⭐⭐⭐ 中等 |
| 响应速度 / Speed | ⭐⭐⭐⭐⭐ 快 | ⭐⭐⭐ 中等 |
| 数据隐私 / Privacy | ⭐⭐⭐ 云端 | ⭐⭐⭐⭐⭐ 完全本地 |
| 成本 / Cost | 免费配额 | 完全免费 |
| 离线使用 / Offline | ❌ 需要网络 | ✅ 可离线 |

---

## 🛠️ 高级配置 / Advanced Configuration

如果你想同时使用两个提供商，或者自定义模型参数，可以编辑：

**文件**: `electron/services/llmConfig.ts`

```typescript
// 自定义 Ollama 配置
ollamaConfig: {
  baseUrl: 'http://localhost:11434',
  llmModel: 'llama3.2',        // 可改为其他模型
  embeddingModel: 'nomic-embed-text',
}

// 自定义 Gemini 配置
geminiConfig: {
  apiKey: process.env.GEMINI_API_KEY || '',
  model: 'gemini-2.0-flash-exp', // 可改为其他模型
}
```

---

## ❌ 常见问题 / Troubleshooting

### Q1: 对话失败，显示 "Failed to generate response"

**Gemini 用户**：
- 检查 `.env` 文件中的 API key 是否正确
- 确认 API key 有效（访问 https://aistudio.google.com/app/apikey）
- 检查网络连接

**Ollama 用户**：
- 确认 Ollama 服务正在运行：`curl http://localhost:11434/api/tags`
- 确认模型已下载：`ollama list`
- 重启 Ollama 服务：`killall ollama && ollama serve`

### Q2: 找不到 .env 文件

```bash
# 在项目根目录执行
cp .env.example .env
nano .env  # 或使用其他编辑器
```

### Q3: Ollama 端口被占用

检查端口：
```bash
lsof -i:11434
```

修改配置（`electron/services/llmConfig.ts`）：
```typescript
baseUrl: 'http://localhost:另一个端口'
```

---

## 📝 配置验证命令 / Verification Commands

### 检查 Gemini 配置：
```bash
grep GEMINI_API_KEY .env
```

### 检查 Ollama 状态：
```bash
curl http://localhost:11434/api/tags
```

### 检查已下载的模型：
```bash
ollama list
```

---

## 🎯 推荐配置 / Recommended Setup

**快速开始 / Quick Start**:
使用 **Gemini** — 只需一个 API key，无需安装额外软件。

**隐私优先 / Privacy First**:
使用 **Ollama** — 所有数据在本地处理，完全私有。

**最佳体验 / Best Experience**:
配置两个提供商，根据场景切换使用。

---

需要帮助？请查看：
- [QUICKSTART.md](./QUICKSTART.md) - 快速启动指南
- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - 实施指南
