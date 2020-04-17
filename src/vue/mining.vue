<template>
<div class="sectionWrapper">
    <h1> Mining </h1>
</div>
</template>
<script>
import * as Helper from "../js/Helper.js";

export default {
    data () {
        return {
            inc: this.$parent.inc,
        }
    },
    mounted: function(){
        console.log("MINING CREATED");
        // We need to give the mining canvas to the miner.

    },
    destroyed: function(){
        console.log("MINING DESTROYED");
        // Remove canvas and stop simulation. 


    },
    components: {

    },
    methods: {

    },

}
</script>