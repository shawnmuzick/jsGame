// skele sprite playground
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

function drawPlayer(img, sx, sy, swidth, sheight, cx, cy, cwidth = swidth, cheight = sheight) {
	context.drawImage(img, sx, sy, swidth, sheight, cx, cy, cwidth, cheight);
}

function clear() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}

cx = 0;
cy = 0;
sx = 0;
sy = 0;
swidth = 64;
sheight = 64;
function paint() {
	clear();
	drawPlayer(img, sx, sheight * 9, swidth, sheight, cx, cy, 200, 200);
	sx += swidth;
	if (sx >= swidth * 9) sx = 0;
	setTimeout(() => requestAnimationFrame(paint), 100);
}
paint();
