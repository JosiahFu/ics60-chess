<script lang="ts">
    import { startingBoard, type Game } from './data/pieces';
    import Board from './lib/Board.svelte';
   
    
    let game: Game = { board: startingBoard(), captured: [] }
</script>

<main>
    <Board bind:game />
</main>
