<template>
<div class="locationWrapper">

    <div class="mapLocations shadow flex-col">
        <div class="shadow-title map-title">Active Land</div>
                <div class="flex-row wrap">
            <land-card v-for="land in inc.landOwned" :land="land" />
        </div>
    </div>

    <div class="locationWrapper shadow flex-col">
        <div class="shadow-title map-title"> Land For Sale </div>
            <div class="flex-row wrap">
            <land-card v-for="land in inc.landSale" :land="land" />
        </div>
    </div>


</div>
</template>
<script>
import landCard from '../vue/landCard.vue';
import * as helper from "../js/helper.js";
export default{
    data () {
        return {
            inc: this.$parent.inc,
        }
    },
    components: {
        'land-card': landCard
    }
}
</script>