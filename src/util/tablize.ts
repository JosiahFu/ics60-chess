import { array } from "./array";

function tablize<T>(items: T[], rows: number, columns: number): (T | undefined)[][] {
    return array(rows, row => array(columns, col => items[row * columns + col]))
}

export { tablize }