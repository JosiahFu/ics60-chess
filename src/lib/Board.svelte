<script lang="ts">
    import { defaultMove, pieceCounts, pieceTypes, typesOf, type Game, type Piece, type Color, colorOf, pieceNames } from '../data/pieces';
    import { combinations } from '../util/combinations';
    import Cell from './Cell.svelte';
    import Table from './Table.svelte';
    
    export let game: Game
    export let selectedX: number | undefined = undefined
    export let selectedY: number | undefined = undefined

    function nonNull<T>(value: T | undefined | null): T {
        return value as T
    }

    function resolve() {
        for (const consideredTypes of combinations(pieceNames)) {
        // for (const consideredTypes of [[pieceTypes.ROOK, pieceTypes.QUEEN]]) {
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

    $: reverseBoard = game.board.toReversed()
    $: gamePieces = [...new Set(game.board.flat(1).filter(e => e !== null).concat(game.captured))]
    $: selectedPiece = selectedX !== undefined && selectedY !== undefined ? game.board[selectedY][selectedX] : null
    $: [selectedType, selectedColor] = selectedPiece ?? [undefined, undefined]
    $: relativeBoard = selectedColor === 'BLACK' ? reverseBoard : game.board
    $: relativeSelectedY = selectedY === undefined ? undefined : selectedColor === 'BLACK' ? 7 - selectedY : selectedY
</script>

<main>
    <Table data={reverseBoard} let:value={piece} let:column={x} let:row>
        {@const y = 7 - row}
        {@const relativeY = selectedColor === 'BLACK' ? 7 - y : y}
        {@const moveableTypes = selectedX !== undefined && selectedY !== undefined && (x !== selectedX || y !== selectedY) && selectedType !== undefined ? selectedType.filter(type => pieceTypes[type].canMoveTo(relativeBoard, nonNull(selectedPiece), nonNull(selectedX), nonNull(relativeSelectedY), x, relativeY)) : []}
        {@const canMove = moveableTypes.length > 0}
        <Cell
            {piece}
            selected={x === selectedX && y == selectedY}
            canMove={canMove && (piece === null || piece[1] === selectedColor)}
            canCapture={canMove && (piece !== null && piece[1] !== selectedColor)}
            on:click={() => {
                if (selectedX === undefined || selectedY === undefined) {
                    selectedX = x
                    selectedY = y
                } else {
                    if (selectedPiece !== null && canMove) {
                        const type = moveableTypes[0]; // this semicolon is mandatory

                        const captured = (pieceTypes[type].moveTo ?? defaultMove)(relativeBoard, selectedPiece, selectedX, nonNull(relativeSelectedY), x, relativeY)
                        
                        if (captured !== null) {
                            captured[0] = typesOf(captured).filter(type => type !== 'KING')
                            game.captured.push(captured)
                        }

                        selectedPiece[0] = moveableTypes // Can no longer use this
                        resolve()
                        game = game
                    }
                    selectedX = undefined
                    selectedY = undefined
                }
            }}
        />
    </Table>
</main>
