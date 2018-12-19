class ProspectCanvas extends Canvas {
	constructor() {
		super();
		this.canvas = document.getElementById('prospecting_canvas');
		this.ctx = this.canvas.getContext('2d');
		this.gridSize = 12;
		this.genCoeffs = [4, 3, 1, 0.5];
		this.rows;
		this.cols;
		this.cells = [];
		this.padding;
		this.addListeners();
		this.resizeCanvas();
		this.oreFound = [0, 0, 0, 0];
		

	}
	addListeners() {
		window.addEventListener('resize', function (e) {
			this.resizeCanvas();
		}.bind(this));
	}

	resizeCanvas() {
		this.canvas.width = this.canvas.offsetWidth;
		this.canvas.height = this.canvas.offsetHeight;
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.rows = Math.floor(this.height / this.gridSize);
		this.cols = Math.floor(this.width / this.gridSize);
		this.paddingx = (this.width % this.gridSize) / 2;
		this.paddingy = (this.height % this.gridSize) / 2;
		this.makeCanvas();


		this.tick = 0;
		this.index = 0;
		this.toDiscover = 0;

	}
	makeCanvas() {
		this.cells = [];
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				//Make cell
				let x = j * this.gridSize + this.paddingx;
				let y = i * this.gridSize + this.paddingy;
				let type;
				let randType = Math.round(Math.random() * 20);
				if (randType < 8) {
					type = 0;
				} else if (randType < 15) {
					type = 1;
				} else if (randType < 18) {
					type = 2;
				} else {
					type = 3;
				}
				let cell = new Cell(x, y, type, this.gridSize, this.genCoeffs);
				this.cells.push(cell);
			}
		}
		this.drawCells();
	}
	prospect(amount) {
		this.tick += amount;
		if (this.tick >= 1) {
			this.toDiscover = Math.round(this.tick);
			this.tick = 0;
			this.discoverSpaces();
		}
		return this.oreFound;
	}
	
	discoverSpaces() {
		//Loop through cells index
		if (this.index + this.toDiscover < this.cells.length) {
			for (let i = this.index; i < this.index + this.toDiscover; i++) {
				let cell = this.cells[i];
				cell.explored = true;
				this.oreFound[cell.type] += cell.amount;
			}
			this.clearCells();
			this.index = this.index + this.toDiscover;
		} else {
			//Discovering all cells will leave array
			for (let i = this.index; i < this.cells.length; i++) {
				let cell = this.cells[i];
				cell.explored = true;
				this.oreFound[cell.type] += cell.amount;
			}
			this.resizeCanvas();
		}
	}

	drawCells() {
		for (let i in this.cells) {
			let cell = this.cells[i];
			cell.draw(this.ctx);
		}
	}
	clearCells() {
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.drawCells();
	}

}
class Cell {
	constructor(x, y, type, size, coeffs) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.type = type;
		this.color = null;
		this.amount = 0;
		this.genCoeffs = coeffs;
		this.genAmount();
		this.explored = false;
		

	}
	genAmount() {
		//I can smell a refactor 
		let colours = ['#3a3c40', '#b4745e', '#e7bd42', '#4b4169'];

		this.color = colours[this.type];
		if (this.type == 0) {
			
			this.amount = getRandomInc(0.1, this.genCoeffs[this.type]);
		} else if (this.type == 1) {
			
			this.amount = getRandomInc(0.1, this.genCoeffs[this.type]);
		} else if (this.type == 2) {
			
			this.amount = getRandomInc(0.1, this.genCoeffs[this.type]);
		} else if (this.type == 3) {
			
			this.amount = getRandomInc(0.1, this.genCoeffs[this.type]);
		}

	}
	draw(ctx) {
		//Need a reference to context
		ctx.beginPath();
		if (this.explored) {
			ctx.fillStyle = this.color;
		} else {
			ctx.fillStyle = '#B0DFE5';
		}
		ctx.fillRect(this.x, this.y, this.size, this.size);
		ctx.closePath();
	}
}
