import { getRandomInt } from "./util.js";
export function wander(caller) {
	//if out of summoner x range, don't let them wander further
	let leftLimit = caller.summoner.x - caller.x > caller.summoner.petRange;
	let rightLimit =
		caller.x - caller.summoner.x > caller.summoner.petRange;
	let upLimit = caller.summoner.y - caller.y > caller.summoner.petRange;
	let downLimit = caller.y - caller.summoner.y > caller.summoner.petRange;

	let direction = getRandomInt(8, 12);
	if (upLimit && direction === caller.actions.up) {
		direction += 2;
	}
	if (leftLimit && direction === caller.actions.left) {
		direction += 2;
	}
	if (downLimit && direction === caller.actions.down) {
		direction -= 2;
	}
	if (rightLimit && direction === caller.actions.right) {
		direction -= 2;
	}
	caller.frameY = direction * caller.height;
	switch (direction) {
		// in order: up, left, down, right
		case 8:
			caller.y -= caller.speed;
			break;
		case 9:
			caller.x -= caller.speed;
			break;
		case 10:
			caller.y += caller.speed;
			break;
		case 11:
			caller.x += caller.speed;
			break;
		default:
			caller.y -= caller.speed;
	}
	return;
}
