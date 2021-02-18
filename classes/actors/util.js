export function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

export function getSpriteSheet(name) {
	const sprites = {
		skeleton: "./sprites/skeleton.png",
		necromancer: "./sprites/necromancer.png",
	};
	const sprite = new Image();
	sprite.src = sprites[name];
	return sprite;
}

export function getHitBox(actor) {
	return {
		xMin: actor.x,
		xMax: actor.x + actor.width,
		yMin: actor.y,
		yMax: actor.y + actor.height,
	};
}

export function getHit(hitbox, c) {
	console.log(hitbox);
	console.log(c);
	// if we're within the X range of the hitbox
	let x = false;
	let y = false;
	if (c.x + 0 > hitbox.xMin && c.x < hitbox.xMax) {
		console.log("c.x + 0");
		x = true;
	}
	if (c.x - 40 > hitbox.xMin && c.x < hitbox.xMax) {
		console.log("c.x - 1");
		x = true;
	}
	if (c.x + 40 > hitbox.xMin && c.x < hitbox.xMax) {
		console.log("c.x + 1");
		x = true;
	}
	if (c.y + 0 > hitbox.yMin && c.y < hitbox.yMax) {
		console.log("c.y + 0");
		y = true;
	}
	if (c.y - 50 > hitbox.yMin && c.y < hitbox.yMax) {
		console.log("c.y - 1");
		y = true;
	}
	if (c.y + 10 > hitbox.yMin && c.y < hitbox.yMax) {
		console.log("c.x + 1");
		y = true;
	}
	console.log(`x hit is ${x}`);
	console.log(`y hit is ${y}`);
	return x && y;
}
