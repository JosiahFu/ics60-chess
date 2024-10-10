import { array } from '../util/array'

type Board = (Piece | null /*JSON cannot encode undefined*/)[][]

interface Game {
    board: Board
    captured: Piece[]
}

type PieceName = 'PAWN' | 'ROOK' | 'KNIGHT' | 'BISHOP' | 'KING' | 'QUEEN'

const pieceNames: PieceName[] = ['PAWN', 'ROOK', 'KNIGHT', 'BISHOP', 'QUEEN', 'KING']

type Color = 'BLACK' | 'WHITE'

interface PieceType {
    canMoveTo(board: Board, piece: Piece, x: number, y: number, targetX: number, targetY: number): boolean
    moveTo?(board: Board, piece: Piece, x: number, y: number, targetX: number, targetY: number): Piece | null
    display: string
}

type Piece = [PieceName[], Color, moved: boolean]

function typesOf(piece: Piece): PieceName[]
function typesOf(piece: Piece | null): PieceName[] | undefined
function typesOf(piece: Piece | null) {
    return piece?.[0]
}

function colorOf(piece: Piece): Color
function colorOf(piece: Piece | null): Color | undefined
function colorOf(piece: Piece | null) {
    return piece?.[1]
}

function hasMoved(piece: Piece): boolean
function hasMoved(piece: Piece | null): boolean | undefined
function hasMoved(piece: Piece | null) {
    return piece?.[2]
}

function defaultMove(board: Board, piece: Piece, x: number, y: number, targetX: number, targetY: number): Piece | null {
    const prevPiece = board[targetY][targetX]
    board[targetY][targetX] = piece
    piece[2] = true
    board[y][x] = null
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
    return coordsBetween(x1, y1, x2, y2).every(([x, y]) => board[y][x] === null)
}

const pieceTypes: Record<PieceName, PieceType> = {
    PAWN: {
        canMoveTo(board, piece, x, y, targetX, targetY) {
            return (
                (x === targetX && (y + 1 === targetY || (!hasMoved(piece) && y + 2 === targetY && board[y + 1][targetX] === null)) && board[targetY][targetX] === null) ||
                ((x + 1 === targetX || x - 1 === targetX) && (y + 1 === targetY) && board[targetY][targetX] !== null && board[targetY][targetX]?.[1] !== colorOf(piece)) ||
                ((x + 1 === targetX || x - 1 === targetX) && (y === 4 && targetY === 5) && colorOf(board[4][targetX]) !== colorOf(piece) && (typesOf(board[4][targetX])?.includes('PAWN') ?? false)) // en passant!
            )
        },
        moveTo(board, piece, x, y, targetX, targetY) {
            const prevPiece = defaultMove(board, piece, x, y, targetX, targetY)
            if (abs(x - targetX) === 1 && targetY - y === 1 && prevPiece === null && (typesOf(board[targetY - 1][targetX])?.includes('PAWN') ?? false)) {
                const passanted = board[targetY - 1][targetX]!
                passanted[0] = ['PAWN']
                board[targetY - 1][targetX] = null
                return passanted
            }
            return prevPiece
        },
        display: '\u265f',
    },
    ROOK: {
        canMoveTo(board, piece, x, y, targetX, targetY) {
            //                                         must be evaluated after checking alignment
            return (x === targetX || y === targetY) && board[targetY][targetX]?.[1] !== colorOf(piece) && rangeEmpty(board, x, y, targetX, targetY)
        },
        display: '\u265c',
    },
    BISHOP: {
        canMoveTo(board, piece, x, y, targetX, targetY) {
            //                                             must be evaluated after checking alignment
            return abs(x - targetX) === abs(y - targetY) && board[targetY][targetX]?.[1] !== colorOf(piece) && rangeEmpty(board, x, y, targetX, targetY)
        },
        display: '\u265d',
    },
    KNIGHT: {
        canMoveTo(board, piece, x, y, targetX, targetY) {
            return (
                abs(x - targetX) === 1 && abs(y - targetY) === 2 ||
                abs(x - targetX) === 2 && abs(y - targetY) === 1
            ) && board[targetY][targetX]?.[1] !== colorOf(piece)
        },
        display: '\u265e',
    },
    KING: {
        canMoveTo(board, piece, x, y, targetX, targetY) {
            return (abs(x - targetX) <= 1 && abs(y - targetY) <= 1 && board[targetY][targetX]?.[1] !== colorOf(piece)) || (y === targetY && !hasMoved(piece) && abs(x - targetX) > 2 && !hasMoved(board[targetY][targetX]) && (typesOf(board[targetY][targetX])?.includes('ROOK') ?? false) && rangeEmpty(board, x, y, targetX, targetY))
        },
        moveTo(board, piece, x, y, targetX, targetY) {
            const targetPiece = board[targetY][targetX]
            if (typesOf(targetPiece)?.includes('ROOK') && colorOf(targetPiece) === colorOf(piece)) {
                defaultMove(board, targetPiece as Piece /*If it has type, it must not be null */, targetX, targetY, x + (targetX > x ? 1 : -1), targetY)
                targetPiece![0] = ['ROOK']
                return defaultMove(board, piece, x, y, x + (targetX > x ? 2 : -2), targetY)
            }
            return defaultMove(board, piece, x, y, targetX, targetY)
        },
        display: '\u265a',
    },
    QUEEN: {
        canMoveTo(board, piece, x, y, targetX, targetY) {
            return (x === targetX || y === targetY || abs(x - targetX) === abs(y - targetY)) && board[targetY][targetX]?.[1] !== colorOf(piece) && rangeEmpty(board, x, y, targetX, targetY)
        },
        display: '\u265b',
    },
}

const pieceCounts: Record<PieceName, number> = {PAWN: 8, ROOK: 2, BISHOP: 2, KNIGHT: 2, QUEEN: 1, KING: 1} 

function startingBoard(): Board {
    function emptyRow() {
        return array(8, null)
    }
    function pieceAny(color: Color) { return (): Piece => [[...pieceNames], color, false] }

    return ([
        array(8, pieceAny('BLACK')),
        array(8, pieceAny('BLACK')),
        emptyRow(),
        emptyRow(),
        emptyRow(),
        emptyRow(),
        array(8, pieceAny('WHITE')),
        array(8, pieceAny('WHITE')),
    ] satisfies Board).reverse()
}

function startingGame(): Game {
    return {board: startingBoard(), captured: []}
}

export { type Board, type PieceName, type Piece, type PieceType, type Color, type Game, pieceTypes, pieceNames, pieceCounts, defaultMove, startingBoard, startingGame, colorOf, typesOf, hasMoved }
