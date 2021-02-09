let img = new Image();
img.src = './LPC_forest/forest_tiles.png';
export class World {
	constructor({
		spriteX = 0,
		spriteY = 0,
		spriteWidth = 32,
		spriteHeight = 32,
		cx = 0,
		cy = 0,
		cWidth,
		cHeight,
	}) {
		this.img = img;
		this.spriteX = spriteX;
		this.spriteY = spriteY;
		this.width = spriteWidth;
		this.height = spriteHeight;
		this.xPosition = cx;
		this.yPosition = cy;
		this.scaleWidth = cWidth;
		this.scaleHeight = cHeight;
		this.grid = [[], [], [], [], [], [], [], [], []];
		//fill the visible world with random grass tiles
		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 9; j++) {
				this.grid[i][j] = this.getRandomTile(5, 3);
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
			let obj = this.getRandomTile(7, 3, 0, 3);
			//this particular source tile is broken, so just skip over it
			if (obj.x === 5) obj.x++;
			geoFeat = {
				x: obj.x,
				y: obj.y,
			};
		}
		return { x, y, geoFeat };
	}
}

export class FullWorld{
	constructor(obj){
		this.world = [];
		this.populate(obj);
	}

	populate(obj){
		for(let i = 0; i < 9; i++){
			let arr = [];
			for(let j = 0; j < 9; j++){
				arr.push(new World(obj));
			}
			this.world.push(arr);
		}
	}
}