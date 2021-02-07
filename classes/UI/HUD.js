let img = new Image();
img.src = '../tiles/Stone_Floor.png';
export class HUD {
	constructor({ x, y }) {
		this.x = x * 2; // original canvas width
		this.y = y * 2; //original canvas height
		this.radius = 50;
	}
	drawConsole(context) {
		context.drawImage(img, 0, 0, this.x, 300, 0, this.y - 75, this.x, 300);
	}
	drawOrb(context, statMax, statCurrent, x, y, color) {
		if (color === 'white') {
			context.globalAlpha = 0.5;
		}
		context.beginPath();
		context.arc(
			x,
			y,
			this.radius,
			(1.5 + (1 - statCurrent / statMax)) * Math.PI,
			(3.5 - (1 - statCurrent / statMax)) * Math.PI
		);
		context.fillStyle = color;
		context.fill();
		if (color === 'white') {
			context.globalAlpha = 1;
		}
	}
}
