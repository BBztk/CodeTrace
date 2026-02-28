/**
 * player.ts
 * 播放控制器：封装 PlaybackEngine，负责 DOM 渲染
 */

import { Snapshot } from '../types';
import { PlaybackEngine } from './engine';

export class Player {
  private engine: PlaybackEngine;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.engine = new PlaybackEngine(this.render.bind(this));
  }

  /** 加载数据 */
  load(logs: Snapshot[]) {
    this.engine.load(logs);
    this.container.innerHTML = '';
  }

  /** 开始播放 */
  play() {
    this.engine.play();
  }

  /** 暂停播放 */
  pause() {
    this.engine.pause();
  }

  /** 设置倍速 */
  setSpeed(speed: number) {
    this.engine.setSpeed(speed);
  }

  /** 跳转到指定帧 */
  seek(index: number) {
    this.engine.seek(index);
  }

  /** 重置播放 */
  reset() {
    this.engine.reset();
    this.container.innerHTML = '';
  }

  /** 渲染快照到容器 */
  private render(snapshot: Snapshot) {
    const before = snapshot.v.substring(0, snapshot.c);
    const after = snapshot.v.substring(snapshot.c);

    this.container.innerHTML = '';

    const textBefore = document.createTextNode(before);
    const cursor = document.createElement('span');
    cursor.className = 'vs-cursor';
    cursor.textContent = '|'; // 显示光标
    const textAfter = document.createTextNode(after);

    this.container.appendChild(textBefore);
    this.container.appendChild(cursor);
    this.container.appendChild(textAfter);

    // 自动滚动到底部
    this.container.scrollTop = this.container.scrollHeight;
  }
}

// 暴露到全局，供 Webview 使用
(window as any).CodePlayer = Player;
