<template>
<div class="economyWrapper">
    <metal-prices></metal-prices>


    <div class="graphWrapper">
        <div class="graphSection">
            <div class="graphTitle">
                Land Index
            </div>
            <div class="graph">
                <div id="landIndex"></div>
            </div>
        </div>

        <div class="priceGraphWrapper">

            <div class="graphSection">
                <div class="graphTitle">
                    Iron Price
                </div>
                <div class="graph">
                    <div id="ironGraph"></div>
                </div>
            </div>

            <div class="graphSection">
                <div class="graphTitle">
                    Copper Price
                </div>
                <div class="graph">
                    <div id="copperGraph"></div>
                </div>
            </div>

            <div class="graphSection">
                <div class="graphTitle">
                    Silver Price
                </div>
                <div class="graph">
                    <div id="silverGraph"></div>
                </div>
            </div>


            <div class="graphSection">
                <div class="graphTitle">
                    Gold Price
                </div>
                <div class="graph">
                    <div id="goldGraph"></div>
                </div>
            </div>
        
        
        </div>


    </div>
</div>
</template>
<script>
import metalPrice from "../vue/metalPrice.vue";
import Graph from "../js/graph.js";
// Think we can only make / display the chart if we are here, as canvas not in DOM.
export default{
    data () {
        return {
            inc: this.$parent.inc,
            economy: this.$parent.inc.economy,
        }
    },
    components: {
        'metal-prices': metalPrice
    },

    mounted: function(){
        // We have to initalise the graphs here so that relevant elements are in DOM.Equipmentmod
        let landIndex = this.economy.landIndGraph;
        let landIn = document.getElementById("landIndex");
        landIndex.init(landIn);
        landIn.addEventListener("scroll", function(event){
            event.preventDefault();
        });

        let ironPriceGraph = this.inc.economy.ironPriceGraph;
        let ironElement    = document.getElementById("ironGraph");
        ironPriceGraph.init(ironElement);

        let copperPriceGraph = this.inc.economy.copperPriceGraph;
        let copperElement    = document.getElementById("copperGraph");
        copperPriceGraph.init(copperElement);

        let silverPriceGraph = this.inc.economy.silverPriceGraph;
        let silverElement    = document.getElementById("silverGraph");
        silverPriceGraph.init(silverElement);

        let goldPriceGraph = this.inc.economy.goldPriceGraph;
        let goldElement    = document.getElementById("goldGraph");
        goldPriceGraph.init(goldElement);                        







    },
    destroyed: function(){
        let landIndex = this.economy.landIndGraph;
        landIndex.stop();
    }
}





</script>