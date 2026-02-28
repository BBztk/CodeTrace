/**
 * CodeTrace Recorder v1.0
 * 核心逻辑：拦截编辑器行为并记录字符级状态快照
 */
export class CodeRecorder {
  constructor(el) {
    this.el = el;
    this.logs = [];
    this.startTime = 0;
    this.isRecording = false;

    // 自动配对映射表
    this.pairs = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'",
      '`': '`'
    };
  }

  /** 开始录制 */
  start() {
    this.logs = [];
    this.startTime = Date.now();
    this.isRecording = true;
    
    // 绑定事件（使用 bind 确保 this 指向）
    this.el.addEventListener('keydown', this.handleKeydown);
    this.el.addEventListener('input', this.handleInput);
    
    // 初始状态
    this.recordState();
    console.log("CodeTrace: Recording started...");
  }

  /** 键盘按下：处理 Tab 和 自动补全 */
  handleKeydown = (e) => {
    if (!this.isRecording) return;
    
    const { selectionStart: start, selectionEnd: end, value } = this.el;

    // 1. 处理 Tab 键 (插入 4 个空格)
    if (e.key === 'Tab') {
      e.preventDefault();
      this.el.value = value.substring(0, start) + "    " + value.substring(end);
      this.el.selectionStart = this.el.selectionEnd = start + 4;
      this.triggerInput(); 
    }

    // 2. 处理自动配对 (括号、引号)
    else if (this.pairs[e.key]) {
      e.preventDefault();
      const closePair = this.pairs[e.key];
      // 插入一对符号
      this.el.value = value.substring(0, start) + e.key + closePair + value.substring(end);
      // 将光标置于中间
      this.el.selectionStart = this.el.selectionEnd = start + 1;
      this.triggerInput();
    }
  };

  /** 统一记录函数 */
  handleInput = () => {
    if (!this.isRecording) return;
    this.recordState();
  };

  /** 核心快照逻辑 */
  recordState() {
    const now = Date.now();
    const lastLog = this.logs[this.logs.length - 1];
    
    this.logs.push({
      t: now,
      dt: lastLog ? now - lastLog.t : 0, // 距离上一帧的时间增量
      v: this.el.value,                 // 当前内容快照
      c: this.el.selectionStart          // 当前光标位置
    });
  }

  /** 手动触发 Input 事件以确保快照被截取 */
  triggerInput() {
    this.el.dispatchEvent(new Event('input'));
  }

  /** 停止录制并返回数据 */
  stop() {
    this.isRecording = false;
    this.el.removeEventListener('keydown', this.handleKeydown);
    this.el.removeEventListener('input', this.handleInput);
    return JSON.stringify(this.logs);
  }

  /** 下载 JSON 文件 */
  download() {
    const data = this.stop();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codetrace-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}