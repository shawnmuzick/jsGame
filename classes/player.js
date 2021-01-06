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
		const x = this.direction();
		if (x === 1) {
			if (this.spriteX === 64) this.spriteX = 192;
			console.log(this);
			this.context.drawImage(
				this.img,
				this.spriteX,
				this.spriteY,
				this.width * 3,
				this.height * 3,
				this.xPosition - 10 - this.width * 3,
				this.yPosition - 10 - this.width * 3,
				this.scaleWidth * 3,
				this.scaleHeight * 3
			);
			this.scrollAttack();
		} else {
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
	}

	scroll(loopLimit = 8, loopStart = 0) {
		if (!this.isMoving) {
			loopStart = 0;
			loopLimit = 0;
			//reset sprite cooridnates for standing still
			this.spriteX = 0;
			this.spriteY = 0;
		}
		if (this.spriteX >= this.width * loopLimit) {
			this.spriteX = loopStart;
		}

		this.spriteX += this.width;
	}

	scrollAttack(loopLimit = 5, loopStart = 0) {
		if (this.spriteX >= this.width * loopLimit * 3) {
			this.spriteX = loopStart;
			console.log('animation reset');
		}

		this.spriteX += this.width * 3;
	}

	left() {
		this.spriteY = this.animateLeft * this.height;
		this.xPosition -= this.speed;
	}

	right() {
		this.spriteY = this.animateRight * this.height;
		this.xPosition += this.speed;
	}

	up() {
		this.spriteY = this.animateUp * this.height;
		this.yPosition -= this.speed;
	}

	down() {
		this.spriteY = this.animateDown * this.height;
		this.yPosition += this.speed;
	}
	mele() {
		this.spriteY = 21 * this.height;
		return 1;
	}
}
