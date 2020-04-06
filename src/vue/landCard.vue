<template>

<div class="landItem" :style="{ backgroundImage: 'url(' +  land.imagePath + '.jpg )' }" v-bind:class="{landItemHover: !land.developed && land.owned}" v-on:click="clicked">
  <div class="wrapper">
                  <div class="tooltipWrapper">
                <div class="tooltip">
                    <i class="fas fa-question-circle" style="color: #2980b9"></i>
                </div>
                <div class="tooltipText">
                    <em>Value</em>
                    <br>
                    <div>
                        <span>Base Value: £{{roundedBase}}</span><br>
                        <span>Ore Value:  £{{roundedOre}}</span><br>
                        <span>Developed Modifier: {{devModifier}}</span>
                    </div>
                </div>
            </div>
      
   

    <div class="hover" v-if="land.owned && !land.developed">
            <div class="titleWrapper centerWrapper">
        <div class="landTitle">Development</div>
      </div>
      <div class="contentWrapper centerWrapper">
        <div class="landContent">
            <template v-if="!land.developing">
                This piece of land has not been developed. You cannot mine from this land until appropriate infastructure has been put in place.
                <br><br>
            </template> 
            <template v-if="land.developing">
                Developing this land will take {{land.developTime}} more quarters.   
            </template>
            <template v-if="!land.developing">
                Developing this land will take {{land.developTime}} quarters. 
            </template>
            <div class="landProgress">
                <progress :value="land.timePass" :max="inc.quarterTime"></progress>
            </div>
        </div>
      </div>
      <div class="buttonWrapper centerWrapper">
          <div class="landButton" v-if="!land.developing" v-on:click="developLand"> Develop for: {{developPrice}}</div>
          <div v-if="!land.owned" v-on:click="buyLand" class="landButton">Purchase: {{roundedMoney}}</div>
          <div v-if="land.owned" v-on:click="sellLand" class="landButton">Sell: {{roundedMoney}}</div>
      </div> 
    </div>
    
    <div class="default">
      <div class="titleWrapper centerWrapper">
        <div class="landTitle">{{land.name}}</div>
      </div>
      <div class="contentWrapper centerWrapper">
        <div class="landContent">
                        <table class="landTable" v-bind:class="{ developTable: !land.developed}">
                <tr>
                    <td class="circle iron"></td>
                    <td class="amount">{{roundedIron}}</td>
                </tr>
                <tr>
                    <td class="circle copper"></td>
                    <td class="amount">{{roundedCopper}}</td>
                </tr>
                <tr>
                    <td class="circle silver"></td>
                    <td class="amount">{{roundedSilver}}</td>
                </tr>
                <tr>
                    <td class="circle gold"></td>
                    <td class="amount">{{roundedGold}}</td>
                </tr>
            </table>
        </div>
      </div>
      <div class="buttonWrapper centerWrapper">
          <div v-if="!land.owned" v-on:click="buyLand" class="landButton">Purchase: {{roundedMoney}}</div>
          <div v-if="land.owned" v-on:click="sellLand" class="landButton">Sell: {{roundedMoney}}</div>
      </div>      
    </div>
    
    
  </div>
</div>

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
            console.log("ROUTE: ", this.$route);
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
                console.log("Developing Land");
                this.inc.developLand(this.land);
            },
            clicked: function(event){
                // Should only fire if clicked on the map page. 
                let route = this.$route;
                console.log("Current Route Name: ", route.name);
                if(route.name == "Prospecting" && this.land.developed){
                    // Load this land into map.
                    // When this is clicked, we need to draw this land's island in map.
                    this.$parent.draw(this.land);
                }
            }
        }
    }
</script>