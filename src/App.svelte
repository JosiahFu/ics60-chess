<script lang="ts">
    import { pieceNames } from './data/pieces';
    import Board from './lib/Board.svelte';
    import Button from './lib/Button.svelte';
    import Cell from './lib/Cell.svelte';
    import MultiplayerGame from './lib/MultiplayerGame.svelte';
    import { array } from './util/array';

    const letters = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']

    const queryId = new URLSearchParams(window.location.search).get('join')

    let id = queryId ?? ''
    let mode: undefined | 'same-device' | 'host' | 'client' = queryId === null ? undefined : 'client'

    $: id = [...id.toUpperCase()].filter(c => letters.includes(c)).slice(0, 4).join('')

    function host() {
        id = array(4, () => letters[Math.floor(letters.length*Math.random())]).join('')
        mode = 'host'
    }
</script>

<main>
    {#if mode === undefined}
        <h1>Constraint Chess</h1>
        <div class="big-piece">
            <Cell piece={[pieceNames, 'WHITE', false]} />
        </div>
        <div class="columns">
            <div class="column">
                <h2>Single Device</h2>
                <Button on:click={() => mode = 'same-device'}>Start</Button>
            </div>
            <div class="column">
                <h2>Multiplayer</h2>
                <Button on:click={host}>Start</Button>
                <div class="columns">
                    <input bind:value={id} placeholder="Game ID" />
                    <Button disabled={!id} on:click={() => mode = 'client'}>Join</Button>
                </div>
                <p class="sub">(Does not work with some college wifis unless both devices are on the same wifi)</p>
            </div>
        </div>
    {:else if mode === 'same-device'}
        <Board />
    {:else}
        <MultiplayerGame {id} client={mode === 'client'} />
        {#if mode === 'host'}
            {@const link = `${window.location.origin}${window.location.pathname}?join=${id}`}
            <div>Game ID: {id}</div>
            <div>Share <a href={link} on:click={event => event.preventDefault()}>this join link</a></div>
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
        justify-items: center;
    }

    .column {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1em;
        width: min-content;
    }

    .column h2 {
        width: max-content;
    }

    input {
        font-size: inherit;
        background-color: #1d1d1d;
        padding: 0.5em 1em;
        border-radius: 0.5em;
        border: none;
        width: 4em;
    }

    input:focus {
        background-color: #212121;
        outline: none;
    }

    h1, h2, p {
        margin: 0;
    }

    .sub {
        font-size: 0.7em;
        opacity: 0.7;
    }

    .big-piece {
        font-size: 4em;
        display: contents;
    }
</style>
