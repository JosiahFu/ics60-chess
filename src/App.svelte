<script lang="ts">
    import Board from './lib/Board.svelte';
import MultiplayerGame from './lib/MultiplayerGame.svelte';

    const queryId = new URLSearchParams(window.location.search).get('join')

    let id = queryId ?? ''
    let mode: undefined | 'same-device' | 'host' | 'client' = queryId === null ? undefined : 'client'
</script>

<main>
    {#if mode === undefined}
        <button on:click={() => mode = 'same-device'}>Single Device</button>
        <input bind:value={id} placeholder="id" />
        <div class="buttons">
            <button disabled={!id} on:click={() => mode = 'host'}>Host</button>
            <button disabled={!id} on:click={() => mode = 'client'}>Join</button>
        </div>
    {:else if mode === 'same-device'}
        <Board />
    {:else}
        <MultiplayerGame {id} client={mode === 'client'} />
        {#if mode === 'host'}
            {@const link = `${window.location.origin}${window.location.pathname}?join=${id}`}
            <p>Join link: <a href={link}>{link}</a></p>
        {/if}
    {/if}
</main>

<style>
    main {
        position: absolute;
        inset: 0;
        display: grid;
        place-content: center;
        justify-items: center;
        gap: 1em;
    }

    .buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1em;
    }

    button, input {
        font-size: inherit;
    }
</style>
