function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function wander() {
	//still need to implement
	//if out of summoner range, don't let them wander further

	let direction = getRandomInt(8, 12);
	this.frameY = direction * this.height;
	switch (direction) {
		// in order: up, left, right, down
		case 8:
			this.y -= this.speed;
			break;
		case 9:
			this.x -= this.speed;
			break;
		case 10:
			this.y += this.speed;
			break;
		case 11:
			this.x += this.speed;
			break;
		default:
			this.y -= this.speed;
	}
	return;
}

function getSprite(name) {
	const sprites = {
		skeleton: './sprites/skeleton.png',
		necromancer: './sprites/necromancer.png',
	};
	const sprite = new Image();
	sprite.src = sprites[name];
	return sprite;
}

class Player {
	constructor({
		img,
		frameX = 0,
		frameY = 0,
		width = 64,
		height = 64,
		x = 0,
		y = 0,
		context,
	}) {
		this.img = img;
		this.frameX = frameX;
		this.frameY = frameY + 10 * height;
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
		this.scaleWidth = width * 2;
		this.scaleHeight = height * 2;
		this.actions = {
			up: 8,
			left: 9,
			down: 10,
			right: 11,
			swordUp: 21,
			swordDown: 27,
			swordLeft: 24,
			swordRight: 30,
		};
		this.context = context;
		this.speed = 5;
		this.isIdle = true;
	}

	draw() {
		let meleFrames = [21, 24, 27, 30];
		if (meleFrames.includes(this.frameY / this.height)) {
			if (this.frameX % 3 !== 0) this.frameX = 0;
			this.context.drawImage(
				this.img,
				this.frameX,
				this.frameY,
				this.width * 3,
				this.height * 3,
				this.x - this.width - this.scaleWidth,
				this.y - this.width - this.scaleHeight,
				this.scaleWidth * 3,
				this.scaleHeight * 3
			);
			this.update(0, 5, 3);
		} else {
			let spellFrames = [0, 1, 2, 3];
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
			if (this.isIdle) {
				//update for idle
				this.update(0, 0);
			} else if (spellFrames.includes(this.frameY / this.height)) {
				//update for spell cast
				this.update(0, 6);
			} else {
				//general update
				this.update();
			}
		}
	}

	update(start = 0, end = 8, offset = 1) {
		if (this.frameX >= this.width * end * offset) {
			this.frameX = start;
		}
		this.frameX += this.width * offset;
	}

	left() {
		this.frameY = this.actions.left * this.height;
		this.x -= this.speed;
	}

	right() {
		this.frameY = this.actions.right * this.height;
		this.x += this.speed;
	}

	up() {
		this.frameY = this.actions.up * this.height;
		this.y -= this.speed;
	}

	down() {
		this.frameY = this.actions.down * this.height;
		this.y += this.speed;
	}

	idle() {
		//get the current action of the player
		let direction = this.frameY / this.height;

		//return the player to their last facing direction after a mele attack
		if (direction === 21) this.frameY = this.actions.up * this.height;
		if (direction === 24) this.frameY = this.actions.left * this.height;
		if (direction === 27) this.frameY = this.actions.down * this.height;
		if (direction === 30) this.frameY = this.actions.right * this.height;
		//prevents animation skip
		this.frameX = 0;
		this.isIdle = true;
	}

	mele() {
		//check which direction we're facing so we swing in that direction
		if (this.frameY / this.height === this.actions['up']) {
			this.frameY = this.actions.swordUp * this.height;
		} else if (this.frameY / this.height === this.actions['left']) {
			this.frameY = this.actions.swordLeft * this.height;
		} else if (this.frameY / this.height === this.actions['right']) {
			this.frameY = this.actions.swordRight * this.height;
		} else if (this.frameY / this.height === this.actions['down']) {
			this.frameY = this.actions.swordDown * this.height;
		}
	}
}

export class Skeleton extends Player {
	constructor(obj) {
		obj.img = getSprite('skeleton');
		super(obj);
		this.speed = 3;
	}
}

export class Necromancer extends Player {
	constructor(obj) {
		obj.img = getSprite('necromancer');
		super(obj);
		this.actions.spellUp = 0;
		this.actions.spellLeft = 1;
		this.actions.spellDown = 2;
		this.actions.spellRight = 3;
		this.pets = [];
	}
	spell() {
		//check which direction we're facing so we swing in that direction
		if (this.frameY / this.height === this.actions['up']) {
			this.frameY = this.actions.spellUp * this.height;
		} else if (this.frameY / this.height === this.actions['left']) {
			this.frameY = this.actions.spellLeft * this.height;
		} else if (this.frameY / this.height === this.actions['right']) {
			this.frameY = this.actions.spellRight * this.height;
		} else if (this.frameY / this.height === this.actions['down']) {
			this.frameY = this.actions.spellDown * this.height;
		}
		let obj = { context: this.context, x: this.x, y: this.y };
		//pets should wander on idle
		let pet = new Skeleton(obj);
		pet.idle = wander;

		//pets should track their summoner
		pet.summoner = this;
		this.pets.push(pet);
	}
}
