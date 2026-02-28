/**
 * CodeTrace Player v1.0
 */
export class CodePlayer {
  constructor(displayEl) {
    this.el = displayEl;
    this.logs = [];
    this.timer = null;
    this.currentIndex = 0;
    this.speed = 1;
    this.isPaused = true;
  }

  load(data) {
    this.logs = typeof data === 'string' ? JSON.parse(data) : data;
    this.currentIndex = 0;
    this.isPaused = true;
    this.render('', 0);
  }

  play() {
    if (this.isPaused && this.currentIndex < this.logs.length) {
      this.isPaused = false;
      this.step();
    }
  }

  pause() {
    this.isPaused = true;
    clearTimeout(this.timer);
  }

  step() {
    if (this.isPaused || this.currentIndex >= this.logs.length) return;

    const action = this.logs[this.currentIndex];
    
    this.timer = setTimeout(() => {
      this.render(action.v, action.c);
      this.currentIndex++;
      this.el.scrollTop = this.el.scrollHeight;
      this.step();
    }, action.dt / this.speed);
  }

  render(content, cursorIdx) {
    // 确保内容被正确切分，光标位于指定索引位置
    const before = content.substring(0, cursorIdx);
    const after = content.substring(cursorIdx);
    
    this.el.innerHTML = '';
    const textBefore = document.createTextNode(before);
    const cursor = document.createElement('span');
    cursor.className = 'vs-cursor';
    const textAfter = document.createTextNode(after);
    
    this.el.appendChild(textBefore);
    this.el.appendChild(cursor); // 光标始终位于 before 之后
    this.el.appendChild(textAfter);
  }

  setSpeed(s) { this.speed = s; }
}