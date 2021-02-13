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
	if (c.x > hitbox.xMin && c.x < hitbox.xMax) x = true;
	if (c.y > hitbox.yMin && c.y < hitbox.yMax) y = true;
	console.log(`x hit is ${x}`)
	console.log(`y hit is ${y}`)
	return x && y;
}
