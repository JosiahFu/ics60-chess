function associate<K extends string | number | symbol, V>(keys: K[], transform: (key: K) => V) {
    const map: Partial<Record<K, V>> = {}
    for (const key of keys)
        map[key] = transform(key)
    return map as Record<K, V>
}

export { associate }