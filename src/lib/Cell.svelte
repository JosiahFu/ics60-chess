<script lang="ts">
    import { pieceTypes, typesOf, type Piece } from '../data/pieces';

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
    {piece === undefined ? '' : typesOf(piece).map(type => pieceTypes[type].display).join(' ')}
</button>

<style>
    .cell {
        font-size: 2em;
        display: block;
        height: 100px;
        width: 100px;
        color: #ffffff;
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
