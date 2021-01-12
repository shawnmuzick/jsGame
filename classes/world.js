export class World {
	constructor(
		img,
		spriteX,
		spriteY,
		spriteWidth,
		spriteHeight,
		cx,
		cy,
		cWidth,
		cHeight,
		context
	) {
		this.img = img;
		this.spriteX = spriteX;
		this.spriteY = spriteY;
		this.width = spriteWidth;
		this.height = spriteHeight;
		this.xPosition = cx;
		this.yPosition = cy;
		this.scaleWidth = cWidth;
		this.scaleHeight = cHeight;
		this.context = context;
		this.grid = [[], [], [], [], [], [], [], [], []];
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				this.grid[i][j] = this.getRandomTile();
			}
		}
	}

	draw() {
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				this.context.drawImage(
					this.img,
					this.grid[i][j].x * this.width,
					this.grid[i][j].y * this.width,
					this.width,
					this.height,
					this.scaleWidth * i,
					this.scaleHeight * j,
					//fixes breaks/seams
					this.scaleWidth + 5,
					this.scaleHeight + 5
				);
			}
		}
	}

	getRandomTile() {
		let maxX = 5;
		let maxY = 3;
		let x = Math.floor(Math.random() * Math.floor(maxX));
		let y = Math.floor(Math.random() * Math.floor(maxY));
		return { x, y };
	}
}
