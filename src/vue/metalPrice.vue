<template>
<div class="metalWrapper">
        <table class="oreDisplay">
            <tr>
                <th></th>
                <th> Iron </th>
                <th> Copper </th>
                <th> Silver </th>
                <th> Gold </th>
            </tr>
            <tr id="estimatedOre">
                <td class="tableTitle"> Ore Price </td>

                <transition v-on:enter="ironPriceEnter">
                    <td :key="getIronPrice">
                      {{getIronPrice}}  
                    </td>
                </transition>

                <transition v-on:enter="copperPriceEnter">
                    <td :key="getCopperPrice">
                        {{getCopperPrice}}
                    </td>
                </transition>

                <transition v-on:enter="silverPriceEnter">
                    <td :key="getSilverPrice">
                        {{getSilverPrice}}
                    </td>
                </transition>

                <transition v-on:enter="goldPriceEnter">
                    <td :key="getGoldPrice">
                        {{getGoldPrice}}
                    </td>
                </transition>
     

            </tr>
        </table>
</div>
</template>
<script>

import * as Helper from "../js/Helper.js";
// Think we can only make / display the chart if we are here, as canvas not in DOM.
export default{
    data () {
        return {
            inc: this.$parent.inc,
            green: "posFlash",
            red: "negFlash"
        }
    },
    methods:{
        clearElement: function(elm){
            if(elm.classList.contains(this.green)){
                elm.classList.remove(this.green);
            }
            if(elm.classList.contains(this.red)){
                elm.classList.remove(this.red);
            }
        },

        ironPriceEnter: function(el){
            this.clearElement(el);

            let ironPrice = this.inc.economy.orePrices[0];
            let lastIron  = this.inc.economy.lastOrePrices[0];

            if(ironPrice > lastIron){
                el.classList.add(this.green);
            } else {
                el.classList.add(this.red);
            }
        },

        copperPriceEnter: function(el){

            this.clearElement(el);

            let currentPrice = this.inc.economy.orePrices[1];
            let lastPrice    = this.inc.economy.lastOrePrices[1];

            if(currentPrice > lastPrice){
                el.classList.add(this.green);
            } else {
                el.classList.add(this.red);
            }
        },
        silverPriceEnter: function(el){
            this.clearElement(el);

            let currentPrice = this.inc.economy.orePrices[2];
            let lastPrice    = this.inc.economy.lastOrePrices[2];

            if(currentPrice > lastPrice){
                el.classList.add(this.green);
            } else {
                el.classList.add(this.red);
            }
        },
        goldPriceEnter: function(el){
            this.clearElement(el);

            let currentPrice = this.inc.economy.orePrices[3];
            let lastPrice    = this.inc.economy.lastOrePrices[3];

            if(currentPrice > lastPrice){
                el.classList.add(this.green);
            } else {
                el.classList.add(this.red);
            }
        },
    },
    computed:{
        getIronPrice: function(){

            return Helper.roundSuffix(this.inc.economy.orePrices[0], 0);
        },
        getCopperPrice: function(){
            return Helper.roundSuffix(this.inc.economy.orePrices[1], 0);
        },
        getSilverPrice: function(){
            return Helper.roundSuffix(this.inc.economy.orePrices[2], 0);
        },
        getGoldPrice: function(){
            return Helper.roundSuffix(this.inc.economy.orePrices[3], 0);
        },
    }
}
</script>