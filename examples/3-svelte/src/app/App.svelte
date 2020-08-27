<script>
    import Foo from "./Foo.svelte";

    let count = 0;
    const update = () => {
        count += 2;
    };

</script>

<div>
    <h2>This is a svelte app</h2>
    <button on:click={ update }>Click me</button>
    <hr />
    <Foo count={ count } />
</div>
