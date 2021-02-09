import { HUD } from "../UI/HUD.js";
import { summonSkeleton } from "./spells/spells.js";
import { getSpriteSheet } from "./util.js";
import { walkMap, swordMap, spellMap, idleMap } from "./actionMaps.js";
export class Player {
	constructor({
		img,
		frameX = 0,
		frameY = 10,
		width = 64,
		height = 64,
		x = 0,
		y = 0,
	}) {
		this.img = img;
		this.frameX = frameX;
		this.frameY = frameY * height;
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
		this.scaleWidth = width * 1.5;
		this.scaleHeight = height * 1.5;
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
		});
	}

	update(start = 0, end = 8, offset = 1) {
		if (this.frameX >= this.width * end * offset) {
			this.frameX = start;
		}
		this.frameX += this.width * offset;
	}

	up() {
		this.frameY = walkMap.get("up");
		this.y -= this.speed;
	}

	left() {
		this.frameY = walkMap.get("left");
		this.x -= this.speed;
	}

	down() {
		this.frameY = walkMap.get("down");
		this.y += this.speed;
	}

	right() {
		this.frameY = walkMap.get("right");
		this.x += this.speed;
	}

	idle() {
		this.frameY = idleMap.get(this.frameY / this.height);
		this.frameX = 0;
		this.isIdle = true;
	}

	mele() {
		if (walkMap.has(this.frameY)) {
			this.frameY = swordMap.get(this.frameY);
			this.pets?.forEach((p) => {
				p.frameY = swordMap.get(p.frameY);
			});
		}
	}

	lvlUp() {
		this.stats.pts += 5;
	}
}

export class Skeleton extends Player {
	constructor(obj) {
		obj.img = getSpriteSheet("skeleton");
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
		obj.img = getSpriteSheet("necromancer");
		super(obj);
		this.pets = [];
		this.stats = {
			hp: { max: 10, current: 10 },
			mp: { max: 20, current: 20 },
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
		if (this.stats.mp.current <= 0) return;

		if (walkMap.has(this.frameY))
			this.frameY = spellMap.get(this.frameY);
		summonSkeleton(this);
	}
}
