export function array<T>(length: number, element: T | ((index: number) => T)): T[] {
    return [...Array(length)].map((_, i) => typeof element === 'function' ? (element as (index: number) => T)(i) : element);
}
