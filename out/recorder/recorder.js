"use strict";
/**
 * recorder.ts
 * 封装 VS Code API 的事件监听，调用状态机和压缩器
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recorder = void 0;
const vscode = __importStar(require("vscode"));
const stateMachine_1 = require("./stateMachine");
const compressor_1 = require("./compressor");
const fileIO_1 = require("../utils/fileIO");
class Recorder {
    constructor() {
        this.stateMachine = new stateMachine_1.StateMachine();
        this.compressor = new compressor_1.Compressor();
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
            if (!this.isRecording)
                return;
            const activeEditor = vscode.window.activeTextEditor;
            if (!activeEditor)
                return;
            this.stateMachine.record(activeEditor.document.getText(), activeEditor.selection.active.character);
            // 调试输出快照
            console.log('Snapshot recorded:', {
                text: activeEditor.document.getText(),
                cursor: activeEditor.selection.active.character
            });
        });
    }
    /** 停止录制并返回 JSON */
    stop() {
        this.isRecording = false;
        const snapshots = this.stateMachine.stop();
        const compressed = this.compressor.compress(snapshots);
        return JSON.stringify(compressed, null, 2);
    }
    /** 保存录制数据到文件（自动命名） */
    async save() {
        const data = this.stop();
        await (0, fileIO_1.saveJSONAuto)(data);
    }
}
exports.Recorder = Recorder;
