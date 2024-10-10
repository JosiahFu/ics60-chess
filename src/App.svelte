<script lang="ts">
    import type { Writable } from 'svelte/store';
    import { startingBoard, startingGame, type Game } from './data/pieces';
    import Board from './lib/Board.svelte';
    import { peerClient, peerHost, type ClientStore, type HostStore } from './lib/store/peer';
    import MultiplayerGame from './lib/MultiplayerGame.svelte';

    let id = ''
    let mode: undefined | 'host' | 'client' = undefined
</script>

<main>
    {#if mode === undefined}
        <input bind:value={id} placeholder="id" />
        <button disabled={!id} on:click={() => mode = 'host'}>Start New Game</button>
        <button disabled={!id} on:click={() => mode = 'client'}>Join Game</button>
    {:else}
        <MultiplayerGame {id} client={mode === 'client'} />
    {/if}
</main>
