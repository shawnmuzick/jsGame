// maybe break hud components like orbs into separate classes
export class HUD {
	constructor({ context, x, y }) {
		this.context = context;
		this.x = x * 2; // original canvas width
		this.y = y * 2; //original canvas height
		this.radius = 50;
	}

	draw(mpMax, mpCurrent, hpMax,hpCurrent) {
		// begin HUD bar---------------------------------------------------------------------
		this.context.beginPath();
		this.context.rect(0, this.y - 50, this.x, 50);
		this.context.fillStyle = "grey";
		this.context.fill();
		// End HUD bar------------------------------------------------------------------------

		// Begin MP orb------------------------------------------------------------------------
		this.context.globalCompositeOperation = "source-over";
		this.context.beginPath();
		this.context.arc(
			this.x - this.radius,
			this.y - this.radius,
			this.radius,
			(1.5+(1-(mpCurrent/mpMax))) * Math.PI,
			(3.5-(1-(mpCurrent/mpMax))) * Math.PI,
		);
		this.context.fillStyle = "blue";
		this.context.fill();

		// End MP orb--------------------------------------------------------------------------

		// Begin HP orb-------------------------------------------------------------------------
		this.context.globalCompositeOperation = "source-over";
		this.context.beginPath();
		this.context.arc(
			0 + this.radius,
			this.y - this.radius,
			this.radius,
			(1.5+(1-(hpCurrent/hpMax))) * Math.PI,
			(3.5-(1-(hpCurrent/hpMax))) * Math.PI,
		);
		this.context.fillStyle = "red";
		this.context.fill();

		// End HP orb-------------------------------------------------------------------------
	}
}
