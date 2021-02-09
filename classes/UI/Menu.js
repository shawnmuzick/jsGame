let img = new Image();
img.src = '../tiles/Stone_Floor.png';
export class Menu {
	constructor(x, y, context, width, height) {
		this.img = img;
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
}
