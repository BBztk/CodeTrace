"use strict";
/**
 * stateMachine.ts
 * 负责维护文本状态快照和时间戳
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateMachine = void 0;
class StateMachine {
    constructor() {
        this.logs = [];
        this.startTime = 0;
    }
    /** 开始状态机 */
    start(initialContent = '', cursor = 0) {
        this.logs = [];
        this.startTime = Date.now();
        this.record(initialContent, cursor);
    }
    /** 记录一次快照 */
    record(content, cursor) {
        const now = Date.now();
        const lastLog = this.logs[this.logs.length - 1];
        const snapshot = {
            t: now,
            dt: lastLog ? now - lastLog.t : 0,
            v: content,
            c: cursor
        };
        this.logs.push(snapshot);
    }
    /** 获取所有快照 */
    getSnapshots() {
        return this.logs;
    }
    /** 停止状态机并返回快照 */
    stop() {
        return this.logs;
    }
}
exports.StateMachine = StateMachine;
