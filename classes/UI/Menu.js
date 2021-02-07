let img = new Image();
img.src = '../tiles/Stone_Floor.png';
export class Menu {
	constructor(x, y, context, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.context = context;
		this.open = false;
	}
}

export class InventoryMenu extends Menu {}

export class StatMenu extends Menu {
	constructor(x, y, context) {
		super(x, y, context, 400, 400);
	}
	draw(data) {
		// only draw if window is open
		if (!this.open) return;
		// draw the stat window
		this.context.drawImage(
			img,
			this.x - this.width / 2,
			this.y - this.height / 2,
			this.width,
			this.height
		);
		// loop through stats and print them out
		let i = 40;
		this.context.font = '20px serif';
		this.context.fillStyle = 'yellow';
		let string = '';
		for (const stat in data) {
			if (stat === 'hp') {
				string = `${stat}: ${data[stat].current}/${data[stat].max}`;
			} else if (stat === 'mp') {
				string = `${stat}: ${data[stat].current}/${data[stat].max}`;
			} else {
				string = `${stat}: ${data[stat]}`;
			}
			this.context.fillText(
				string,
				this.x - this.width / 2 + 20,
				this.y - this.height / 2 + i
			);
			i += 30;
		}
	}
}
