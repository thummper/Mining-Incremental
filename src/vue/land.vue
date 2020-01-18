<template>
<div class="locationWrapper">
    <div class="mapLocations shadow flex-col">
        <div class="shadow-title map-title">
            Active Land
        </div>
        <div class="flex-row wrap">

            <land-card v-for="land in inc.landOwned" v-bind:key="land.name"  :land="land" />
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
        console.log("LAND OWNED: ", this.inc.landOwned);

         
    },
    components: {
        'land-card': landCard
    },
    computed:{
        ownedLand(){
            let ownedLand = [];
            for(let land in this.inc.landOwned){
                ownedLand.push(this.inc.landOwned[land]);
            }
            return ownedLand;
        }
    },
}
</script>