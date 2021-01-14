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
		//fill the visible world with random grass tiles
		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 9; j++) {
				this.grid[i][j] = this.getRandomTile(5, 3);
			}
		}
	}

	draw() {
		//render out the world tiles
		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 9; j++) {
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
				//if drew plain grass in the step above
				if (this.grid[i][j].geofeat !== false) {
					//add geographic feature on top of it
					this.context.drawImage(
						this.img,
						this.grid[i][j].geoFeat.x * this.width,
						this.grid[i][j].geoFeat.y * this.width,
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
	}

	getRandomTile(maxX, maxY, minX = 0, minY = 0) {
		let x = Math.floor(Math.random() * (maxX - minX) + minX);
		let y = Math.floor(Math.random() * (maxY - minY) + minY);
		let geoFeat = false;
		//if we got the empty grass tile, mark for a geographic feature
		if (!x && !y) geoFeat = true;
		if (geoFeat) {
			//it can never return true in the 3rd parameter
			let obj = this.getRandomTile(6, 3, 0, 3);
			geoFeat = {
				x: obj.x,
				y: obj.y,
			};
		}
		return { x, y, geoFeat };
	}
}
