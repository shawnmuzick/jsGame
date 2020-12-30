export class Player {
	constructor(img, spriteX, spriteY, spriteWidth, spriteHeight, cx, cy, cWidth, cHeight) {
		this.img = img;
		this.spriteX = spriteX;
		this.spriteY = spriteY;
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
		this.speed = 5;
	}

	draw(context) {
		context.drawImage(
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

	scroll() {
		this.spriteX += this.width;
		if (this.spriteX >= this.width * 9) this.spriteX = this.width;
	}

	left() {
		return () => {
			this.spriteY = this.animateLeft * this.height;
			this.xPosition -= this.speed;
			this.scroll();
		};
	}

	right() {
		return () => {
			this.spriteY = this.animateRight * this.height;
			this.xPosition += this.speed;
			this.scroll();
		};
	}

	up() {
		return () => {
			this.spriteY = this.animateUp * this.height;
			this.yPosition -= this.speed;
			this.scroll();
		};
	}

	down() {
		return () => {
			this.spriteY = this.animateDown * this.height;
			this.yPosition += this.speed;
			this.scroll();
		};
	}
}
