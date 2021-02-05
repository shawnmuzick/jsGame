
export function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}


export function getSprite(name) {
	const sprites = {
		skeleton: "./sprites/skeleton.png",
		necromancer: "./sprites/necromancer.png",
	};
	const sprite = new Image();
	sprite.src = sprites[name];
	return sprite;
}