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
        <div class="smeltingStatus">
            <div class="alphaTitle" v-if="!machineShowing"> Smelting is disabled until operators are hired. </div>
        </div>
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
            inc: this.$parent.inc,
            canvas: null,
            smeltOps: this.$parent.inc.smeltingOperators,
            machineShowing: false
        }
    },
    mounted: function(){
       
        // When mounted, if we have employees start the smelting machine
        this.canvas = document.getElementById("smeltingCanvas");

        /* 
        Ok, so if we mount, or hire more than 1 operator while on this tab, the mining machine should activate.
        
        
        */
        if(this.inc.smeltingActive){
            this.machineShowing = true;
            // Init plinko board and tell main class it should start updating

        }





        // let plink = new Plinko(canvas);
        // plink.reset();
        // plink.loop();

    },
    watch: {
        smeltOps: function(){
            if(this.inc.smeltingActive && this.machineShowing == false){
                console.log("Should show smelting machine");
                // Init machine
                this.machineShowing = true;
                // Init plinko board and tell main class it should start updating
            }
        }

    },
    destroyed: function(){
        // Stop plinko board from operating


    },
    components: {
        'smelting-staff': smeltingStaff,
    },
    methods: {

    },


}
</script>