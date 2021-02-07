let up = 8;
let left = 9;
let down = 10;
let right = 11;

function WalkMap(size) {
	let map = new Map();
	map.set('up', up * size);
	map.set('left', left * size);
	map.set('down', down * size);
	map.set('right', right * size);
	return map;
}

function SwordMap(size) {
	let map = new Map();
	map.set('up', 21 * size);
	map.set('left', 24 * size);
	map.set('down', 27 * size);
	map.set('right', 30 * size);
	return map;
}

function SpellMap(size) {
	let map = new Map();
	map.set('up', 0 * size);
	map.set('left', 1 * size);
	map.set('down', 2 * size);
	map.set('right', 3 * size);
	return map;
}
function IdleMap(size) {
	let map = new Map();
	map.set(21, up * size);
	map.set(24, left * size);
	map.set(27, down * size);
	map.set(30, right * size);
	map.set(0, up * size);
	map.set(1, left * size);
	map.set(2, down * size);
	map.set(3, right * size);
	map.set(8, up * size);
	map.set(9, left * size);
	map.set(10, down * size);
	map.set(11, right * size);
	return map;
}
export const walkMap = WalkMap(64);
export const spellMap = SpellMap(64);
export const swordMap = SwordMap(64);
export const idleMap = IdleMap(64);
