/**
 * Generates all possible combinations of certain elements.<p>
 * For example, `combinations([1, 2, 3])` -> `[[1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]`
 * 
 * @param values The values to make combinations of
 */
function* combinations<T>(values: T[]) {
    const max = Math.pow(2, values.length) - 1
    for (let i = 1; i <= max; i++) {
        yield values.filter((_, j) => ((max - Math.pow(2, j)) | i) === max)
    }
}

export { combinations }
