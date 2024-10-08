<script lang="ts">
    import { defaultMove, pieces, startingBoard } from './data/pieces';
    import Board from './lib/Board.svelte';
   
    
    let board = startingBoard()
</script>

<main>
    <Board {board} />
</main>
