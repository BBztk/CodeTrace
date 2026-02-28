/**
 * fileIO.ts
 * 封装 JSON 存取逻辑，自动生成文件名
 */

import * as vscode from 'vscode';

/**
 * 自动保存 JSON 数据到工作区根目录
 * 文件名格式：codetrace-时间戳.json
 */
export async function saveJSONAuto(data: string) {
  const fileName = `codetrace-${Date.now()}.json`;

  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) {
    vscode.window.showErrorMessage('No workspace folder open.');
    return;
  }

  const folderUri = folders[0].uri;
  const fileUri = vscode.Uri.joinPath(folderUri, fileName);

  const encoder = new TextEncoder();
  await vscode.workspace.fs.writeFile(fileUri, encoder.encode(data));

  vscode.window.showInformationMessage(`Recording saved: ${fileUri.fsPath}`);
}

/**
 * 从工作区选择并加载 JSON 文件
 */
export async function loadJSON(): Promise<any | null> {
  const uris = await vscode.window.showOpenDialog({
    filters: { 'JSON Files': ['json'] },
    canSelectMany: false,
    openLabel: 'Load Recording',
  });

  if (uris && uris.length > 0) {
    const fileData = await vscode.workspace.fs.readFile(uris[0]);
    const text = new TextDecoder().decode(fileData);
    return JSON.parse(text);
  }

  return null;
}
