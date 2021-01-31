import { HUD } from "./HUD.js";

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function wander() {
	//if out of summoner x range, don't let them wander further
	let leftLimit =
		this.x <= this.summoner.x &&
		this.summoner.x - this.x > this.summoner.petRange;
	let rightLimit =
		this.x >= this.summoner.x &&
		this.x - this.summoner.x > this.summoner.petRange;
	let upLimit =
		this.y <= this.summoner.y &&
		this.summoner.y - this.y > this.summoner.petRange;
	let downLimit =
		this.y >= this.summoner.y &&
		this.y - this.summoner.y > this.summoner.petRange;

	let direction = getRandomInt(8, 12);
	if (upLimit && direction === this.actions.up) {
		direction += 2;
	}
	if (leftLimit && direction === this.actions.left) {
		direction += 2;
	}
	if (downLimit && direction === this.actions.down) {
		direction -= 2;
	}
	if (rightLimit && direction === this.actions.right) {
		direction -= 2;
	}
	this.frameY = direction * this.height;
	switch (direction) {
		// in order: up, left, down, right
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
		skeleton: "./sprites/skeleton.png",
		necromancer: "./sprites/necromancer.png",
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
		this.scaleWidth = width * 1.5;
		this.scaleHeight = height * 1.5;
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
		this.isLiving = true;
		this.inventory = [];
		this.stats = {
			hp: { max: 0, current: 0 },
			mp: { max: 0, current: 0 },
			vit: 0,
			dex: 0,
			str: 0,
			mag: 0,
			exp: 0,
			lvl: 1,
			// pts represents lvl up points to allocate
			pts: 0,
		};
		this.HUD = new HUD({
			x: x,
			y: y,
			context: context,
		});
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
			} else if (
				spellFrames.includes(this.frameY / this.height)
			) {
				//update for spell cast
				this.update(0, 6);
			} else {
				//general update
				this.update();
			}
		}
		this.HUD.draw(
			this.stats.mp.max,
			this.stats.mp.current,
			this.stats.hp.max,
			this.stats.hp.current
		);
	}

	update(start = 0, end = 8, offset = 1) {
		if (this.frameX >= this.width * end * offset) {
			this.frameX = start;
		}
		this.frameX += this.width * offset;
	}

	up() {
		this.frameY = this.actions.up * this.height;
		this.y -= this.speed;
	}

	left() {
		this.frameY = this.actions.left * this.height;
		this.x -= this.speed;
	}

	down() {
		this.frameY = this.actions.down * this.height;
		this.y += this.speed;
	}

	right() {
		this.frameY = this.actions.right * this.height;
		this.x += this.speed;
	}

	idle() {
		//get the current action of the player
		let direction = this.frameY / this.height;

		//return the player to their last facing direction after a mele attack
		if (direction === 21)
			this.frameY = this.actions.up * this.height;
		if (direction === 24)
			this.frameY = this.actions.left * this.height;
		if (direction === 27)
			this.frameY = this.actions.down * this.height;
		if (direction === 30)
			this.frameY = this.actions.right * this.height;
		//prevents animation skip
		this.frameX = 0;
		this.isIdle = true;
	}

	mele() {
		//check which direction we're facing so we swing in that direction
		if (this.frameY / this.height === this.actions["up"]) {
			this.frameY = this.actions.swordUp * this.height;
			this.pets.forEach((p) => {
				p.frameY = p.actions.swordUp * p.height;
			});
		} else if (this.frameY / this.height === this.actions["left"]) {
			this.frameY = this.actions.swordLeft * this.height;
			this.pets.forEach((p) => {
				p.frameY = p.actions.swordLeft * p.height;
			});
		} else if (this.frameY / this.height === this.actions["down"]) {
			this.frameY = this.actions.swordDown * this.height;
			this.pets.forEach((p) => {
				p.frameY = p.actions.swordDown * p.height;
			});
		} else if (
			this.frameY / this.height ===
			this.actions["right"]
		) {
			this.frameY = this.actions.swordRight * this.height;
			this.pets.forEach((p) => {
				p.frameY = p.actions.swordRight * p.height;
			});
		}
	}

	lvlUp() {
		this.stats.pts += 5;
	}
}

export class Skeleton extends Player {
	constructor(obj) {
		obj.img = getSprite("skeleton");
		super(obj);
		this.speed = 3;
		this.stats = {
			hp: 8,
			mp: 0,
			vit: 8,
			dex: 7,
			str: 10,
			mag: 5,
			exp: 0,
			lvl: 1,
			pts: 0,
		};
	}
}

export class Necromancer extends Player {
	constructor(obj) {
		obj.img = getSprite("necromancer");
		super(obj);
		this.actions.spellUp = 0;
		this.actions.spellLeft = 1;
		this.actions.spellDown = 2;
		this.actions.spellRight = 3;
		this.pets = [];
		this.stats = {
			hp: { max: 10, current: 10 },
			mp: { max: 10, current: 10 },
			vit: 10,
			dex: 5,
			str: 5,
			mag: 10,
			exp: 0,
			lvl: 1,
			pts: 0,
		};
		this.petRange = 100;
	}
	spell() {
		// if not enough mana, return
		if (this.stats.mp.current <= 0) {
			console.log("out of mana");
			return;
		}

		//check which direction we're facing so we swing in that direction
		if (this.frameY / this.height === this.actions["up"]) {
			this.frameY = this.actions.spellUp * this.height;
		} else if (this.frameY / this.height === this.actions["left"]) {
			this.frameY = this.actions.spellLeft * this.height;
		} else if (this.frameY / this.height === this.actions["down"]) {
			this.frameY = this.actions.spellDown * this.height;
		} else if (
			this.frameY / this.height ===
			this.actions["right"]
		) {
			this.frameY = this.actions.spellRight * this.height;
		}

		//pets should wander on idle
		let pet = new Skeleton({
			context: this.context,
			x: this.x,
			y: this.y,
		});
		pet.idle = wander;
		pet.stats = {
			hp: this.stats.hp / 4,
			mp: this.stats.mp / 4,
			vit: this.stats.vit / 4,
			dex: this.stats.dex / 4,
			str: this.stats.str / 4,
			mag: this.stats.mag / 4,
			exp: null,
			lvl: this.stats.lvl,
			pts: null,
		};
		pet.HUD = {};
		pet.HUD.draw = () => {
			return;
		};

		//pets should track their summoner
		pet.summoner = this;
		this.pets.push(pet);
		this.stats.mp.current -= 2;
	}
}
