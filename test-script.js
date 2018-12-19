window.addEventListener("load", function () {
	let cm = new CanvasManager();

});

class CanvasManager {

	constructor() {
		this.canvas = document.getElementById('testcanvas');
		this.ctx = this.canvas.getContext('2d');
		this.board = new Board(this.canvas, this.ctx);
		this.start();
	}
	start() {
		console.log("Start called");
		this.board.makePoints();
		this.board.loop();
	}

}

class Board {
	constructor(canvas, ctx) {
		this.canvas = canvas;
		this.ctx = ctx;
		this.width = canvas.width;
		this.height = canvas.height;
		this.points = [];
		this.balls = [];
		this.radius = 10;
		this.xs = [];
		this.ys = [];
	}
	makePoints() {	
		let y = 50; 
		let ymax = this.canvas.height - 10;
		let x = this.radius;
		let width = this.radius + 6;
		let height = 38;
		let numwidth = Math.floor(  (this.canvas.width - this.radius * 2) / width);
		let widthleft = this.canvas.width - numwidth;
		let padding = widthleft / numwidth;
		let numheight = Math.floor( (ymax - y) / height );
		console.log("NW: ", numwidth);
		console.log("NH: ", numheight);
		for(let i = 1; i < numheight; i++){
			for(let j = 1; j < numwidth; j++){
				let point = new Point(x, y, 'black', this.ctx, this.radius);
				this.points.push(point);
				console.log("Col: ", x);
				x += width + padding; 
			}
			y += height;
			x = this.radius + (this.radius * (1 * (i % 2)));
			console.log("Row Done: ", y);
		}
	}
	loop(){
		//Board loop.
		let now = performance.now();
		let time = 1;
		if(this.lastTime){
			time = now - this.lastTime;	
		}
		this.lastTime = now;
		
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.drawPoints();
		for(let i in this.balls){
			let ball = this.balls[i];
			ball.accel(0.1);
			ball.update(this.points);
			ball.draw(this.ctx);
		}
		if(this.balls.length == 0){
			this.balls.push(new Ball(10, 5, 'red', 5));
		}
		window.requestAnimationFrame(this.loop.bind(this));
	}

	drawPoints() {
		for (let i = 0; i < this.points.length; i++) {
			let point = this.points[i];
			point.draw(this.ctx);
		}
	}
}

class Ball {
	constructor(x, y, color, radius){
		this.x = x;
		this.y = y;
		this.color = color;
		this.radius = radius;
		this.dx = 1.6;
		this.dy = 0;
		this.acc = 0.6;
	}
	
	checkCollis(points, nx, ny){
		//If nx,ny is in range of a circle, do a collision.
			let col = null;
		for(let i in points){
			let point = points[i];
			let px = point.x;
			let py = point.y;
			let xmin = px - point.radius;
			let xmax = px + point.radius;
			let ymin = py - point.radius;
			let ymax = py + point.radius;
			let ymidmin = py - point.radius / 2 ;
			let ymidmax = py + point.radius / 2;
			let xmidmin = px - point.radius / 2;
			let xmidmax = px + point.radius / 2;
			
		
			if(this.dy > 0){
			if(this.x >= xmin && this.x <= xmax && this.y >= ymin && this.y <= ymidmin){
				//Hit top
				col = 't';
			}
			}
			
			if(this.dy < 0){
				//Going up
				if(this.x >= xmin && this.x <= xmax && this.y >= ymidmax && this.y <= ymax){
					col = 'b';
				}
			}
			
			if(this.dx > 0){
				//Going right 
				
				if(this.x >= xmin && this.x <= xmidmin && this.y >= ymin && this.y <= ymax){
					col = 'l';
				}
				
			}
			
			if(this.dx < 0){
				//Going left
				
				if(this.x >= xmidmax && this.x <= xmax && this.y >= ymin && this.y <= ymax){
					col = 'r';
				}
			}
			
		}
		return col;
		
	}
	update(points){
		let collision = this.checkCollis(points, this.x + this.x, this.y + this.dy);
		if(collision == 't' || collision == 'b'){
			this.dy = -this.dy / 2;
		} else if(collision == 'l' || collision == 'r'){
			this.dx = -this.dx / 2;
		}

		
		if(collision != null){
			console.log(collision);
		}
		this.x += this.dx; 
		this.y += this.dy;
	}
	accel(time){
		this.dy += this.acc * time;
	}
	draw(ctx){
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath();
	}
	
	
	
}

class Point {

	constructor(x, y, color, ctx, radius) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.closePath();

	}

}
