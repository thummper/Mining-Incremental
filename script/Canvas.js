class Canvas {
	constructor(){
		this.canvas = null;
		this.width = null;
		this.height = null;
	}
	resizeCanvas() {
		console.log("Resizing Canvas");
		this.canvas.width = this.canvas.offsetWidth;
		this.canvas.height = this.canvas.offsetHeight;
		this.width = this.canvas.width;
		this.height = this.canvas.height;
	}
}