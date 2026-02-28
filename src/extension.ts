import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { Recorder } from './recorder/recorder';
import { loadJSON } from './utils/fileIO';

export function activate(context: vscode.ExtensionContext) {
  const recorder = new Recorder();

  // 开始录制
  const startCmd = vscode.commands.registerCommand('CodeTrace .startRecording', () => {
    recorder.start();
    vscode.window.showInformationMessage('CodeTrace : Recording started...');
  });

  // 停止录制并保存
  const stopCmd = vscode.commands.registerCommand('CodeTrace .stopRecording', async () => {
    await recorder.save();
    vscode.window.showInformationMessage('CodeTrace : Recording stopped and saved.');
  });

  // 回放 —— 打开浏览器
  const playbackCmd = vscode.commands.registerCommand('CodeTrace .playback', async () => {
    const data = await loadJSON();
    if (!data) {
      vscode.window.showErrorMessage('No recording loaded.');
      return;
    }

    // 将数据写入一个临时文件
    const tmpFile = path.join(os.tmpdir(), 'recording.json');
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf8');

    // 找到 index.html 的路径（假设你把它放在扩展根目录的 webview 文件夹里）
    const htmlPath = path.join(context.extensionPath, 'webview', 'index.html');

    // 拼接 file:// URL
    const url = `file://${htmlPath}`;

    // 打开浏览器
    vscode.env.openExternal(vscode.Uri.parse(url));

    vscode.window.showInformationMessage(`Playback opened in browser. JSON saved at ${tmpFile}`);
  });

  context.subscriptions.push(startCmd, stopCmd, playbackCmd);
}

export function deactivate() {}
