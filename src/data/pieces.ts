import type { Color, Board } from "./game";
import {coordsBetween} from "../util/coordsBetween";

type PieceName = 'PAWN' | 'ROOK' | 'KNIGHT' | 'BISHOP' | 'KING' | 'QUEEN'

const pieceNames: PieceName[] = ['PAWN', 'ROOK', 'KNIGHT', 'BISHOP', 'QUEEN', 'KING']

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
                piece[0] = ['PAWN']
                board[targetY - 1][targetX] = null
                return passanted
            }
            return prevPiece
        },
        display: '\u265f\ufe0e',
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

export { type PieceName, type Piece, type PieceType, pieceTypes, pieceNames, defaultMove, colorOf, typesOf, hasMoved }

