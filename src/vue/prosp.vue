<template>
<div class="mapWrapper">
    <div class="map">
        <canvas class="mapTop" id="mapDisplay"></canvas>
        <div class="split"></div>
        <div class="mapBottom">
            <landSale v-for="land in inc.landOwned" :land="land" />
        </div>
    </div>

</div>
</template>
<script>
import landSale from '../vue/landSale.vue';
import * as helper from "../js/helper.js";
export default{
    data () {
        return {
            inc: this.$parent.inc,
        }
    },
    components: {
        'landSale': landSale
    },
    methods: {
        draw: function(land){
            console.log("Shoud draw: ", land);
            let idEdges = land.island.idEdges;
            let canvas = document.getElementById("mapDisplay");
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            let ctx = canvas.getContext("2d");
            this.drawIsland(idEdges, ctx);

        },
        drawIsland: function(idEdges, ctx){
            for(let site of idEdges){
                let edges = site.edges;
                let reference = site.ref;
                let type = reference.type;
                this.drawPolygon(edges , ctx, type);
                }
                ctx.beginPath();
               
        },
        drawPolygon: function(edges, ctx, type){
    // Given edges (verticies), draw a polygon.L0
    ctx.beginPath();
    ctx.moveTo(edges[0].x, edges[0].y);
    for(let i = 1; i < edges.length; i++){
        let point = edges[i];
        ctx.lineTo(point.x, point.y);
    }
    ctx.lineTo(edges[0].x, edges[0].y);
    ctx.closePath();
    if(type == "water"){
        ctx.fillStyle = "blue";
        ctx.strokeStyle = "blue";
    } else {
        ctx.fillStyle = "orange";
        ctx.strokeStyle = "black";
    }
    ctx.stroke();
    ctx.fill();
        }
    }
}
</script>
