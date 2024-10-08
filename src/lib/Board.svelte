<script lang="ts">
    import { defaultMove, pieces, startingBoard, type Board } from '../data/pieces';
    import Cell from './Cell.svelte';
    import Table from './Table.svelte';
    
    export let board: Board
    let reverseBoard = board.toReversed()
    export let selectedX: number | undefined = undefined
    export let selectedY: number | undefined = undefined
    
    $: selectedPiece = selectedX !== undefined && selectedY !== undefined ? board[selectedY][selectedX] : undefined
    $: [selectedType, selectedColor] = selectedPiece ?? [undefined, undefined]
    $: relativeBoard = selectedColor === 'BLACK' ? reverseBoard : board
    $: relativeSelectedY = selectedY === undefined ? undefined : selectedColor === 'BLACK' ? 7 - selectedY : selectedY
</script>

<main>
    <Table data={reverseBoard} let:value={piece} let:column={x} let:row>
        {@const y = 7 - row}
        {@const relativeY = selectedColor === 'BLACK' ? 7 - y : y}
        {@const canMove = selectedX !== undefined && selectedY !== undefined && (x !== selectedX || y !== selectedY) && (selectedType?.canMoveTo(relativeBoard, selectedColor, selectedX, relativeSelectedY, x, relativeY) ?? false)}
        <Cell
            {piece}
            selected={x === selectedX && y == selectedY}
            canMove={canMove && piece === undefined}
            canCapture={canMove && piece !== undefined}
            on:click={() => {
                if (selectedX === undefined || selectedY === undefined) {
                    selectedX = x
                    selectedY = y
                } else {
                    if (selectedPiece !== undefined && canMove) {
                        if (selectedType.moveTo) {
                            selectedType.moveTo(relativeBoard, selectedColor, selectedX, relativeSelectedY, x, relativeY)
                        } else {
                            defaultMove(relativeBoard, selectedPiece, selectedX, relativeSelectedY, x, relativeY)
                        }
                        board = board
                        reverseBoard = reverseBoard
                    }
                    selectedX = undefined
                    selectedY = undefined
                }
            }}
        />
    </Table>
</main>
