const Matter = require("matter-js");
let Bodies = Matter.Bodies;





class Peg{
    constructor(x, y, r, type = null, quantity = null){
        this.r = r;
        this.type = type;
        this.quantity = quantity;
        this.body = Bodies.circle(x, y, r, {
            frictionAir: 0,
            friction: 0,
            frictionStatic: 0,
            inertia: Infinity,
            restitution: 0.5,
            isStatic: true
        }); 
        World.add(engine.world, this.body); 
    }
    draw(ctx){
        // Given context, draw wall.
        ctx.beginPath();
        ctx.arc(this.body.position.x, this.body.position.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = "#8e3155";
        ctx.fill();
        ctx.closePath();    
    }
}


class Wall {
    constructor(x, y, width, height){
        this.width = width;
        this.height = height;
        this.body = Bodies.rectangle( x + width / 2, y + height / 2, width, height, { isStatic: true, restitution: 1, friction: 0});
        World.add(engine.world, this.body); 
    }
    draw(ctx){
        // Given context, draw wall.
        ctx.beginPath();
        ctx.rect(this.body.position.x - this.width / 2, this.body.position.y - this.height / 2, this.width, this.height);
        ctx.fillStyle = "#f2f2f2";
        ctx.fill();
        ctx.closePath();
    }
}


class Ball {
    constructor(x, y, r, type = null, quantity = null){
        this.cols = ['#4d504b', '#b85233', '#b5b5bd', '#e7bd42'];
        this.type = type;
        this.quantity = quantity;
        this.colour = this.cols[3];
        if(this.type != null){
            this.colour = this.cols[this.type];
        }
        this.r = r;
        this.body = Bodies.circle(x, y, r, {
            frictionAir: 0,
            friction: 0,
            frictionStatic: 0,
            restitution: 0.5
        }); 
        World.add(engine.world, this.body); 
    }
    draw(ctx){
        // Given context, draw wall.
        ctx.beginPath();
        ctx.arc(this.body.position.x, this.body.position.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = this.colour;
        ctx.fill();
        ctx.closePath();    
    }

}



let Engine, World, engine;
export default class Plinko{
    constructor(canvas){
        Engine = Matter.Engine;
        World  = Matter.World;
        engine = Engine.create();

        this.wallWidth = 20;
        this.pegD      = 20;
        this.pegPad    = 20;
        this.canvas    = canvas;
        this.ctx   = canvas.getContext('2d');
        this.walls = [];
        this.pegs  = [];
        this.balls = [];
        this.ballThreshold = 50;
        this.mx = 0;
        this.my = 0;
        this.animFrame = null;
        this.canvasListener();

    }
    canvasListener(){
      
        window.addEventListener("resize", function(){
            this.reset();
        }.bind(this));
        this.canvas.addEventListener("click", function(evt){
            let rect = this.canvas.getBoundingClientRect();
            this.mx = evt.clientX - rect.left;
            this.my = evt.clientY - rect.top;
            this.makeBall(this.mx, this.my);
        }.bind(this));
    }
    resizeCanvas(){
        this.canvas.width  = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }
    setCanvas(canvas){
        this.canvas = canvas;
        this.ctx    = canvas.getContext('2d');
    }
    removeBodies(){
        // Remove all pegs 
        for(let peg of this.pegs){
            Matter.Composite.remove(engine.world, peg.body)
        }

    }
    reset(){
        // Should be called when canvas resizes (reset the board)
        this.resizeCanvas();
        this.removeBodies();

        this.makeWalls();
        this.makePegs();
        this.drawWalls();
        this.drawPegs();
    }
    makeWalls(){
        // Make world boundaries
        this.walls = [];
        //let top    = new Wall(0, -this.wallWidth / 2, this.canvas.width, this.wallWidth);
        let left   = new Wall(-this.wallWidth / 2, 0, this.wallWidth, this.canvas.height);
        let right  = new Wall(this.canvas.width - this.wallWidth / 2, 0, this.wallWidth, this.canvas.height);
        let bottom = new Wall(0, this.canvas.height - this.wallWidth / 2, this.canvas.width, this.wallWidth);
        this.walls = [left, right, bottom];
    }
    drawWalls(){
        for(let wall of this.walls){
            wall.draw(this.ctx);
        }
    }
    drawBalls(){
        for(let ball of this.balls){
            ball.draw(this.ctx);
        }
    }
    drawPegs(){
        for(let peg of this.pegs){
            peg.draw(this.ctx);
        }
    }
    makePegs(){
        this.pegs = [];
        // Make all pegs
        // So lets say like every even row is offset by pegwidth? 
        let sh = this.canvas.height * 0.3;
        

        let totalWidth  = this.canvas.width - this.wallWidth;
        let totalHeight = this.canvas.height - sh;
        let pegDist  = this.pegD + this.pegPad * 2;
        let yPadding = this.pegD * 3; 
 
        let cols = Math.floor(totalWidth  / pegDist);
        let remainingWidth = totalWidth - (cols * pegDist);
        let rows = Math.floor(totalHeight / yPadding);


        let y = sh;
        for(let i = 0; i < rows; i++){
            if((i + 1) % 2 == 0){
               
                let x = (this.wallWidth / 2) + (remainingWidth / 2) + pegDist / 2;
                for(let j = 0; j < cols - 1; j++){
                    let peg = new Peg(x + pegDist / 2, y, this.pegD / 2);
                    this.pegs.push(peg);
                    x += pegDist;
                
                }
            } else {
                let x = this.wallWidth / 2 + remainingWidth / 2;
                for(let j = 0; j < cols; j++){
                    let peg = new Peg(x + pegDist / 2, y, this.pegD / 2);
                    this.pegs.push(peg);
                    x += pegDist;
                    
                }
            }
            y += yPadding;
        }
    }

    makeBall(x, y){
        // Make a ball
        let ball = new Ball(x, y, 15);
        this.balls.push(ball);
    }

    makeOreBall(type, quantity){
        // Pick random x, y in top range.
        let x = Math.random() * this.canvas.width;
        let y = -10;
        let ball = new Ball(x, y, 15, type, quantity);
        this.balls.push(ball);
    }

    checkHarvest(){
        
    }

    checkBalls(){
        // Check if balls in threshold to bottom
        for(let ball of this.balls){
         
            let y = ball.body.position.y;
            let bdist = this.canvas.height - y;
            if(bdist < this.ballThreshold){
                ball.colour = "red";
            }
        }
    }

    loop(){
     
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.checkBalls();
        this.drawWalls();
        this.drawPegs();
        this.drawBalls();
        Engine.update(engine);
        this.animFrame = window.requestAnimationFrame(this.loop.bind(this));
    }
}