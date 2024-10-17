<script lang="ts" generics="T">
    export let data: T[][]
    export let invertGrid = false
    export let gray = false
</script>

<table class:invertGrid class:gray>
    <tbody>
        {#each data as rowData, row}
            <tr>
                {#each rowData as cell, column}
                    <td>
                        <slot value={cell} {row} {column} />
                    </td>
                {/each}
            </tr>
        {/each}
    </tbody>
</table>

<style>
    :root {
        --grid-primary: #e2d3b3;
        --grid-secondary: #50A050;
    }

    td {
        background-color: var(--grid-primary);
        padding: 0;
    }

    .invertGrid td {
        background-color: var(--grid-secondary);
    }

    tr:nth-child(2n) td:nth-child(2n+1), tr:nth-child(2n+1) td:nth-child(2n) {
        background-color: var(--grid-secondary)
    }

    .invertGrid tr:nth-child(2n) td:nth-child(2n+1), .invertGrid tr:nth-child(2n+1) td:nth-child(2n) {
        background-color: var(--grid-primary)
    }

    .gray {
        --grid-primary: #444;
        --grid-secondary: #555;
    }

    table {
        border-collapse: collapse;
    }
</style>
