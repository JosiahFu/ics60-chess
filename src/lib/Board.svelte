<script lang="ts">
    import { defaultMove, pieceCounts, pieceTypes, typesOf, type Game, type Piece, type Color, colorOf, pieceNames, startingBoard, startingGame } from '../data/pieces';
    import { combinations } from '../util/combinations';
    import Cell from './Cell.svelte';
    import Table from './Table.svelte';
    
    export let game: Game = startingGame()
    export let player: Color | undefined = undefined
    export let selectedX: number | undefined = undefined
    export let selectedY: number | undefined = undefined

    function nonNull<T>(value: T | undefined | null): T {
        return value as T
    }

    function resolve() {
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

    $: reverseBoard = game.board.toReversed()
    $: gamePieces = [...new Set(game.board.flat(1).filter(e => e !== null).concat(game.captured))]
    $: selectedPiece = selectedX !== undefined && selectedY !== undefined ? game.board[selectedY][selectedX] : null
    $: relativeBoard = colorOf(selectedPiece) === 'BLACK' ? reverseBoard : game.board
    $: relativeSelectedY = selectedY === undefined ? undefined : colorOf(selectedPiece) === 'BLACK' ? 7 - selectedY : selectedY
    $: isTurn = player === undefined || game.turn === player
</script>

<div class="board">
    <div class="captured">
        {#each game.captured as piece}
            {#if colorOf(piece) === 'WHITE'}
                <Cell {piece} />
            {/if}
        {/each}
    </div>
    <Table data={player === 'BLACK' ? game.board : reverseBoard} let:value={piece} let:column={x} let:row>
        {@const y = player === 'BLACK' ? row : 7 - row}
        {@const relativeY = colorOf(selectedPiece) === 'BLACK' ? 7 - y : y}
        {@const moveableTypes = selectedX !== undefined && selectedY !== undefined && (x !== selectedX || y !== selectedY) && selectedPiece !== null ? typesOf(selectedPiece).filter(type => pieceTypes[type].canMoveTo(relativeBoard, selectedPiece, nonNull(selectedX), nonNull(relativeSelectedY), x, relativeY)) : []}
        {@const canMove = moveableTypes.length > 0}
        <Cell
            {piece}
            selected={x === selectedX && y == selectedY}
            canMove={canMove && (piece === null || colorOf(piece) === colorOf(selectedPiece))}
            canCapture={canMove && (piece !== null && colorOf(piece) !== colorOf(selectedPiece))}
            on:click={() => {
                if (!isTurn) return

                if (selectedX === undefined || selectedY === undefined) {
                    if (colorOf(piece) === game.turn) {
                        selectedX = x
                        selectedY = y
                    }
                } else {
                    if (selectedPiece !== null && canMove) {
                        const type = moveableTypes[0]; // this semicolon is mandatory

                        const prevTypes = typesOf(selectedPiece)

                        const captured = (pieceTypes[type].moveTo ?? defaultMove)(relativeBoard, selectedPiece, selectedX, nonNull(relativeSelectedY), x, relativeY)
                        
                        if (captured !== null) {
                            if (typesOf(captured).length !== 1 || typesOf(captured)[0] !== 'KING')
                            captured[0] = typesOf(captured).filter(type => type !== 'KING')
                            game.captured.push(captured)
                        }
                        
                        if (typesOf(selectedPiece) === prevTypes) // Sometimes the moveTo will modify the types
                            selectedPiece[0] = moveableTypes // Can no longer use moveableTypes
                        resolve()
                        game = game
                        game.turn = game.turn === 'WHITE' ? 'BLACK' : 'WHITE'
                    }
                    selectedX = undefined
                    selectedY = undefined
                }
            }}
        />
    </Table>
    <div class="captured">
        {#each game.captured as piece}
            {#if colorOf(piece) === 'BLACK'}
                <Cell {piece} />
            {/if}
        {/each}
    </div>
</div>

<style>
    .board {
        display: grid;
        grid-template-rows: 1fr auto 1fr;
        gap: 0.5em;
    }

    
    .captured {
        background-color: #444;
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        grid-auto-flow: row;
    }

    @media screen and (min-aspect-ratio: 1) {
        .board {
            grid-template-rows: auto;
            grid-template-columns: 1fr auto 1fr
        }

        .captured {
            grid-template-rows: repeat(8, 1fr);
            grid-template-columns: auto;
            grid-auto-flow: column;
        }
    }

    @media screen and (min-width: 480px) {
        .board {
            font-size: 1.3em;
        }
    }


    @media screen and (min-width: 720px) {
        .board {
            font-size: 1.8em;
        }
    }

    @media screen and (min-width: 1080px) {
        .board {
            font-size: 2em;
        }
    }

    @media screen and (min-width: 1440px) {
        .board {
            font-size: 2.5em;
        }
    }

</style>
