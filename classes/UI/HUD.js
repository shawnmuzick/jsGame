let img = new Image();
img.src = "../tiles/Stone_Floor.png";
export class HUD {
	constructor({ context, x, y }) {
		this.context = context;
		this.x = x * 2; // original canvas width
		this.y = y * 2; //original canvas height
		this.radius = 50;
	}

	draw(mpMax, mpCurrent, hpMax, hpCurrent) {
		// draw the dash area
		this.drawConsole();
		// draw hp/mp globes with a transparent white "glass" behind them
		this.drawOrb(
			mpMax,
			mpMax,
			this.x - this.radius,
			this.y - this.radius,
			"white"
		);
		this.drawOrb(
			mpMax,
			mpCurrent,
			this.x - this.radius,
			this.y - this.radius,
			"blue"
		);
		this.drawOrb(
			hpMax,
			hpMax,
			0 + this.radius,
			this.y - this.radius,
			"white"
		);
		this.drawOrb(
			hpMax,
			hpCurrent,
			0 + this.radius,
			this.y - this.radius,
			"red"
		);
	}
	drawConsole() {
		this.context.drawImage(
			img,
			0,
			0,
			this.x,
			300,
			0,
			this.y - 75,
			this.x,
			300
		);
	}
	drawOrb(statMax, statCurrent, x, y, color) {
		if (color === "white") {
			this.context.globalAlpha = 0.5;
		}
		this.context.beginPath();
		this.context.arc(
			x,
			y,
			this.radius,
			(1.5 + (1 - statCurrent / statMax)) * Math.PI,
			(3.5 - (1 - statCurrent / statMax)) * Math.PI
		);
		this.context.fillStyle = color;
		this.context.fill();
		if (color === "white") {
			this.context.globalAlpha = 1;
		}
	}
}
