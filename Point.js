class Point {

	constructor(x, y, size, life) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.color = '#e2a000';
		this.life = life;
		this.reward = Math.floor(Math.random() * 50 * this.life);
	}

	draw(mctx) {
		mctx.beginPath();
		mctx.fillStyle = this.color;
		mctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
		mctx.fill();
		mctx.closePath();
	}

}