<button {...$$props} on:click><slot /></button>

<style>
  button {
    padding: 0.5em;
    border-radius: 0.5em;
    background-color: #3d3d3d;
    border: none;
    font-size: inherit;
    font-family: inherit;
    transition: 0.1s;
    cursor: pointer;
  }
  
  button:disabled {
    background: #2e2e2e;
    cursor: initial;
  }
  
  button:not(:disabled):hover:not(:active) {
    background-color: #494949;
  }
</style>
