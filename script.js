// skele sprite playground
import { Player } from './classes.js';

const canvas = document.createElement('canvas');
const img = new Image();

img.src = './skeletonSprite.png';
canvas.classList.add('canvas');
canvas.width = 500;
canvas.height = 500;

const context = canvas.getContext('2d');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

document.body.appendChild(canvas);
const player = new Player(img, 0, 0, 64, 64, 0, 0, 200, 200);
function clear() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function paint() {
	clear();
	player.draw(context);
	setTimeout(() => requestAnimationFrame(paint), 100);
}
paint();

function keydown(e) {
	let obj = {
		ArrowRight: player.right(),
		ArrowLeft: player.left(),
		ArrowUp: player.up(),
		ArrowDown: player.down(),
	};
	return obj[e.key]?.();
}

document.addEventListener('keydown', keydown);
