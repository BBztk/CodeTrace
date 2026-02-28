# CodeTrace

一个 VS Code 插件，用于记录代码编辑过程并支持回放，就像延时摄影一样。

## 功能

- **录制**：监听编辑器输入事件，记录字符级快照。
- **压缩**：合并连续输入，生成极小 JSON 文件。
- **回放**：在 Webview 中逐帧重现打字过程。

## 使用方法

1. 打开命令面板 (Ctrl+Shift+P / Cmd+Shift+P)。
2. 运行 `CodeTrace: Start Recording` 开始录制。
3. 编写代码，插件会自动记录。
4. 运行 `CodeTrace: Stop Recording` 停止并保存 JSON。
5. 运行 `CodeTrace: Playback` 加载 JSON 并回放。
6. 可以使用 Live Server 插件打开 `index.html` 然后上传文件查看。

## 文件结构

src/
extension.ts       # 插件入口
recorder/          # 录制逻辑
playback/          # 回放逻辑
utils/             # 工具函数
types.ts           # 公共类型定义


## 开发

```bash
npm install
npm run compile
然后在 VS Code 中按 F5 进入插件调试模式。
