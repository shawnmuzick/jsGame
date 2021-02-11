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
	// if we're within the X range of the hitbox
	let x = false;
	let y = false;
	if (c > hitbox.xMin && c < hitbox.xMax) x = true;
	if (c > hitbox.yMin && c < hitbox.yMax) y = true;
	return x && y;
}
