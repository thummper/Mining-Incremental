class ProspectCanvas extends Canvas {
	constructor() {
		super();
		this.canvas = document.getElementById('prospecting-canvas');
		this.ctx = this.canvas.getContext('2d');
		this.gridSize = 12;
		this.genCoeffs = [4, 3, 1, 0.5];
		this.rows;
		this.cols;
		this.cells = [];
		this.padding;
		this.oreFound = [0, 0, 0, 0];
		this.grid = [];
		this.addListeners();
		this.resizeCanvas();


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
		this.tick = 0;
		this.index = 0;
		this.toDiscover = 0;

		this.makeGrid();
		this.makeCanvas();

	}


	pickType() {
		let random = randomRange(1, 20, 0);
		let type = null;
		if (random < 8) {
			type = 0;
		} else if (random < 15) {
			type = 1;
		} else if (random < 18) {
			type = 2;
		} else {
			type = 3;
		}
		return type;
	}


	makeGrid(){
		this.grid = [];
		for (let i = 0; i < 10; i++) {
			let row = [];
			for (let j = 0; j < 10; j++) {
				let type = this.pickType();
				let cell = new Cell(type, this.genCoeffs);
				row.push(cell);
			}
			this.grid.push(row);
		}

	}

	makeCanvas() {
		//Make an x by x grid. 

		let cellwidth = this.canvas.width / 10;
		let cellheight = this.canvas.height / 10;
		this.cells = [];

		for(let i = 0; i < this.grid.length; i++){

			for(let j = 0; j < this.grid[i].length; j++){

				let cell = this.grid[i][j];
				cell.x = cellwidth * j;
				cell.y = cellheight * i;
				cell.width = cellwidth;
				cell.height = cellheight;
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
		//This needs to work without a display because the canvas doesnt redraw when on different tabs
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
	constructor(type, coeffs) {
		this.x = null;
		this.y = null;
		this.width;
		this.height;
		this.type = type;
		this.color = null;
		this.amount = 0;
		this.genCoeffs = coeffs;
		this.genAmount();
		this.explored = false;


	}
	genAmount() {
		let colours = ['#3a3c40', '#b4745e', '#e7bd42', '#4b4169'];
		this.color = colours[this.type];
		this.amount = randomRange(0.1, this.genCoeffs[this.type], 0);
	}

	draw(ctx) {
		//Need a reference to context
		if (this.x != null && this.y != null) {
			ctx.beginPath();
			if (this.explored) {
				ctx.fillStyle = this.color;
			} else {
				ctx.fillStyle = '#B0DFE5';
			}
			ctx.fillRect(this.x, this.y, this.width, this.height);
			ctx.closePath();
		}
	}
}