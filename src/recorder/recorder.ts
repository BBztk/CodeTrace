/**
 * recorder.ts
 * 封装 VS Code API 的事件监听，调用状态机和压缩器
 */

import * as vscode from 'vscode';
import { StateMachine } from './stateMachine';
import { Compressor } from './compressor';
import { saveJSONAuto } from '../utils/fileIO';

export class Recorder {
  private stateMachine: StateMachine;
  private compressor: Compressor;
  private isRecording: boolean;

  constructor() {
    this.stateMachine = new StateMachine();
    this.compressor = new Compressor();
    this.isRecording = false;
  }

  /** 开始录制 */
  start() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor to record.');
      return;
    }

    this.isRecording = true;
    this.stateMachine.start(editor.document.getText(), editor.selection.active.character);

    vscode.workspace.onDidChangeTextDocument(e => {
      if (!this.isRecording) return;
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) return;

      this.stateMachine.record(activeEditor.document.getText(), activeEditor.selection.active.character);

      // 调试输出快照
      console.log('Snapshot recorded:', {
        text: activeEditor.document.getText(),
        cursor: activeEditor.selection.active.character
      });
    });
  }

  /** 停止录制并返回 JSON */
  stop(): string {
    this.isRecording = false;
    const snapshots = this.stateMachine.stop();
    const compressed = this.compressor.compress(snapshots);
    return JSON.stringify(compressed, null, 2);
  }

  /** 保存录制数据到文件（自动命名） */
  async save() {
    const data = this.stop();
    await saveJSONAuto(data);
  }
}
