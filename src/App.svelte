<script lang="ts">
    import { defaultMove, pieceTypes, startingBoard } from './data/pieces';
    import Board from './lib/Board.svelte';
   
    
    let board = startingBoard()
</script>

<main>
    <Board {board} />
</main>
