<template>
<div class="sectionWrapper">
    <h1> Mining </h1>

    <section class="borderSection">
        <div class="title center">
            Miners (Global)
        </div>
        <div class="content">
            <mining-staff />
        </div>
    
    </section>


</div>
</template>
<script>
import * as Helper from "../js/Helper.js";
import miningStaff from "../vue/miningStaff.vue";

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
        'mining-staff': miningStaff,

    },
    methods: {

    },

}
</script>