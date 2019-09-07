<template>
<div class="land-item">



<div class="top" :style="{ backgroundImage: 'url(' +  land.img + '.jpg )' }" >
        <table class="land-table">
        <tr>
        <td class="circle iron"></td>
        <td>{{roundedIron}}</td>
        </tr>
                <tr>
        <td class="circle copper"></td>
        <td>{{roundedCopper}}</td>
        </tr>
                <tr>
        <td class="circle silver"></td>
        <td>{{roundedSilver}}</td>
        </tr>
                <tr>
        <td class="circle gold"></td>
        <td>{{roundedGold}}</td>
        </tr>
        </table> 
      <div class="land-title">{{land.name}}</div>
</div>


  

<div class="bottom">
    <div class="land-stats">

    </div>
    <div v-if="! land.owned" v-on:click="buyLand" class="land-button">Purchase: {{roundedMoney}}</div>
    <div v-if="land.owned" v-on:click="sellLand" class="land-button">Sell: {{roundedMoney}}</div>
</div>
</div>

</template>

<script>
import * as helper from "../js/helper.js";


export default {

    data () {
        return {
            inc: this.$parent.inc,
        }
    },
    props: {
        land: Object
    },

    computed: {
        roundedMoney: function(){
            return "£" + helper.roundSuffix(this.land.basePrice + this.land.oreWorth);
        },
        roundedIron: function(){
            return helper.roundSuffix(this.land.ores[0] * this.land.estimate);
        },
        roundedCopper: function(){
            return helper.roundSuffix(this.land.ores[1] * this.land.estimate);
        },
        roundedSilver: function(){
            return helper.roundSuffix(this.land.ores[2] * this.land.estimate);
        },
        roundedGold: function(){
            return helper.roundSuffix(this.land.ores[3] * this.land.estimate);
        },
    },

    methods: {
        buyLand: function(event){
            let message = this.inc.purchase(this.land, 1);
            this.inc.updateAvailiableProspecting();
            if(message !== null){
               this.$toasted.show(message);
            } 
        },
        sellLand: function(event){
            let message = this.inc.sell(this.land, 1);
            this.inc.updateAvailiableProspecting();
            if(message !== null){
               this.$toasted.show(message);
            }   
        }
    }

}
</script>


