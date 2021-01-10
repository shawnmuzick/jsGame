export class Player {
	constructor(img, frameX, frameY, width, height, cx, cy, cWidth, cHeight, context) {
		this.img = img;
		this.frameX = frameX;
		this.frameY = frameY + 10 * height;
		this.width = width;
		this.height = height;
		this.x = cx;
		this.y = cy;
		this.scaleWidth = cWidth;
		this.scaleHeight = cHeight;
		this.actions = { up: 8, left: 9, down: 10, right: 11, swordUp: 12 };
		this.currentAction = 'idle';
		this.context = context;
		this.speed = 5;
	}

	draw() {
		if (this.currentAction === 'idle') {
			this.update(0, 0);
		} else if (this.currentAction === 'swordUp') {
			this.update(0, 5, 1);
		} else {
			this.update();
		}
		this.context.drawImage(
			this.img,
			this.frameX,
			this.frameY,
			this.width,
			this.height,
			this.x - this.width,
			this.y - this.width,
			this.scaleWidth,
			this.scaleHeight
		);
	}

	update(start = 0, end = 8, offset = 1) {
		if (this.frameX >= this.width * end * offset) {
			this.frameX = start;
		}
		this.frameX += this.width * offset;
	}

	left() {
		return () => {
			this.frameY = this.actions.left * this.height;
			this.x -= this.speed;
			this.currentAction = 'left';
		};
	}

	right() {
		return () => {
			this.frameY = this.actions.right * this.height;
			this.x += this.speed;
			this.currentAction = 'right';
		};
	}

	up() {
		return () => {
			this.frameY = this.actions.up * this.height;
			this.y -= this.speed;
			this.currentAction = 'up';
		};
	}

	down() {
		return () => {
			this.frameY = this.actions.down * this.height;
			this.y += this.speed;
			this.currentAction = 'down';
		};
	}

	idle() {
		let direction = this.actions[this.currentAction];
		if (direction === 21) this.frameY = this.actions.up * this.height;
		this.currentAction = 'idle';
	}

	mele() {
		return () => {
			console.log('mele');
			this.frameY = this.actions.swordUp * this.height;
			this.currentAction = 'swordUp';
		};
	}
}
