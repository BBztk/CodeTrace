"use strict";
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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const recorder_1 = require("./recorder/recorder");
const fileIO_1 = require("./utils/fileIO");
function activate(context) {
    const recorder = new recorder_1.Recorder();
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
        const data = await (0, fileIO_1.loadJSON)();
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
function deactivate() { }
