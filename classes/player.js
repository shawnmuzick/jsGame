export class Player {
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
		this.speed = 10;
		this.context = context;
		this.direction = () => {
			return null;
		};
		this.isMoving = false;
	}

	draw() {
		this.direction();
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
		this.scroll();
	}

	scroll(loopLimit = 8, loopStart = 0) {
		if (!this.isMoving) {
			loopStart = 0;
			loopLimit = 0;
		}
		if (this.spriteX >= this.width * loopLimit) {
			this.spriteX = loopStart;
		}

		this.spriteX += this.width;
	}

	left() {
		console.log('left');
		this.spriteY = this.animateLeft * this.height;
		this.xPosition -= this.speed;
		console.log(this.spriteY);
	}

	right() {
		console.log('right');
		this.spriteY = this.animateRight * this.height;
		this.xPosition += this.speed;
		console.log(this.animateRight);
		console.log(this);
	}

	up() {
		this.spriteY = this.animateUp * this.height;
		this.yPosition -= this.speed;
	}

	down() {
		this.spriteY = this.animateDown * this.height;
		this.yPosition += this.speed;
	}
}
