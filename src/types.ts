/**
 * 公共类型定义
 * 用于 Recorder 和 Player 之间的数据传递
 */

export interface Delta {
  /** 操作类型：插入或删除 */
  op: 'insert' | 'delete';
  /** 操作位置（光标索引） */
  pos: number;
  /** 操作内容 */
  text: string;
}

export interface Snapshot {
  /** 时间戳（绝对时间） */
  t: number;
  /** 与上一帧的时间差 */
  dt: number;
  /** 当前完整文本内容 */
  v: string;
  /** 光标位置 */
  c: number;
}

export interface EventRecord {
  /** 时间戳 */
  t: number;
  /** 时间增量 */
  dt: number;
  /** 差异操作列表 */
  delta: Delta[];
  /** 当前快照 */
  snapshot: Snapshot;
}
