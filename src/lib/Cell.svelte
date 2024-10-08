<script lang="ts">
    import { pieces, type Piece } from '../data/pieces';

    export let piece: Piece | undefined
    export let selected = false
    export let canMove = false
    export let canCapture = false
</script>

<button
    class="cell"
    class:selected
    class:canMove
    class:canCapture
    class:black={piece?.[1] === 'BLACK'}
    on:click>
    {piece === undefined ? '' : piece[0].display}
</button>

<style>
    .cell {
        display: block;
        height: 20px;
        width: 20px;
        color: white;
    }

    .black {
        color: black;
    }

    .selected {
        background-color: greenyellow;
    }

    .canMove {
        background-color: yellow;
    }

    .canCapture {
        background-color: red;
    }

    button {
        border: none;
        padding: 0;
        background-color: transparent;
    }
</style>
