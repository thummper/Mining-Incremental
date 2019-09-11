<template>
    <!-- Split into 2? -->
    <div class="land-item" :style="{ backgroundImage: 'url(' +  land.img + '.jpg )' }">
        <div v-if="land.owned && !land.developed" class="hover">
            <!-- Development stats here -->

            <div v-if="land.developed">
                <!-- Land is developed -->

            </div>
            <div v-if="!land.developed">
                <!-- Need development info -->
                <div class="developmentWrapper">
                    <div class="smallTitle">Development</div>
                    <div class="smallContent">
                    This peice of land has not been developed, it's actual resource content is unknown and you cannot mine from it. 
                    <br>
                    Developing this land will take {{land.developTime}} quarters. 
                    </div>
                    <div class="land-button" v-on:click="developLand"> Develop for: {{developPrice}}</div>
                
                
                </div>

                <div> Land is not developed. </div>

            </div>



        </div>
        <div class="default">
            <div class="tooltipWrapper">
                <div class="tooltip">
                    <i class="fas fa-question-circle" style="color: #2980b9"></i>
                </div>
                <div class="tooltipText">
                    <em>Value</em>
                    <br>
                    <div>
                        <span>Base Value: £{{roundedBase}}</span>
                        <span>Ore Value: £{{roundedOre}}</span>
                        <span>Developed Modifier: {{devModifier}}</span>
                    </div>
                </div>
            </div>
            <div class="land-title">{{land.name}}</div>
            <table class="land-table">
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
            <div v-if="! land.owned" v-on:click="buyLand" class="land-button">Purchase: {{roundedMoney}}</div>
            <div v-if="land.owned" v-on:click="sellLand" class="land-button">Sell: {{roundedMoney}}</div>
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
                this.inc.updateAvailiableProspecting();
                if (message !== null) {
                    this.$toasted.show(message);
                }
            },
            sellLand: function (event) {
                let message = this.inc.sell(this.land, 1);
                this.inc.updateAvailiableProspecting();
                if (message !== null) {
                    this.$toasted.show(message);
                }
            },
            developLand: function (event) {
                // Start development of land

            },
        }

    }
</script>