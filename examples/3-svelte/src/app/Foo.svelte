<script>
    export let bar;

    const foo = () => {
        console.log("foo!", bar);
    };

</script>

<fieldset>
    <legend>Foo ({ bar })</legend>
    <button on:click={ foo }></button>
</fieldset>

