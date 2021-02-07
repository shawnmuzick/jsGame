import { HUD } from "../UI/HUD.js";
import { summonSkeleton } from "./spells/spells.js";
import { getSprite } from "./util.js";
import { walkMap, swordMap, spellMap, idleMap } from "./actionMaps.js";
class Player {
	constructor({
		img,
		frameX = 0,
		frameY = 10,
		width = 64,
		height = 64,
		x = 0,
		y = 0,
		context,
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
		this.walkMap = walkMap(width);
		this.idleMap = idleMap(width);
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
		let offset = 1;
		let updateParams = [0];
		let scaleX = 0;
		let scaleY = 0;
		// if we have a sword and are attacking
		if (
			this.swordMap &&
			Array.from(this.swordMap.values()).includes(this.frameY)
		) {
			scaleX = this.scaleWidth;
			scaleY = this.scaleHeight;
			offset = 3;
			updateParams.push(5);
			if (this.frameX % 3 !== 0) this.frameX = 0;
			// if we're idle
		} else if (this.isIdle) {
			updateParams.push(0);
			// if we have spells and are casting
		} else if (
			this.spellMap &&
			Array.from(this.spellMap.values()).includes(this.frameY)
		) {
			updateParams.push(6);
			// otherwise general update
		} else {
			updateParams.push(8);
		}
		this.context.drawImage(
			this.img,
			this.frameX,
			this.frameY,
			this.width * offset,
			this.height * offset,
			this.x - this.width - scaleX,
			this.y - this.width - scaleY,
			this.scaleWidth * offset,
			this.scaleHeight * offset
		);
		this.update(...updateParams, offset);
		// only draw the HUD if the actor should have one
		if (this.HUD) {
			this.HUD.draw(
				this.stats.mp.max,
				this.stats.mp.current,
				this.stats.hp.max,
				this.stats.hp.current
			);
		}
	}

	update(start = 0, end = 8, offset = 1) {
		if (this.frameX >= this.width * end * offset) {
			this.frameX = start;
		}
		this.frameX += this.width * offset;
	}

	up() {
		this.frameY = this.walkMap.get("up");
		this.y -= this.speed;
	}

	left() {
		this.frameY = this.walkMap.get("left");
		this.x -= this.speed;
	}

	down() {
		this.frameY = this.walkMap.get("down");
		this.y += this.speed;
	}

	right() {
		this.frameY = this.walkMap.get("right");
		this.x += this.speed;
	}

	idle() {
		this.frameY = this.idleMap.get(this.frameY / this.height);
		this.frameX = 0;
		this.isIdle = true;
	}

	mele() {
		//check which direction we're facing so we swing in that direction
		if (this.frameY === this.walkMap.get("up")) {
			this.frameY = this.swordMap.get("up");
			this.pets.forEach((p) => {
				p.frameY = p.swordMap.get("up");
			});
		} else if (this.frameY === this.walkMap.get("left")) {
			this.frameY = this.swordMap.get("left");
			this.pets.forEach((p) => {
				p.frameY = p.swordMap.get("left");
			});
		} else if (this.frameY === this.walkMap.get("down")) {
			this.frameY = this.swordMap.get("down");
			this.pets.forEach((p) => {
				p.frameY = p.swordMap.get("down");
			});
		} else if (this.frameY === this.walkMap.get("right")) {
			this.frameY = this.swordMap.get("right");
			this.pets.forEach((p) => {
				p.frameY = p.swordMap.get("right");
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
		this.swordMap = swordMap(this.width);
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
		this.spellMap = spellMap(this.width);
		this.swordMap = swordMap(this.width);
	}
	spell() {
		// if not enough mana, return
		if (this.stats.mp.current <= 0) return;

		//check which direction we're facing so we swing in that direction
		if (this.frameY === this.walkMap.get("up")) {
			this.frameY = this.spellMap.get("up");
		} else if (this.frameY === this.walkMap.get("left")) {
			this.frameY = this.spellMap.get("left");
		} else if (this.frameY === this.walkMap.get("down")) {
			this.frameY = this.spellMap.get("down");
		} else if (this.frameY === this.walkMap.get("right")) {
			this.frameY = this.spellMap.get("right");
		}
		summonSkeleton(this);
	}
}
