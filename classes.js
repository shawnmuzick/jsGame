export class Player {
	constructor(img, spriteX, spriteY, spriteWidth, spriteHeight, cx, cy, cWidth, cHeight, context) {
		this.img = img;
		this.spriteX = spriteX;
		this.spriteY = spriteY + 10 * spriteHeight;
		this.width = spriteWidth;
		this.height = spriteHeight;
		this.xPosition = cx;
		this.yPosition = cy;
		this.scaleWidth = cWidth;
		this.scaleHeight = cHeight;
		this.animateLeft = 9;
		this.animateRight = 11;
		this.animateUp = 8;
		this.animateDown = 10;
		this.speed = 3;
		this.context = context;
	}

	draw() {
		this.context.drawImage(
			this.img,
			this.spriteX,
			this.spriteY,
			this.width,
			this.height,
			this.xPosition,
			this.yPosition,
			this.scaleWidth,
			this.scaleHeight
		);

	}

	scroll(loopLimit = 8, loopStart = 0) {
		if (this.spriteX >= this.width * loopLimit){
			this.spriteX = loopStart;
		}

		this.spriteX += this.width;
	}

	left() {
		return () => {
			this.spriteY = this.animateLeft * this.height;
			this.xPosition -= this.speed;
		this.draw();
		};
	}

	right() {
		return () => {
			this.spriteY = this.animateRight * this.height;
			this.xPosition += this.speed;
		this.draw();
		};
	}

	up() {
		return () => {
			this.spriteY = this.animateUp * this.height;
			this.yPosition -= this.speed;
		this.draw();
		};
	}

	down() {
		return () => {
			this.spriteY = this.animateDown * this.height;
			this.yPosition += this.speed;
		this.draw();
		};
	}
}
