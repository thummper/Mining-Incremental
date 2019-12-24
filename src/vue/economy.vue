<template>
<div class="economyWrapper">
    <div class="graphWrapper">
        <div class="graphSection">
            <div class="graphTitle">
                Land Index
            </div>
            <div class="graph">
                <div id="landIndex"></div>
            </div>
        </div>



    </div>
</div>

</template>
<script>
import Graph from "../js/graph.js";
// Think we can only make / display the chart if we are here, as canvas not in DOM.
export default{
    data () {
        return {
            inc: this.$parent.inc,
            economy: this.$parent.inc.economy,
        }
    },
    mounted: function(){
        // We have to initalise the graphs here so that relevant elements are in DOM.Equipmentmod
        let landIndex = this.economy.landIndGraph;
        let landIn = document.getElementById("landIndex");
        landIndex.init(landIn);
        landIn.addEventListener("scroll", function(event){
    event.preventDefault();
});
    },
    destroyed: function(){
        let landIndex = this.economy.landIndGraph;
        landIndex.stop();
    }

}





</script>