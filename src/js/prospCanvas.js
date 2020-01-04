export default class ProspCanvas {

    constructor(canvas){
        this.canvas = canvas;
        this.ctx    = canvas.getContext("2d");
        this.island;
        this.scaling = 1;
        this.init();
    }

    setIsland(island){
        this.island = island;
        this.draw();
    }

    init(){
        this.resize();  
        window.addEventListener("resize", function(){
         
            this.resize();
            this.draw();
        }.bind(this));
    }

    resize(){
        console.log("Resizing Canvas");
        this.canvas.width  = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }


    draw(){
        if(this.island){
            let idEdges = this.island.idEdges;
            this.scale();
            this.drawIsland(idEdges);

        }
    }

    drawIsland(edges){
        console.log("Edges: ", edges);

        for(let i = 0; i < edges.length; i++){
            let site = edges[i];
            console.log("SITE: ", site);
            let corners   = site.edges;

            let type      = site.ref.type;
           
            this.drawPolygon(corners, type);

        }
    }

    drawPolygon(corners, type){
        // Given edges (verticies), draw a polygon.L0
        this.ctx.beginPath();
        this.ctx.moveTo((corners[0].x * this.scaling), (corners[0].y * this.scaling));
        for(let i = 1; i < corners.length; i++){
            let point = corners[i];
            this.ctx.lineTo((point.x * this.scaling), (point.y * this.scaling));
        }
        this.ctx.lineTo((corners[0].x * this.scaling), (corners[0].y * this.scaling));
        this.ctx.closePath();
        if(type == "water"){
            this.ctx.fillStyle = "blue";
            this.ctx.strokeStyle = "blue";
        } else {
            this.ctx.fillStyle = "orange";
            this.ctx.strokeStyle = "black";
        }
        this.ctx.stroke();
        this.ctx.fill();
    }


    handleUpdate(){
        this.resize();
        this.drawIsland();
    }

    scale(){
        let bbox = this.island.boundingBox;
        let mx = bbox.xr;
        if(mx <= this.canvas.width){
            this.scaling = this.canvas.width / mx;
        }
    }

}   
