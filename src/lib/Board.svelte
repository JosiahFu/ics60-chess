<script lang="ts">
    import {
        colorOf,
        defaultMove,
        pieceTypes,
        typesOf
    } from '../data/pieces';
    import Cell from './Cell.svelte';
    import Table from './Table.svelte';
    import { nonNull } from "../util/nonNull";
    import {type Color, type Game, piecesOf, resolve, startingGame} from "../data/game";
    import {tablize} from "../util/tablize";
    import {associate} from "../util/associate";

    export let game: Game = startingGame()
    export let player: Color | undefined = undefined
    export let selectedX: number | undefined = undefined
    export let selectedY: number | undefined = undefined

    let screenWidth: number
    let screenHeight: number
    $: horizontalLayout = screenWidth >= screenHeight

    $: reverseBoard = game.board.toReversed()
    $: gamePieces = piecesOf(game)
    $: selectedPiece = selectedX !== undefined && selectedY !== undefined ? game.board[selectedY][selectedX] : null
    $: relativeBoard = colorOf(selectedPiece) === 'BLACK' ? reverseBoard : game.board
    $: relativeSelectedY = selectedY === undefined ? undefined : colorOf(selectedPiece) === 'BLACK' ? 7 - selectedY : selectedY
    $: isTurn = player === undefined || game.turn === player

    $: captured1 = game.captured.filter(piece => colorOf(piece) === (player ?? 'WHITE'))
    $: captured2 = game.captured.filter(piece => colorOf(piece) !== (player ?? 'WHITE'))
    $: captureRows = Math.ceil(Math.max(captured1.length, captured2.length) / 8)
</script>

<svelte:window bind:innerWidth={screenWidth} bind:innerHeight={screenHeight} />

<div class="board" class:horizontalLayout>
    <Table gray invertGrid={captureRows % 2 === 0} data={tablize(captured1, horizontalLayout ? 8 : captureRows, horizontalLayout ? captureRows : 8)} let:value={piece}>
        <Cell piece={piece ?? null} disabled />
    </Table>
    <Table data={player === 'BLACK' ? game.board : reverseBoard} let:value={piece} let:column={x} let:row>
        {@const y = player === 'BLACK' ? row : 7 - row}
        {@const relativeY = colorOf(selectedPiece) === 'BLACK' ? 7 - y : y}
        {@const moveableTypes = selectedX !== undefined && selectedY !== undefined && (x !== selectedX || y !== selectedY) && selectedPiece !== null ? typesOf(selectedPiece).filter(type => pieceTypes[type].canMoveTo(relativeBoard, selectedPiece, nonNull(selectedX), nonNull(relativeSelectedY), x, relativeY)) : []}
        {@const canMove = moveableTypes.length > 0}
        <Cell
            {piece}
            selected={x === selectedX && y === selectedY}
            canMove={canMove && (piece === null || colorOf(piece) === colorOf(selectedPiece))}
            canCapture={canMove && (piece !== null && colorOf(piece) !== colorOf(selectedPiece))}
            active={isTurn && ((selectedX === undefined || selectedY === undefined) ? colorOf(piece) === game.turn : selectedPiece !== null && canMove)}
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

                        resolve(gamePieces)

                        game = game
                        game.turn = game.turn === 'WHITE' ? 'BLACK' : 'WHITE'
                    }
                    selectedX = undefined
                    selectedY = undefined
                }
            }}
        />
    </Table>
    <Table gray invertGrid data={tablize(captured2, horizontalLayout ? 8 : captureRows, horizontalLayout ? captureRows : 8)} let:value={piece}>
        <Cell piece={piece ?? null} disabled />
    </Table>
</div>

<style>
    .board {
        display: grid;
        grid-template-rows: 1fr auto 1fr;
        gap: 0.5em;
    }

    .board.horizontalLayout {
        grid-template-rows: auto;
        grid-template-columns: 1fr auto 1fr
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
