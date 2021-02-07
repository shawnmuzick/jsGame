import { Player } from './actors/player.js';
import { Menu } from './UI/Menu.js';
import { HUD } from './UI/HUD.js';
export class Renderer {
	constructor(context) {
		this.context = context;
	}

	draw(obj, params) {
		if (obj instanceof Player) this.drawPlayer(obj);
		if (obj instanceof Menu) this.drawMenu(obj);
		if (obj instanceof HUD) this.drawHUD(obj, params);
	}

	drawPlayer(obj) {
		let offset = 1;
		let updateParams = [0];
		let scaleX = 0;
		let scaleY = 0;
		// if we have a sword and are attacking
		if (obj.swordMap && Array.from(obj.swordMap.values()).includes(obj.frameY)) {
			scaleX = obj.scaleWidth;
			scaleY = obj.scaleHeight;
			offset = 3;
			updateParams.push(5);
			if (obj.frameX % 3 !== 0) obj.frameX = 0;
			// if we're idle
		} else if (obj.isIdle) {
			updateParams.push(0);
			// if we have spells and are casting
		} else if (obj.spellMap && Array.from(obj.spellMap.values()).includes(obj.frameY)) {
			updateParams.push(6);
			// otherwise general update
		} else {
			updateParams.push(8);
		}
		this.context.drawImage(
			obj.img,
			obj.frameX,
			obj.frameY,
			obj.width * offset,
			obj.height * offset,
			obj.x - obj.width - scaleX,
			obj.y - obj.width - scaleY,
			obj.scaleWidth * offset,
			obj.scaleHeight * offset
		);
		obj.update(...updateParams, offset);
	}

	drawHUD(obj, params) {
		const { hpMax, hpCurrent, mpMax, mpCurrent } = params;
		// draw the dash area
		obj.drawConsole();
		// draw hp/mp globes with a transparent white "glass" behind them
		obj.drawOrb(mpMax, mpMax, obj.x - obj.radius, obj.y - obj.radius, 'white');
		obj.drawOrb(mpMax, mpCurrent, obj.x - obj.radius, obj.y - obj.radius, 'blue');
		obj.drawOrb(hpMax, hpMax, 0 + obj.radius, obj.y - obj.radius, 'white');
		obj.drawOrb(hpMax, hpCurrent, 0 + obj.radius, obj.y - obj.radius, 'red');
	}
}
