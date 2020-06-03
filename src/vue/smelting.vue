<template>
<div class="sectionWrapper">
    <h1> Smelting </h1>
    <div class="smeltingWrapper">
        <canvas id="smeltingCanvas"></canvas>
    
    
    
    
    </div>
</div>

</template>
<script>
import Plinko from "../js/Plinko.js";




export default {
    data () {
        return {

        }
    },
    mounted: function(){
        let canvas = document.getElementById("smeltingCanvas");
        let plink = new Plinko(canvas);
        plink.reset();
        plink.loop();

    },
    destroyed: function(){


    },
    components: {

    },
    methods: {

    },

}
</script>