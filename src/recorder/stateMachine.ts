/**
 * stateMachine.ts
 * 负责维护文本状态快照和时间戳
 */

import { Snapshot } from '../types';

export class StateMachine {
  private logs: Snapshot[] = [];
  private startTime = 0;

  /** 开始状态机 */
  start(initialContent: string = '', cursor: number = 0) {
    this.logs = [];
    this.startTime = Date.now();
    this.record(initialContent, cursor);
  }

  /** 记录一次快照 */
  record(content: string, cursor: number) {
    const now = Date.now();
    const lastLog = this.logs[this.logs.length - 1];

    const snapshot: Snapshot = {
      t: now,
      dt: lastLog ? now - lastLog.t : 0,
      v: content,
      c: cursor
    };

    this.logs.push(snapshot);
  }

  /** 获取所有快照 */
  getSnapshots(): Snapshot[] {
    return this.logs;
  }

  /** 停止状态机并返回快照 */
  stop(): Snapshot[] {
    return this.logs;
  }
}
