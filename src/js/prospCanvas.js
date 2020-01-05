export default class ProspCanvas {

    constructor(canvas){
        this.canvas = canvas;
        this.ctx    = canvas.getContext("2d");
        this.island;
        this.scaling = 1;

        this.xPadding = 0;
        this.yPadding = 0;
        this.startX = 0;
        this.startY = 0;
        this.mouseDown = false;

        this.mx = 0;
        this.my = 0;


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

        this.canvas.addEventListener("mousedown", function(event){
            this.mD(event);
        }.bind(this));
        this.canvas.addEventListener("mouseup", function(event){
            this.mouseUp(event);
        }.bind(this));
        this.canvas.addEventListener("mousemove", function(event){
            this.mouseMove(event);
        }.bind(this));
        this.canvas.addEventListener("wheel", function(event){
            this.handleScroll(event);
        }.bind(this));

        this.startX = this.canvas.width  / 2;
        this.startY = this.canvas.height / 2;
    }


    mD(event){
        event.preventDefault();
        event.stopPropagation();
        let rect = this.canvas.getBoundingClientRect();
        this.startX = (event.clientX - rect.left);
        this.startY = (event.clientY - rect.top);
        this.mouseDown = true;
    }
    
    mouseUp(event){
        event.preventDefault();
        event.stopPropagation();
        this.mouseDown = false;
       

    }

    handleScroll(event){
        event.preventDefault();
        event.stopPropagation();
        console.log("EVENT: ", event);
        if(event.deltaY < 0){
            //in
            this.changeScale(0.25);
            

        } else {
            //out
            this.changeScale(-0.25);
           

        }
        this.draw();
    }

    mouseMove(event){
        if(!this.mouseDown){
            return;
        }
        let rect = this.canvas.getBoundingClientRect();
        let mouseX = (event.clientX - rect.left);
        let mouseY = (event.clientY - rect.top);

        this.mx = mouseX;
        this.my = mouseY;

        this.xPadding -= (this.startX - mouseX) * 0.03;
        this.yPadding -= (this.startY - mouseY) * 0.03;
        this.draw();
    }

    resize(){
        this.canvas.width  = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        if(this.island){
            this.scale();
        }
      
    }

    clear(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }


    draw(){
        if(this.island){
            this.clear();
            let idEdges = this.island.idEdges;
            this.drawIsland(idEdges);
        }
    }

    drawIsland(edges){
        for(let i = 0; i < edges.length; i++){
            let site = edges[i];
            let corners   = site.edges;
            let type      = site.ref.type;
            this.drawPolygon(corners, type);

        }
    }

    drawPolygon(corners, type){
        // Given edges (verticies), draw a polygon.L0
        this.ctx.beginPath();
        this.ctx.moveTo((corners[0].x + this.xPadding)* this.scaling , (corners[0].y + this.yPadding) * this.scaling );
        for(let i = 1; i < corners.length; i++){
            let point = corners[i];
            this.ctx.lineTo(((point.x + this.xPadding) * this.scaling), ((point.y + this.yPadding) * this.scaling));
        }
        this.ctx.lineTo(((corners[0].x + this.xPadding) * this.scaling), ((corners[0].y + this.yPadding) * this.scaling));
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

    changeScale(amount){
        this.scaling += amount;
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.scale(this.scaling, this.scaling);
        this.clear();
        this.draw();
        this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
    
    }

}   


