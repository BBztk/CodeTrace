"use strict";
/**
 * fileIO.ts
 * 封装 JSON 存取逻辑，自动生成文件名
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
exports.saveJSONAuto = saveJSONAuto;
exports.loadJSON = loadJSON;
const vscode = __importStar(require("vscode"));
/**
 * 自动保存 JSON 数据到工作区根目录
 * 文件名格式：codetrace-时间戳.json
 */
async function saveJSONAuto(data) {
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
async function loadJSON() {
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
