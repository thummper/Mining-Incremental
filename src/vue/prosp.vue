<template>
<div class="mapWrapper">
    <div class="map">
        <canvas class="mapTop" id="mapDisplay"></canvas>
        <div class="split"></div>
        <div class="mapBottom">
            <land-card-small v-for="land in inc.landOwned" :land="land" />
        </div>
    </div>

</div>
</template>
<script>

import ProspCanvas from "../js/prospCanvas.js";
import landCardSmall from '../vue/landCardSmall.vue';
import * as helper from "../js/helper.js";
export default{
    data () {
        return {
            inc: this.$parent.inc,
            canvas: null,
            scaling: 1,
        }
    },
    mounted: function(){
        this.inc.prospCanvas = new ProspCanvas(document.getElementById("mapDisplay"));
    },
    destroyed: function(){
        this.inc.prospCanvas = null;
    },
    components: {
        'land-card-small': landCardSmall
    },
    methods: {
        draw: function(land){
            //Called when land card clicked. 
            this.inc.prospCanvas.setIsland(land.island);
    }
}
}
</script>
