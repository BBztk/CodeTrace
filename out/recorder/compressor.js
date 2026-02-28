"use strict";
/**
 * compressor.ts
 * 压缩逻辑：合并连续输入，减少 JSON 体积
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compressor = void 0;
class Compressor {
    /**
     * 压缩快照列表
     * @param snapshots 原始快照数组
     * @returns 压缩后的快照数组
     */
    compress(snapshots) {
        if (snapshots.length === 0)
            return [];
        const result = [];
        let buffer = snapshots[0];
        for (let i = 1; i < snapshots.length; i++) {
            const current = snapshots[i];
            // 如果时间间隔很短（例如 < 50ms），合并到 buffer
            if (current.dt < 50) {
                buffer = {
                    ...current,
                    dt: buffer.dt + current.dt,
                    v: current.v,
                    c: current.c
                };
            }
            else {
                result.push(buffer);
                buffer = current;
            }
        }
        result.push(buffer);
        return result;
    }
}
exports.Compressor = Compressor;
