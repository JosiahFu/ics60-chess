import { array } from '../util/array'

type Board = (Piece | undefined)[][]

type PieceName = 'PAWN' | 'ROOK' | 'BISHOP' | 'KNIGHT' | 'KING' | 'QUEEN'

type Color = 'BLACK' | 'WHITE'

interface PieceType {
    canMoveTo(board: Board, color: Color, x: number, y: number, targetX: number, targetY: number): boolean
    moveTo?(board: Board, color: Color, x: number, y: number, targetX: number, targetY: number): Piece | undefined
    display: string
}

type Piece = [PieceType, Color]

function defaultMove(board: Board, piece: Piece, x: number, y: number, targetX: number, targetY: number): Piece | undefined {
    const prevPiece = board[targetY][targetX]
    board[targetY][targetX] = piece
    board[y][x] = undefined
    return prevPiece
}

const abs = Math.abs

/**
 * The interpolated axis has exclusive bounds
 */
function coordsBetween(x1: number, y1: number, x2: number, y2: number): [number, number][] {
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

function rangeEmpty(board: Board, x1: number, y1: number, x2: number, y2: number) {
    return coordsBetween(x1, y1, x2, y2).every(([x, y]) => board[y][x] === undefined)
}

const pieces: Record<PieceName, PieceType> = {
    PAWN: {
        canMoveTo(board, color, x, y, targetX, targetY) {
            return (
                (x === targetX && (y + 1 === targetY || (y === 1 && targetY === 3 && board[y + 1][targetX] === undefined)) && board[targetY][targetX] === undefined) ||
                ((x + 1 === targetX || x - 1 === targetX) && (y + 1 === targetY) && board[targetY][targetX] !== undefined && board[targetY][targetX]?.[1] !== color) ||
                ((x + 1 === targetX || x - 1 === targetX) && (y === 4 && targetY === 5) && board[4][targetX]?.[1] !== color && board[4][targetX]?.[0] === pieces.PAWN) // en passant!
            )
        },
        moveTo(board, color, x, y, targetX, targetY) {
            const prevPiece = defaultMove(board, [targetY === 7 ? pieces.QUEEN : pieces.PAWN, color], x, y, targetX, targetY)
            if (prevPiece === undefined && board[targetY - 1][targetX]?.[0] == pieces.PAWN) {
                board[targetY - 1][targetX] = undefined
                return board[targetY - 1][targetX]
            }
            return prevPiece
        },
        display: '\u265f',
    },
    ROOK: {
        canMoveTo(board, color, x, y, targetX, targetY) {
            //                                         must be evaluated after checking alignment
            return (x === targetX || y === targetY) && board[targetY][targetX]?.[1] !== color && rangeEmpty(board, x, y, targetX, targetY)
        },
        display: '\u265c',
    },
    BISHOP: {
        canMoveTo(board, color, x, y, targetX, targetY) {
            //                                             must be evaluated after checking alignment
            return abs(x - targetX) === abs(y - targetY) && board[targetY][targetX]?.[1] !== color && rangeEmpty(board, x, y, targetX, targetY)
        },
        display: '\u265d',
    },
    KNIGHT: {
        canMoveTo(board, color, x, y, targetX, targetY) {
            return (
                abs(x - targetX) === 1 && abs(y - targetY) === 2 ||
                abs(x - targetX) === 2 && abs(y - targetY) === 1
            ) && board[targetY][targetX]?.[1] !== color
        },
        display: '\u265e',
    },
    KING: {
        canMoveTo(board, color, x, y, targetX, targetY) {
            return (abs(x - targetX) <= 1 && abs(y - targetY) <= 1 && board[targetY][targetX]?.[1] !== color) || (y === 0 && targetY === 0 && abs(x - targetX) > 2 && board[targetY][targetX]?.[0] == pieces.ROOK && rangeEmpty(board, x, y, targetX, targetY))
        },
        moveTo(board, color, x, y, targetX, targetY) {
            const targetPiece = board[targetY][targetX]
            if (targetPiece?.[0] === pieces.ROOK && targetPiece[1] === color) {
                defaultMove(board, targetPiece, targetX, targetY, x + (targetX > x ? 1 : -1), targetY)
                return defaultMove(board, [pieces.KING, color], x, y, x + (targetX > x ? 2 : -2), targetY)
            }
            return defaultMove(board, [pieces.PAWN, color], x, y, targetX, targetY)
        },
        display: '\u265a',
    },
    QUEEN: {
        canMoveTo(board, color, x, y, targetX, targetY) {
            return (x === targetX || y === targetY || abs(x - targetX) === abs(y - targetY)) && board[targetY][targetX]?.[1] !== color && rangeEmpty(board, x, y, targetX, targetY)
        },
        display: '\u265b',
    },
}

function startingBoard(): Board {
    function emptyRow() {
        return array(8, undefined)
    }
    function colorRow(color: Color, pieceTypes: PieceType[]): Piece[] {
        return pieceTypes.map(type => [type, color])
    }

    return ([
        colorRow('BLACK', [pieces.ROOK, pieces.KNIGHT, pieces.BISHOP, pieces.QUEEN, pieces.KING, pieces.BISHOP, pieces.KNIGHT, pieces.ROOK]),
        array(8, () => [pieces.PAWN, 'BLACK']),
        emptyRow(),
        emptyRow(),
        emptyRow(),
        emptyRow(),
        array(8, () => [pieces.PAWN, 'WHITE']),
        colorRow('WHITE', [pieces.ROOK, pieces.KNIGHT, pieces.BISHOP, pieces.QUEEN, pieces.KING, pieces.BISHOP, pieces.KNIGHT, pieces.ROOK]),
    ] satisfies Board).reverse()
}

export { type Board, type PieceName, type Piece, type PieceType, pieces, defaultMove, startingBoard }
