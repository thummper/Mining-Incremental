<template src="./html/small-land-card.html">
</template>
<script>
    import * as Helper from "../js/Helper.js";
    export default {
        data() {
            return {
                inc: this.$parent.inc,
            }
        },
        mounted: function(){
          
        },
        props: {
            land: Object
        },
        computed: {
            roundedMoney: function () {
                return "£" + Helper.roundSuffix(this.land.value);
            },
            roundedIron: function () {
                return Helper.roundSuffix(this.land.ore[0]);
            },
            roundedCopper: function () {
                return Helper.roundSuffix(this.land.ore[1]);
            },
            roundedSilver: function () {
                return Helper.roundSuffix(this.land.ore[2]);
            },
            roundedGold: function () {
                return Helper.roundSuffix(this.land.ore[3]);
            },
            roundedBase: function () {
                return Helper.roundSuffix(this.land.basePrice);
            },
            roundedOre: function () {
                return Helper.roundSuffix(this.land.oreWorth);
            },
            devModifier: function () {
                if (this.land.developed) {
                    return "x" + this.land.developedModifier;
                }
                return "None";
            },
            developPrice: function(){
                return Helper.roundSuffix(this.land.developPrice);
            }
        },
        methods: {
            buyLand: function (event) {
                let message = this.inc.purchase(this.land, 1);
                this.inc.updateProspecting();
                if (message !== null) {
                    this.$toasted.show(message);
                }
            },
            sellLand: function (event) {
                let message = this.inc.sell(this.land, 1);
                this.inc.updateProspecting();
                if (message !== null) {
                    this.$toasted.show(message);
                }
            },
            developLand: function (event) {
                // Start development of land
           
                this.inc.developLand(this.land);
            },
            clicked: function(event){
                // Should only fire if clicked on the map page. 
                let route = this.$route;
              
                if(route.name == "Prospecting" && this.land.developed){
                    // Load this land into map.
                    // When this is clicked, we need to draw this land's island in map.

                    // Really dont like this. 
                    this.$parent.$parent.draw(this.land);
                }
            }
        }
    }
</script>