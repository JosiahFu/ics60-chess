function nonNull<T>(value: T | undefined | null): T {
    return value as T
}

export { nonNull }
