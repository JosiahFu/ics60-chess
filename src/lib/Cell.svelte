<script lang="ts">
    import { colorOf, pieceNames, pieceTypes, typesOf, type Piece } from '../data/pieces';

    export let piece: Piece | null
    export let selected = false
    export let canMove = false
    export let canCapture = false

    $: types = typesOf(piece) ?? []
</script>

<button
    class="cell"
    class:selected
    class:canMove
    class:canCapture
    class:black={colorOf(piece) === 'BLACK'}
    on:click>
    {#if piece !== null}
        <div class="typegrid">
            {#each pieceNames as pieceName}
                <div>
                    {#if types.includes(pieceName)}
                        {pieceTypes[pieceName].display}
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
</button>

<style>
    .cell {
        font-size: 2em;
        display: block;
        height: 100px;
        width: 100px;
        color: #ffffff;
    }

    .typegrid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, 1fr);
    }

    .black {
        color: black;
    }

    .selected {
        background-color: #acff2f7e;
    }

    .canMove {
        background-color: #ffff4e98;
    }

    .canCapture {
        background-color: #ff434381;
    }

    button {
        border: none;
        padding: 0;
        background-color: transparent;
    }
</style>
