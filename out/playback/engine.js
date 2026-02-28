"use strict";
/**
 * engine.ts
 * 回放引擎：逐帧应用快照，模拟打字过程
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaybackEngine = void 0;
class PlaybackEngine {
    constructor(onRender) {
        this.logs = [];
        this.currentIndex = 0;
        this.speed = 1;
        this.isPaused = false;
        this.timer = null;
        this.onRender = onRender;
    }
    /** 加载快照数据 */
    load(logs) {
        this.logs = logs;
        this.currentIndex = 0;
        this.isPaused = false;
    }
    /** 开始回放 */
    play() {
        if (this.currentIndex >= this.logs.length)
            return;
        this.isPaused = false;
        this.step();
    }
    /** 暂停回放 */
    pause() {
        this.isPaused = true;
        if (this.timer)
            clearTimeout(this.timer);
    }
    /** 设置倍速 */
    setSpeed(s) {
        this.speed = s;
    }
    /** 回放步进逻辑 */
    step() {
        if (this.isPaused || this.currentIndex >= this.logs.length)
            return;
        const snapshot = this.logs[this.currentIndex];
        this.timer = setTimeout(() => {
            this.onRender(snapshot);
            this.currentIndex++;
            this.step();
        }, snapshot.dt / this.speed);
    }
    /** 跳转到指定索引 */
    seek(index) {
        if (index < 0 || index >= this.logs.length)
            return;
        this.currentIndex = index;
        this.onRender(this.logs[this.currentIndex]);
    }
    /** 重置回放 */
    reset() {
        this.currentIndex = 0;
        this.isPaused = false;
    }
}
exports.PlaybackEngine = PlaybackEngine;
