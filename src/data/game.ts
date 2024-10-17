import {array} from "../util/array";
import {combinations} from "../util/combinations";
import {colorOf, type Piece, type PieceName, pieceNames, typesOf} from "./pieces";

type Board = (Piece | null /*JSON cannot encode undefined*/)[][]

type Color = 'BLACK' | 'WHITE'
const colors: Color[] = ['BLACK', 'WHITE']

interface Game {
    board: Board
    captured: Piece[]
    turn: Color
}

const pieceCounts: Record<PieceName, number> = {PAWN: 8, ROOK: 2, BISHOP: 2, KNIGHT: 2, QUEEN: 1, KING: 1}

function startingBoard(): Board {
    function emptyRow() {
        return array(8, null)
    }

    function pieceAny(color: Color) {
        return (): Piece => [[...pieceNames], color, false]
    }

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
    return {board: startingBoard(), captured: [], turn: 'WHITE'}
}

function resolve(gamePieces: Piece[]) {
    for (const consideredTypes of combinations(pieceNames)) {
        if (pieceNames.every(type => consideredTypes.includes(type))) continue

        const totalOfTypes = consideredTypes.map(type => pieceCounts[type]!).reduce((a, b) => a + b)
        for (const color of ['WHITE', 'BLACK'] satisfies Color[]) {
            // If you have x pieces that can only be certain piece types, and the total count of those piece types is x, those types cannot be used anywhere else)
            const consideredPieces = gamePieces.filter(piece => colorOf(piece) === color && typesOf(piece).every(type => consideredTypes.includes(type)))
            if (consideredPieces.length === totalOfTypes) {
                gamePieces.filter(piece => colorOf(piece) === color && !(consideredPieces.includes(piece))).forEach(piece => piece[0] = typesOf(piece).filter(e => !consideredTypes.includes(e)))
            }
        }
    }
}

function piecesOf(game: Game): Piece[] {
    return [...new Set(game.board.flat(1).filter(e => e !== null).concat(game.captured))]
}

export type { Game, Board, Color };
export { resolve, startingGame, startingBoard, pieceCounts, piecesOf };