<script lang="ts" generics="T">
    export let data: T[][]
</script>

<table>
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
    td {
        background-color: #e2d3b3;
        padding: 0;
    }

    tr:nth-child(2n) td:nth-child(2n+1), tr:nth-child(2n+1) td:nth-child(2n) {
        background-color: rgb(80, 160, 80);
    }

    table {
        border-collapse: collapse;
    }
</style>
