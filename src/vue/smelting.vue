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
        <div class="smeltingStatus" v-if="!machineShowing">
            <div class="alphaTitle"> Smelting is disabled until operators are hired. </div>
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
            machineShowing: false,
            plinko: null
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
            this.initPlinko();
        }



    },
    watch: {
        smeltOps: function(){
            if(this.inc.smeltingActive && this.machineShowing == false){
                // Init machine
                this.machineShowing = true;
                this.initPlinko();
                // Init plinko board and tell main class it should start updating
            }
        }

    },
    destroyed: function(){
        // Stop plinko board from operating
        window.cancelAnimationFrame(this.plinko.animFrame);
        this.inc.plinkoMining = false;
        this.inc.plinko = null;
    },
    components: {
        'smelting-staff': smeltingStaff,
    },
    methods: {
        initPlinko: function(){
            this.plinko = new Plinko(this.canvas);
            this.plinko.reset();
            this.plinko.loop();
            this.inc.plinkoMining = true;
            this.inc.plinko = this.plinko;

            // We need to tell the main class to start mining

        }

    },


}
</script>