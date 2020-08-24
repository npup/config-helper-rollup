<script>

    let count = 0;
    const foo = () => {
        console.log("foo count", ++count);
    };

</script>

<div>
    <h1 on:click={ foo }>A svelte app</h1>

</div>

<style>

    h1 {
        color: aquamarine;
    }

</style>
