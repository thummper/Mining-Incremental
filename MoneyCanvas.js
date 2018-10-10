class MoneyCanvas extends Canvas {

	constructor() {
		super();
		this.canvas = document.getElementById('money-canvas');
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.mctx = this.canvas.getContext('2d');
		this.points = [];
		this.moneyGen = 0;
		this.makeCanvas();
		this.addListeners();
		this.checkPoints;
	}

	makeCanvas() {
		//Set canvas width and height.
		this.resizeCanvas();
		this.checkPoints = window.setInterval(this.updatePoints.bind(this), 1000);
		requestAnimationFrame(this.drawPoints.bind(this));
	}

	updatePoints() {
		let newPoints = [];
		for (let i = 0, j = this.points.length; i < j; i++) {
			let point = this.points[i];
			if (point.life > 0) {
				point.life -= 1;
				if (point.size > 1) {
					point.size -= 1;
				}
				newPoints.push(point);
			} else {
				//Points should die. 
				this.moneyGen += point.reward;
			}
		}
		this.points = newPoints;
		
	}

	drawPoints() {
		this.mctx.clearRect(0, 0, this.width, this.height);
		//Loops and draws all points.
		for (let i = 0, j = this.points.length; i < j; i++) {
			let point = this.points[i];
			if (point.life != 0) {
				point.draw(this.mctx);
			}
		}
		requestAnimationFrame(this.drawPoints.bind(this));
	}



	addListeners() {
		this.canvas.addEventListener('mousemove', function (e) {
			let rect = this.canvas.getBoundingClientRect();
			let x = e.clientX - rect.left;
			let y = e.clientY - rect.top;
			this.makePoint(x, y);
		}.bind(this));

		window.addEventListener('resize', function (e) {
			this.resizeCanvas();
		}.bind(this));
	}

	makePoint(x, y) {
		//Make a point on the canvas..
		let size = Math.floor(Math.random() * 20);
		let color = this.randomHex();
		let life = Math.floor(Math.random() * 12);
		let point = new Point(x, y, size, life);
		this.points.push(point);
	}

	randomHex() {
		var randomColor = "#000000".replace(/0/g, function () {
			return (~~(Math.random() * 16)).toString(16);
		});
		return randomColor;
	}
}