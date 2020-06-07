const Matter = require("matter-js");
let Engine = Matter.Engine;
let World  = Matter.World;
let Bodies = Matter.Bodies;
let engine = Engine.create();




class Peg{
    constructor(x, y, r){
        this.r = r;

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
    constructor(x, y, r){
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
        ctx.fillStyle = "orange";
        ctx.fill();
        ctx.closePath();    
    }

}




export default class Plinko{
    constructor(canvas){
        this.wallWidth = 20;
        this.pegD      = 20;
        this.pegPad    = 20;
        this.canvas    = canvas;
        this.ctx   = canvas.getContext('2d');
        this.walls = [];
        this.pegs  = [];
        this.balls = [];
        this.mx = 0;
        this.my = 0;
        this.animFrame = null;
        this.canvasListener();

    }
    canvasListener(){
        console.log("CANVAS LISTENERs");
        window.addEventListener("resize", function(){
            
            this.reset();
        }.bind(this));
        this.canvas.addEventListener("click", function(evt){
            let rect = this.canvas.getBoundingClientRect();
            this.mx = evt.clientX - rect.left;
            this.my = evt.clientY - rect.top;
            console.log("Making ball");
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
    reset(){
        // Should be called when canvas resizes (reset the board)
        this.resizeCanvas();
        this.makeWalls();
        this.makePegs();
        this.drawWalls();
        this.drawPegs();
    }
    makeWalls(){
        // Make world boundaries
        let top    = new Wall(0, -this.wallWidth / 2, this.canvas.width, this.wallWidth);
        let left   = new Wall(-this.wallWidth / 2, 0, this.wallWidth, this.canvas.height);
        let right  = new Wall(this.canvas.width - this.wallWidth / 2, 0, this.wallWidth, this.canvas.height);
        let bottom = new Wall(0, this.canvas.height - this.wallWidth / 2, this.canvas.width, this.wallWidth);
        this.walls = [top, left, right, bottom];
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

    loop(){
     
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawWalls();
        this.drawPegs();
        this.drawBalls();
        Engine.update(engine);
        this.animFrame = window.requestAnimationFrame(this.loop.bind(this));
    }
}