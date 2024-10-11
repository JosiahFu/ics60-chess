<script lang="ts">
    import Board from './lib/Board.svelte';
import MultiplayerGame from './lib/MultiplayerGame.svelte';

    const queryId = new URLSearchParams(window.location.search).get('join')

    let id = queryId ?? ''
    let mode: undefined | 'same-device' | 'host' | 'client' = queryId === null ? undefined : 'client'
</script>

<main>
    {#if mode === undefined}
        <h1>Constrained Chess</h1>
        <div class="columns">
            <div class="column">
                <h2>Single Device</h2>
                <button on:click={() => mode = 'same-device'}>Start</button>
            </div>
            <div class="column">
                <h2>Multiplayer</h2>
                <p>(not working)</p>
                <input bind:value={id} placeholder="id" />
                <div class="columns">
                    <button disabled={!id} on:click={() => mode = 'host'}>Host</button>
                    <button disabled={!id} on:click={() => mode = 'client'}>Join</button>
                </div>
            </div>
        </div>
    {:else if mode === 'same-device'}
        <Board />
    {:else}
        <MultiplayerGame {id} client={mode === 'client'} />
        {#if mode === 'host'}
            {@const link = `${window.location.origin}${window.location.pathname}?join=${id}`}
            <div>Join link: <a href={link}>{link}</a></div>
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

    .columns {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1em;
    }

    .column {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1em;
    }

    button, input {
        font-size: inherit;
    }

    h1, h2, p {
        margin: 0;
    }
</style>
