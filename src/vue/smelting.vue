<template>
<div class="sectionWrapper">
    <h1> Smelting </h1>


    <section class="borderSection">
        <div class="title center">
            Smelting Operators (Global)
        </div>
        <div class="content">
            <smelting-staff />
        </div>
    </section>

    <div class="smeltingWrapper">
        <canvas id="smeltingCanvas"></canvas>
    </div>
</div>

</template>
<script>
import Plinko from "../js/Plinko.js";
import smeltingStaff from "../vue/smeltingStaff.vue";



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
        'smelting-staff': smeltingStaff,
    },
    methods: {

    },

}
</script>