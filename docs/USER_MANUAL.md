# Strata User Manual

Welcome to Strata - Your Intelligent Research Notes and Knowledge Management System! 🎉

## 📖 Table of Contents

1. [Quick Start](#quick-start)
2. [Interface Overview](#interface-overview)
3. [Core Features](#core-features)
4. [AI Configuration Guide](#ai-configuration-guide)
5. [Common Use Cases](#common-use-cases)
6. [Keyboard Shortcuts](#keyboard-shortcuts)
7. [FAQ](#faq)

---

## 🚀 Quick Start

### Step 1: Configure AI Service

Strata requires an AI service to provide intelligent analysis features.

1. **Click the Settings icon** ⚙️ in the top right corner
2. **Switch to the "Models" tab**
3. **Choose your LLM provider**:
   - **Ollama** (Recommended for beginners, local & free)
   - **Gemini** (Cloud-based, fast response)
   - **OpenAI** (Requires paid API Key)
   - **Custom** (Custom API endpoint)

#### Recommended Setup - Using Ollama (Local & Free)

```bash
# 1. Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# 2. Start the service
ollama serve

# 3. Pull models
ollama pull llama3.2          # Chat model
ollama pull nomic-embed-text  # Embedding model
```

**Configure in Strata**:
- Provider: `ollama`
- Model Name: `llama3.2`
- Base URL: `http://localhost:11434`
- API Key: (leave empty)

4. **Click "Test Connection"** to verify
5. **Click "Save Changes"** to save

For detailed configuration, see: [LLM Configuration Guide](../LLM_CONFIG_GUIDE.md)

---

## 🎨 Interface Overview

Strata's interface consists of three main areas:

```
┌──────────────┬─────────────────────┬─────────────┐
│              │                     │             │
│   Sidebar    │   Message Stream    │ Right Panel │
│              │                     │ AI Copilot  │
│              │                     │             │
│  - Inbox     │  - Message List     │  - Info     │
│  - Projects  │  - Tag Filter       │  - Chat     │
│  - Search    │  - New Message      │             │
│              │                     │             │
└──────────────┴─────────────────────┴─────────────┘
```

### 1. Sidebar

**Features**:
- 📥 **Inbox**: Unassigned messages
- 📁 **Project Management**: Create and manage project/task hierarchies
- 🔍 **Search**: Global search for messages and tags
- 🌙 **Dark Mode**: Theme toggle
- ⚙️ **Settings**: Configure user profile and AI services

**Actions**:
- Click projects/tasks to view related messages
- Right-click projects for more options
- Drag projects to reorder

### 2. Message Stream Area

**Features**:
- Display all messages for the selected project/task
- Create, edit, and delete messages
- Add tags and attachments
- AI smart organization

**Message Card Contains**:
- 📝 Content (Markdown supported)
- 🏷️ Tags
- 📎 Attachments (PDF, Excel, Images, Code)
- 🕐 Timestamp
- 📌 Version number

**Actions**:
- Click message to view details
- Click ✏️ to edit
- Click 🗑️ to delete
- Click 📌 to archive
- Click tags to filter

### 3. Right Panel

**Two Modes**:

#### Info Mode
Shows detailed information about the selected message:
- 📋 Metadata (timestamp, tags)
- 📜 Version history
- 🔗 Related messages (based on vector similarity)

#### Chat Mode (AI Copilot)
Chat with AI assistant:
- 💬 Analyze message content
- 📊 Generate reports
- 🔍 Answer questions
- Multi-turn conversations

---

## 🎯 Core Features

### 1. Project and Task Management

#### Create Project

1. Click **"+ New Project"** in the sidebar
2. Enter project name (e.g., "PhD Thesis: Neural Architecture")
3. Press Enter to save

#### Create Subtask

1. Select a project
2. Click **"+ New Task"**
3. Enter task name (e.g., "Literature Review")
4. Press Enter to save

#### Task Status

Each task has a status indicator:
- 🟢 **Active** (In progress)
- 🔵 **Pending** (Not started)
- 🟡 **Blocked** (Blocked)
- ✅ **Completed** (Done)

Right-click tasks to change status.

---

### 2. Messages and Notes

#### Create Message

**Method 1: From Message Stream**
1. Select target project/task (or Inbox)
2. Click **"+ New Layer"** button
3. Enter message content
4. Add tags (optional)
5. Upload attachments (optional)
6. Click **"Save"**

**Method 2: Quick Create**
- Press `Ctrl+N` (or `Cmd+N`) for quick message creation

#### Edit Message

1. Click the ✏️ edit icon on the message card
2. Modify content
3. Save to automatically increment version number

**Version Control**:
- Each edit creates a new version
- View version history in Info panel
- Future: Rollback to historical versions

#### Using Tags

**Why use tags?**
- 🏷️ Organize content across projects
- 🔍 Quickly filter related messages
- 🤖 Help AI understand context

**Tag Best Practices**:
```
✅ Good tags:
- literature
- experiment
- bug-fix
- meeting-notes

❌ Avoid:
- untitled (meaningless)
- misc (too general)
- 123 (not descriptive)
```

---

### 3. AI Smart Organization

#### Inbox Auto-Classification

When you have many unclassified messages in Inbox:

1. Click **"🤖 AI Organize"** button
2. AI analyzes all message content
3. Automatically suggests project assignments
4. Click suggestions to move messages

**How it works**:
- Uses vector embeddings to calculate message-project similarity
- Based on content, tags, and historical patterns
- Learns your usage habits

---

### 4. AI Copilot Chat

#### Open Copilot

1. Click **"Copilot"** tab in right panel
2. Or click ✨ Copilot icon in sidebar

#### Use Cases

**Scenario 1: Analyze Message Content**
```
You: Summarize the key points of this message
AI:  Based on your message, the main points include:
     1. Experiment shows 15% throughput increase
     2. Need to verify if caused by new cache layer
     3. Recommend further performance analysis
```

**Scenario 2: Generate Report**
```
You: Generate weekly report from recent experiment messages
AI:  Weekly Experiment Progress Report:

     ## Overview
     - Completed 3 performance tests
     - Identified 2 optimization points

     ## Key Findings
     ...
```

**Scenario 3: Answer Questions**
```
You: How does Transformer attention mechanism work?
AI:  Based on your literature notes [Ref: msg-001],
     the attention mechanism works through...
```

#### Context Awareness

- When a message is selected, AI automatically loads it as context
- References shown as **[Ref: xxx]** in conversations
- Click references to jump to original message

---

## ⚙️ AI Configuration Guide

### Supported LLM Providers

| Provider | Local/Cloud | Cost | Speed | Best For |
|----------|-------------|------|-------|----------|
| **Ollama** | Local | Free | Medium | Privacy, offline use |
| **Gemini** | Cloud | Low | Fast | Beginners, quick start |
| **OpenAI** | Cloud | Medium-High | Fast | Best quality |
| **Custom** | Custom | Custom | Custom | Enterprise, special needs |

### Configuration Steps

#### Option 1: Ollama (Recommended)

**Installation**:
```bash
# macOS / Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows
# Download from https://ollama.ai/download
```

**Start Service**:
```bash
ollama serve
```

**Pull Models**:
```bash
# Chat model (choose one)
ollama pull llama3.2        # 3B, fast
ollama pull mistral         # 7B, better quality

# Embedding model (required)
ollama pull nomic-embed-text
```

**Configure in Strata**:
1. Settings > Models > LLM Configuration
   - Provider: `Ollama (Local)`
   - Model Name: `llama3.2`
   - Base URL: `http://localhost:11434`
   - API Key: (leave empty)

2. Embedding Configuration
   - Provider: `Ollama (Local)`
   - Model Name: `nomic-embed-text`
   - Base URL: `http://localhost:11434`

3. Click "Test Connection"
4. After seeing ✓ success, click "Save Changes"

---

#### Option 2: Google Gemini

**Get API Key**:
1. Visit https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the generated key (starts with `AIza`)

**Configure in Strata**:
1. Settings > Models > LLM Configuration
   - Provider: `gemini`
   - Model Name: `gemini-2.5-flash` (recommended) or `gemini-pro`
   - Base URL: (leave empty)
   - API Key: Paste your API key

2. Click "Test Connection"
3. After success, click "Save Changes"

**Pricing**:
- Gemini has free tier: 60 requests/minute
- Flash model is cost-effective for frequent use
- Details: https://ai.google.dev/pricing

---

#### Option 3: OpenAI

**Get API Key**:
1. Visit https://platform.openai.com/api-keys
2. Create new API key
3. Copy key (starts with `sk-`)

**Configure in Strata**:
1. Settings > Models > LLM Configuration
   - Provider: `openai`
   - Model Name: `gpt-3.5-turbo` or `gpt-4`
   - Base URL: (empty or `https://api.openai.com/v1`)
   - API Key: Paste your key

2. Click "Test Connection"
3. Save configuration

**Pricing**:
- GPT-3.5-turbo: $0.50 / 1M tokens (input)
- GPT-4: More expensive but best quality
- Requires credit card

---

## 💡 Common Use Cases

### Use Case 1: Academic Research

**Project Structure**:
```
📚 PhD Thesis: Neural Network Architecture
  ├── 📖 Literature Review
  ├── 🧪 Experiment 1: Baseline
  ├── 🧪 Experiment 2: Optimization
  └── ✍️ Paper Writing
```

**Workflow**:
1. **Reading papers**: Create messages with key insights, attach PDFs
2. **Experiment logs**: Create new message for each experiment
3. **Use AI**: Let Copilot summarize recent findings
4. **Find related**: View semantically related messages in Info panel

---

### Use Case 2: Software Development

**Project Structure**:
```
💻 Project: Strata Development
  ├── 🐛 Bug Fixes
  ├── ✨ New Feature: AI Organize
  ├── 📝 Documentation
  └── 🚀 Deployment
```

**Workflow**:
1. **Bug tracking**: One message per bug with error logs
2. **Code snippets**: Save useful code with `code` tag
3. **Meeting notes**: Summarize team discussions
4. **AI assistance**: Ask Copilot for optimization suggestions

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Function |
|----------|----------|
| `Ctrl/Cmd + N` | New message |
| `Ctrl/Cmd + F` | Focus search |
| `Ctrl/Cmd + S` | Save current edit |
| `Ctrl/Cmd + K` | Command palette (future) |
| `Esc` | Close modal/cancel |
| `Ctrl/Cmd + ,` | Open settings |
| `F12` | Developer tools |

---

## 🔧 FAQ

### Q1: AI chat not working?

**Checklist**:
- [ ] Did you configure LLM in Settings?
- [ ] Did "Test Connection" succeed?
- [ ] Did you click "Save Changes"?
- [ ] Still not working after refresh?

**Solutions**:
1. Open Settings > Models, check configuration
2. Click "Test Connection" for detailed errors
3. See [LLM Config Guide](../LLM_CONFIG_GUIDE.md)
4. See [Troubleshooting](../TROUBLESHOOTING.md)

**Quick fix**: Switch to Ollama, no CORS issues!

---

### Q2: How to backup my data?

**Browser Version**:
Data is stored in LocalStorage.

**Export Data**:
1. Press `F12` for developer tools
2. Application > Local Storage
3. Copy `strata_messages` and `strata_tasks` values
4. Save to text file

**Future**: One-click export feature

**Electron Version**:
Data stored at:
- PGlite: `~/.config/Electron/strata.db`
- LanceDB: `~/.config/Electron/lance/`
- KuzuDB: `~/.config/Electron/kuzu/`

Regularly backup these directories.

---

### Q3: How to delete demo data?

1. Click 🗑️ delete icon on demo message card
2. Right-click "Demo Project" in sidebar
3. Select "Delete Project"

**Reset all data**:
1. Press `F12` for developer tools
2. In Console tab, enter:
   ```javascript
   localStorage.clear()
   location.reload()
   ```

---

## 📚 More Resources

### Documentation

- [Quick Start Guide](../QUICKSTART.md) - Get started in 5 minutes
- [LLM Config Guide](../LLM_CONFIG_GUIDE.md) - Detailed AI configuration
- [Troubleshooting](../TROUBLESHOOTING.md) - Common issues
- [Architecture](../ARCHITECTURE_SUMMARY.md) - Technical architecture
- [Implementation Guide](../IMPLEMENTATION_GUIDE.md) - Developer docs

### External Links

- [Ollama Official Site](https://ollama.ai/)
- [Google AI Studio](https://aistudio.google.com/)
- [OpenAI Platform](https://platform.openai.com/)

---

## 🎉 Get Started

Ready to begin?

1. ✅ Configure AI service (Settings > Models)
2. ✅ Create your first project
3. ✅ Add a message
4. ✅ Try chatting with AI Copilot

**Enjoy using Strata!** 🚀

---

**Version**: 1.0.0
**Last Updated**: 2025-12-11
**License**: MIT
