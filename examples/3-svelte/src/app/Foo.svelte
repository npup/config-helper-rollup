<script>
    export let count;
    const foo = () => {
        console.log("count:", count);
    };
</script>

<div class="inner">
    Count is: <span class="count">{ count }</span>.
</div>


<style>
    .inner {
        font-family: Consolas, sans-serif;
    }
    .count {
        font-weight: bold;
    }
</style>
