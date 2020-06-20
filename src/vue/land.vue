<template>
<div class="sectionWrapper">
    <div class="mapLocations shadow flex-col">
        <div class="shadow-title map-title">
            Owned Land
        </div>
        <div class="flex-row wrap">

            <div class="horizCardWrapper">
                <div class="landTitle bold"> Developed Land ({{developedLand}}) </div>
                <div class="horizScroll">
                    <land-card v-for="land in devLandArray" v-bind:key="land.name"  :land="land" />
                </div>
            </div>

            <div class="horizCardWrapper">
                <div class="landTitle bold">Undeveloped Land ({{undevelopedLand}})</div>
                <div class="horizScroll" data-simplebar data-simplebar-auto-hide="false"> 
                    <land-card v-for="land in landArray" v-bind:key="land.name"  :land="land" />
                </div>
            </div>

 

            


        
            
        </div>
    </div>

    <div class="locationWrapper shadow flex-col">
        <div class="shadow-title map-title">
            Land For Sale
        </div>
        <div class="flex-row wrap">
            <land-card v-for="land in inc.landSale" v-bind:key="land.name" :land="land" />
        </div>
    </div>


</div>
</template>
<script>



import landCard from '../vue/landCard.vue';
import * as Helper from "../js/Helper.js";

export default{
    data () {
        return {
            inc: this.$parent.inc,
        }
    },
    mounted: function(){
 
    },
    components: {
        'land-card': landCard,
   
    
    },
    computed:{
        devLandArray(){
            let devLand = [];
            for(let land of this.inc.landOwned){
                if(land.developed){
                    devLand.push(land);
                }
            }
            return devLand;
        },
        landArray(){
            let undev = [];
            for(let land of this.inc.landOwned){
                if(!land.developed){
                    undev.push(land);
                }
            }
            return undev;
            
        },


        developedLand(){
            let dev = 0;
            for(let land of this.inc.landOwned){
                if(land.developed == true){
                    dev++;
                }  
            }
            return dev;
        },
        undevelopedLand(){
            let und = 0;
            for(let land of this.inc.landOwned){
                if(land.developed == false){
                    und++;
                }  
            }
            return und;
        }
    },
}
</script>