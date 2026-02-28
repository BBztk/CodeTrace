/**
 * diff.ts
 * 使用 LCS 算法计算两个字符串之间的字符级差异
 */

import { Delta } from '../types';

/**
 * 计算字符级增量差异
 * @param oldStr 上一个版本的字符串
 * @param newStr 当前版本的字符串
 * @returns Delta[] 差异操作列表
 */
export function computeDiff(oldStr: string, newStr: string): Delta[] {
  const deltas: Delta[] = [];

  // 构建 LCS 动态规划表
  const m = oldStr.length;
  const n = newStr.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldStr[i - 1] === newStr[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // 回溯 LCS，找出差异
  let i = m, j = n;
  const ops: Delta[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldStr[i - 1] === newStr[j - 1]) {
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      // 插入操作
      ops.push({ op: 'insert', pos: i, text: newStr[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      // 删除操作
      ops.push({ op: 'delete', pos: i - 1, text: oldStr[i - 1] });
      i--;
    }
  }

  // 由于回溯是逆序的，需要反转
  deltas.push(...ops.reverse());

  return deltas;
}
