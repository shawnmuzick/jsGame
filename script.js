// skele sprite playground
import { Player } from './classes/player.js';
import { World } from './classes/world.js';

const canvas = document.createElement('canvas');
canvas.classList.add('canvas');
canvas.width = 800;
canvas.height = 800;
const context = canvas.getContext('2d');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

document.body.appendChild(canvas);

let playerImg = new Image();
playerImg.src = './skeletonSprite.png';
let player = new Player(playerImg, 0, 0, 64, 64, centerX, centerY, 200, 200, context);

let worldImg = new Image();
worldImg.src = './LPC_forest/forest_tiles.png';
let world = new World(
	worldImg,
	0,
	0,
	32,
	32,
	0,
	0,
	Math.round(canvas.width / 3),
	Math.round(canvas.height / 3),
	context
);
function clear() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function paint() {
	clear();
	world.draw();
	player.draw();
	setTimeout(() => requestAnimationFrame(paint), 100);
}
paint();

function keydown(e) {
	player.isMoving = true;
	let obj = {
		ArrowRight: player.right,
		ArrowLeft: player.left,
		ArrowUp: player.up,
		ArrowDown: player.down,
	};
	player.direction = obj[e.key] || player.direction;
	return;
}

function keyUp() {
	player.isMoving = false;
	player.direction = () => {
		return null;
	};
}

document.addEventListener('keydown', keydown);
document.addEventListener('keyup', keyUp);
