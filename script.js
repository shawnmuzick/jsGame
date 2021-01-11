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
let player = new Player(playerImg, 0, 0, 64, 64, centerX, centerY, context);

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
	Math.round(canvas.width / 8),
	Math.round(canvas.height / 8),
	context
);
function clear() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function paint() {
	clear();
	world.draw();
	player.draw();
}

function keydown(e) {
	switch (e.key) {
		case 'ArrowRight':
			player.right();
			break;

		case 'ArrowLeft':
			player.left();
			break;

		case 'ArrowUp':
			player.up();
			break;
		case 'ArrowDown':
			player.down();
			break;
		case ' ':
			player.mele();
			break;
		default:
			player.idle();
	}
}

function keyUp() {
	player.idle();
}

document.addEventListener('keydown', keydown);
document.addEventListener('keyup', keyUp);
window.onload = setInterval(paint, 1000 / 10);
