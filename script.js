// skele sprite playground
import { Player } from './classes.js';

const canvas = document.createElement('canvas');
const img = new Image();
let game = {
	keydown: false,
};

img.src = './skeletonSprite.png';
canvas.classList.add('canvas');
canvas.width = 500;
canvas.height = 500;

const context = canvas.getContext('2d');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

document.body.appendChild(canvas);
const player = new Player(img, 0, 0, 64, 64, centerX, centerY, 200, 200, context);
function clear() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function paint() {
	clear();
	player.draw();
	if (game.keyDown) player.scroll();
	if (!game.keyDown) player.scroll(0, 0);
	console.log(game.keyDown);
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
	game.keyDown = true;
	return obj[e.key]?.();
}

function keyUp() {
	game.keyDown = false;
}

document.addEventListener('keydown', keydown);
document.addEventListener('keyup', keyUp);
