<script lang="ts">
    import { startingBoard, startingGame, type Game } from '../data/pieces';
    import Board from './Board.svelte';
    import { peerClient, peerHost, type ClientStore, type HostStore } from './store/peer';

    export let id: string
    export let client = false

    const realId = `schrodingers-chess-${id}`

    const game = client ? peerClient(startingGame(), realId) : peerHost(startingGame(), realId)
    const connected = game.connected
</script>

{#if $connected === false}
    <div>Connecting...</div>
{:else}
    <Board bind:game={$game} />
{/if}
