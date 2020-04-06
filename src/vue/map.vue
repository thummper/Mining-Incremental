<template>
<div class="sectionWrapper mapWrapper">
    <div class="mapLocations shadow flex-col">
        <div class="shadow-title map-title">Active Land</div>
                <div class="flex-row wrap">
            <landSale v-for="land in inc.landOwned" :land="land" />
        </div>
    </div>

    <div class="locationWrapper shadow flex-col">
        <div class="shadow-title map-title"> Land For Sale </div>
            <div class="flex-row wrap">
            <landSale v-for="land in inc.landSale" :land="land" />
        </div>
    </div>


</div>
</template>
<script>
import landSale from '../vue/landSale.vue';

export default{
    data () {
        return {
            inc: this.$parent.inc,
        }
    },
    components: {
        'landSale': landSale
    }
}
</script>