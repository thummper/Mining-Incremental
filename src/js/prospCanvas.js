

export default class ProspCanvas {

    constructor(canvas){
        this.canvas = canvas;
        this.ctx    = canvas.getContext("2d");
        trackTransforms(this.ctx);
        this.island;
        this.scaling = 1;

        this.xPadding = 0;
        this.yPadding = 0;
        this.startX = 0;
        this.startY = 0;
        this.mouseDown = false;


        this.zoomIntensity = 0.2;
        this.scale = 1;


        this.scaleFactor = 1.1;
        

        this.mx = 0;
        this.my = 0;
        this.init();

    }





    setIsland(island){
        this.island = island;
        this.draw();
    }

    getMousePoint(){
        let rect = this.canvas.getBoundingClientRect();
        this.mx = (event.clientX - rect.left);
        this.my = (event.clientY - rect.top);

    }

    init(){
        this.resize();  
        window.addEventListener("resize", function(){
         
            this.resize();
            this.draw();
        }.bind(this));

        this.canvas.addEventListener("mousedown", function(event){
            // Get mouse point
            this.getMousePoint();
            this.dragStart = this.ctx.transformedPoint(this.mx, this.my);
            this.dragged   = false;


           
        }.bind(this));
        this.canvas.addEventListener("mouseup", function(event){
            this.dragStart = null;
            if(!this.dragged){
                this.zoom(evt.shiftKey ? -1 : 1 );
            }
           
        }.bind(this));
        this.canvas.addEventListener("mousemove", function(event){
            this.getMousePoint();
            this.dragged = true;
            if(this.dragStart){
                let pt = this.ctx.transformedPoint(this.mx, this.my);
                this.ctx.translate(pt.x - this.dragStart.x, pt.y - this.dragStart.y);
                this.draw();
            }
        }.bind(this));
        this.canvas.addEventListener("wheel", function(event){
            let wheel = event.deltaY < 0 ? 1 : -1;
            let delta = event.wheelDelta ? event.wheelDelta/40 : event.detail ? -event.detail : 0;
            if(delta) this.zoom(wheel);
            return event.preventDefault() && false;
          
        }.bind(this));

        this.startX = this.canvas.width  / 2;
        this.startY = this.canvas.height / 2;
    }

    zoom(clicks){
        let pt = this.ctx.transformedPoint(this.mx, this.my);
        this.ctx.translate(this.mx, this.my);
        let factor = Math.pow(this.scaleFactor, clicks);
        this.ctx.scale(factor, factor);
        this.ctx.translate(-this.mx, -this.my);
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

        let p1 = this.ctx.transformedPoint(0,0);
        let p2 = this.ctx.transformedPoint(this.canvas.width, this.canvas.height);
        this.ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);
    }


    draw(){
        this.clear();
        if(this.island){
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
        let newScale = this.scaling + amount;
        let scaleChange = newScale - this.scaling;

        let offsetX = -((this.canvas.width / 2) * scaleChange);
        let offsetY = -((this.canvas.height / 2) * scaleChange);

        this.scaling = newScale;
        this.xPadding += offsetX;
        this.yPadding += offsetY;

        this.clear();
        this.draw();



        // this.scaling += amount;
        // this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        // this.ctx.scale(this.scaling, this.scaling);
        // this.clear();
        // this.draw();
        // this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
    
    }

}   



	// Adds ctx.getTransform() - returns an SVGMatrix
	// Adds ctx.transformedPoint(x,y) - returns an SVGPoint
	function trackTransforms(ctx){
		var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
		var xform = svg.createSVGMatrix();
		ctx.getTransform = function(){ return xform; };
		
		var savedTransforms = [];
		var save = ctx.save;
		ctx.save = function(){
			savedTransforms.push(xform.translate(0,0));
			return save.call(ctx);
		};
		var restore = ctx.restore;
		ctx.restore = function(){
			xform = savedTransforms.pop();
			return restore.call(ctx);
		};

		var scale = ctx.scale;
		ctx.scale = function(sx,sy){
			xform = xform.scaleNonUniform(sx,sy);
			return scale.call(ctx,sx,sy);
		};
		var rotate = ctx.rotate;
		ctx.rotate = function(radians){
			xform = xform.rotate(radians*180/Math.PI);
			return rotate.call(ctx,radians);
		};
		var translate = ctx.translate;
		ctx.translate = function(dx,dy){
			xform = xform.translate(dx,dy);
			return translate.call(ctx,dx,dy);
		};
		var transform = ctx.transform;
		ctx.transform = function(a,b,c,d,e,f){
			var m2 = svg.createSVGMatrix();
			m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
			xform = xform.multiply(m2);
			return transform.call(ctx,a,b,c,d,e,f);
		};
		var setTransform = ctx.setTransform;
		ctx.setTransform = function(a,b,c,d,e,f){
			xform.a = a;
			xform.b = b;
			xform.c = c;
			xform.d = d;
			xform.e = e;
			xform.f = f;
			return setTransform.call(ctx,a,b,c,d,e,f);
		};
		var pt  = svg.createSVGPoint();
		ctx.transformedPoint = function(x,y){
			pt.x=x; pt.y=y;
			return pt.matrixTransform(xform.inverse());
		}
	}
