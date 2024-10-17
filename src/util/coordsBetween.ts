import { array } from "./array";

const abs = Math.abs

/**
 * The interpolated axis has exclusive bounds
 */
export function coordsBetween(x1: number, y1: number, x2: number, y2: number): [number, number][] {
    if (x1 === x2) {
        return array(abs(y1 - y2) - 1, i => i + Math.min(y1, y2) + 1).map(y => [x1, y])
    } else if (y1 === y2) {
        return array(abs(x1 - x2) - 1, i => i + Math.min(x1, x2) + 1).map(x => [x, y1])
    } else if (x1 - x2 === y1 - y2) {
        return array(abs(x1 - x2) - 1, i => [i + Math.min(x1, x2) + 1, i + Math.min(y1, y2) + 1])
    } else if (x1 - x2 === -(y1 - y2)) {
        return array(abs(x1 - x2) - 1, i => [i + Math.min(x1, x2) + 1, -i + Math.max(y1, y2) - 1])
    } else {
        throw new Error(`Cannot create list of coords between (${x1}, ${y1}) and (${x2}, ${y2})`)
    }
}