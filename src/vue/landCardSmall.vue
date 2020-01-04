<template>

<div class="landItem" :style="{ backgroundImage: 'url(' +  land.img + '.jpg )' }" v-bind:class="{landItemHover: !land.developed && land.owned}" v-on:click="clicked">
  <div class="wrapper">
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
    </div>
  </div>
</div>
</template>
<script>
    import * as helper from "../js/helper.js";
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
                return "£" + helper.roundSuffix(this.land.value);
            },
            roundedIron: function () {
                return helper.roundSuffix(this.land.ores[0] * this.land.estimate);
            },
            roundedCopper: function () {
                return helper.roundSuffix(this.land.ores[1] * this.land.estimate);
            },
            roundedSilver: function () {
                return helper.roundSuffix(this.land.ores[2] * this.land.estimate);
            },
            roundedGold: function () {
                return helper.roundSuffix(this.land.ores[3] * this.land.estimate);
            },
            roundedBase: function () {
                return helper.roundSuffix(this.land.basePrice);
            },
            roundedOre: function () {
                return helper.roundSuffix(this.land.oreWorth);
            },
            devModifier: function () {
                if (this.land.developed) {
                    return "x" + this.land.developedModifier;
                }
                return "None";
            },
            developPrice: function(){
                return helper.roundSuffix(this.land.developPrice);
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