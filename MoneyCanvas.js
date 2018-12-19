class MoneyCanvas extends Canvas {

	constructor(ts) {
		super();
		this.colours = ['50,60,64', '180,116,94', '231,189,66', '75,65,105'];
		this.canvas = document.getElementById('money-canvas');
		this.resizeCanvas();
		this.ctx    = this.canvas.getContext('2d');
		this.width  =  this.canvas.width;
		this.height = this.canvas.height;
		this.cellSize = ts;
		this.nRow;
		this.nCol;
		this.colPad;
		this.rowPad;
		this.revealed = [];
		this.oresProspected = [0, 0, 0, 0];
		this.grid = [];
		this.mx = 0;
		this.my = 0;
		this.looper = null;
		this.init();	
	}

	getMouse(evt){
		let rect = this.canvas.getBoundingClientRect();
		this.mx = evt.clientX - rect.left;
		this.my = evt.clientY - rect.top;
	}

	init() {
		this.canvas.addEventListener('click', function (e) {
			this.getMouse(e);
		}.bind(this));
		this.canvas.addEventListener('mousemove', function (e) {
			this.getMouse(e);
		}.bind(this));

		this.makeGrid();
		this.drawGrid();
		this.addListeners();
		this.loop();
	}

	addListeners() {
		window.addEventListener('resize', function (e) {
			this.resizeCanvas();
			this.makeGrid();
		}.bind(this));
	}

	makeGrid() {
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.numR = Math.floor(this.height / this.cellSize);
		this.numC = Math.floor(this.width / this.cellSize);
		this.rowPad = (this.height % this.cellSize) / 2;
		this.colPad = (this.width % this.cellSize) / 2;
		this.grid = [];
	
		let x = 0;
		let y = this.rowPad;
		let cs = this.cellSize;
		let cp = this.colPad;
		let r = this.numR;
		let c = this.numC;
		
		for (let i = 0; i < r; i++) {
			let row = [];
			for (let j = 0; j < c; j++) {
				x = (j * cs) + cp;

				let material = this.pickMaterial();
				let col = this.colours[material];
				row.push({
					x: x,
					y: y,
					opacity: 1,
					color: col,
					revealed: false,
					material: material,
					pushed: false
				});
			}
			x = 0;
			y += cs;
			this.grid.push(row);
		}
	
	}

	pickMaterial() {
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
		return type;
	}

	drawGrid() {
		let ctx = this.ctx;
		let grid = this.grid;
		let length = grid.length;
		for (let i = 0; i < length; i++) {
			for (let j = 0, m = grid[i].length; j < m; j++) {
				let cell = grid[i][j];
				ctx.beginPath();
				ctx.strokeStyle = "rgba(0,0,0,0.3)";
				ctx.strokeRect(cell.x, cell.y, this.cellSize, this.cellSize);
				if (cell.revealed) {
					ctx.fillStyle = "rgba(" + cell.color + "," + cell.opacity + ")";
					ctx.fillRect(cell.x, cell.y, this.cellSize, this.cellSize);	
				}
			}
		}
	}

	regenCell(cell){
		let material = this.pickMaterial();
		cell.opacity = 1;
		cell.material = material;
		cell.color = this.colours[material];
		cell.revealed = false;
		cell.pushed = false;

	}

	updateCells(){
		for(let i = this.revealed.length - 1; i >=0 ; i--){

			if(!this.revealed[i].revealed){
				this.revealed.splice(i, 1);
				continue;
			}
			if(this.revealed[i].opacity <= 0){
				//Remake the cell
				this.revealed[i] = this.regenCell(this.revealed[i]);
				this.revealed.splice(i, 1);
				continue;
			} else {
				this.revealed[i].opacity -= 0.01;
			}
		}
	}

	loop() {
		
		let ctx = this.ctx;
		ctx.clearRect(0, 0, this.width, this.height);
		this.checkMouse();
		this.drawGrid();
		this.updateCells();
		window.requestAnimationFrame(this.loop.bind(this));
	}

	checkMouse() {
		for (let i = 0, m = this.grid.length; i < m; i++) {
			for (let j = 0, n = this.grid[i].length; j < n; j++) {
				let cell = this.grid[i][j];
				if (this.inBounds(cell)) {
					cell.revealed = true;

					//we're pushing this cell many times
					if(!cell.pushed){
						this.revealed.push(cell);
						cell.pushed = true;
					}
					this.oresProspected[cell.material] += 0.01;
				}
			}
		}
	}

	inBounds(cell) {
		let minx = cell.x;
		let miny = cell.y;
		let maxx = cell.x + this.cellSize;
		let maxy = cell.y + this.cellSize;
		let mx = this.mx;
		let my = this.my;
		if ((mx >= minx && mx <= maxx) && (my >= miny && my <= maxy)) {
			return true;
		}
		return false;

	}
}





