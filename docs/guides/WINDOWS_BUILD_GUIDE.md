# Windows 打包指南

## 打包成功总结

✅ **Linux 版本打包成功！**

已成功完成以下工作：
1. 将数据库从 PGlite 迁移到 better-sqlite3
2. 配置 electron-vite 构建系统
3. 配置 electron-builder 打包工具
4. 成功打包 Linux 版本到 `release/0.1.0/linux-unpacked/`

打包后的应用包含：
- ✅ better-sqlite3 原生模块已正确解包到 `app.asar.unpacked/`
- ✅ 所有依赖已正确打包
- ✅ 应用大小约 220MB（包含 Electron 运行时）

## 在 Windows 上打包

由于 WSL 环境限制，Windows 版本需要在 Windows 系统中打包。

### 步骤 1: 准备 Windows 环境

在 Windows PowerShell 或 CMD 中执行：

```bash
# 1. 克隆或复制项目到 Windows
# 如果使用 WSL，可以直接访问 WSL 文件系统
cd \\wsl$\Ubuntu\home\suntc\project\Strata

# 或者使用 git clone
git clone <your-repo-url>
cd Strata
```

### 步骤 2: 安装依赖

```bash
npm install
```

这会自动为 Windows 编译 better-sqlite3 原生模块。

### 步骤 3: 为 Electron 重新编译 better-sqlite3

```bash
npx electron-rebuild -v 30.5.1 -f -w better-sqlite3
```

### 步骤 4: 构建应用

```bash
npm run build:electron2
```

这会使用 electron-vite 构建主进程、预加载脚本和渲染进程。

### 步骤 5: 打包 Windows 版本

```bash
# 打包为便携版（推荐，无需安装）
npx electron-builder --win portable

# 或打包为安装程序
npx electron-builder --win nsis
```

打包后的文件位置：
- 便携版：`release/0.1.0/Strata OS-0.1.0-win-x64.exe`
- 安装程序：`release/0.1.0/Strata OS Setup 0.1.0.exe`

### 步骤 6: 测试应用

双击运行打包后的 `.exe` 文件，应用会：
1. 启动 Electron 窗口
2. 在 `%APPDATA%\Strata OS\` 创建 `strata.db` SQLite 数据库文件
3. 显示应用界面

检查数据库是否创建成功：
```bash
dir "%APPDATA%\Strata OS\strata.db*"
```

应该看到以下文件：
- `strata.db` - 主数据库文件
- `strata.db-shm` - 共享内存文件（WAL 模式）
- `strata.db-wal` - 预写日志文件（WAL 模式）

## 配置说明

### package.json 配置

```json
{
  "main": "out/main/index.js",
  "build": {
    "files": [
      "out/**/*",
      "node_modules/better-sqlite3/**/*",
      "package.json"
    ],
    "asarUnpack": [
      "node_modules/better-sqlite3/**/*"
    ],
    "win": {
      "target": ["portable"],
      "artifactName": "${productName}-${version}-${os}-${arch}.${ext}"
    },
    "npmRebuild": false,
    "buildDependenciesFromSource": false,
    "nodeGypRebuild": false
  }
}
```

### electron.vite.config.ts 配置

使用 `externalizeDepsPlugin()` 自动外部化原生模块：

```typescript
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    plugins: [react()]
  }
});
```

## 数据库迁移

### 从 localStorage 迁移到 SQLite

应用启动后，需要实现数据迁移逻辑：

1. 检查 localStorage 中是否有旧数据
2. 如果有，读取并插入到 SQLite 数据库
3. 迁移完成后清除 localStorage

迁移代码示例（需要在前端实现）：

```typescript
async function migrateFromLocalStorage() {
  // 检查是否已迁移
  const migrated = localStorage.getItem('data_migrated');
  if (migrated === 'true') return;

  // 读取旧数据
  const messages = JSON.parse(localStorage.getItem('messages') || '[]');
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const settings = JSON.parse(localStorage.getItem('settings') || '{}');

  // 通过 IPC 发送到主进程保存到数据库
  await window.electron.ipcRenderer.invoke('migrate-data', {
    messages,
    tasks,
    settings
  });

  // 标记为已迁移
  localStorage.setItem('data_migrated', 'true');

  // 可选：清除旧数据
  // localStorage.removeItem('messages');
  // localStorage.removeItem('tasks');
  // localStorage.removeItem('settings');
}
```

## 数据库位置

### Windows
```
C:\Users\<用户名>\AppData\Roaming\Strata OS\strata.db
```

### Linux
```
~/.config/Strata OS/strata.db
```

### macOS
```
~/Library/Application Support/Strata OS/strata.db
```

## 故障排除

### 问题 1: better-sqlite3 加载失败

**错误**: `Error: Cannot find module 'better-sqlite3'`

**解决方案**:
1. 确保 `asarUnpack` 配置包含 `node_modules/better-sqlite3/**/*`
2. 重新运行 `npx electron-rebuild`
3. 检查 `app.asar.unpacked/node_modules/better-sqlite3/` 是否存在

### 问题 2: 数据库文件无法创建

**错误**: `SQLITE_CANTOPEN: unable to open database file`

**解决方案**:
1. 检查应用是否有写入权限
2. 确保用户数据目录存在
3. 查看控制台日志中的数据库路径

### 问题 3: NODE_MODULE_VERSION 不匹配

**错误**: `The module was compiled against a different Node.js version`

**解决方案**:
```bash
# 为当前 Electron 版本重新编译
npx electron-rebuild -v 30.5.1 -f -w better-sqlite3
```

## 开发脚本

```json
{
  "scripts": {
    "dev": "vite",
    "dev:electron2": "electron-vite dev",
    "build:electron2": "electron-vite build",
    "package:win": "npm run build:electron2 && electron-builder --win portable",
    "package:linux": "npm run build:electron2 && electron-builder --linux dir",
    "package:mac": "npm run build:electron2 && electron-builder --mac dmg"
  }
}
```

## 下一步

1. ✅ Linux 打包完成
2. ⏳ 在 Windows 环境中执行上述步骤完成 Windows 打包
3. ⏳ 实现 localStorage 到 SQLite 的数据迁移逻辑
4. ⏳ 测试数据持久化功能
5. ⏳ 验证应用重启后数据是否保留

## 技术栈

- **数据库**: better-sqlite3 (SQLite)
- **构建工具**: electron-vite
- **打包工具**: electron-builder
- **Electron 版本**: 30.5.1
- **Node.js 版本**: 22.21.0

## 参考资料

- [better-sqlite3 文档](https://github.com/WiseLibs/better-sqlite3)
- [electron-vite 文档](https://electron-vite.org/)
- [electron-builder 文档](https://www.electron.build/)
