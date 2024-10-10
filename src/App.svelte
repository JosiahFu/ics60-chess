<script lang="ts">
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
