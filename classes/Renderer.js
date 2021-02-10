import { Player } from "./actors/player.js";
import { Menu, StatMenu } from "./UI/Menu.js";
import { HUD } from "./UI/HUD.js";
import { World } from "./world/world.js";
import { walkMap, swordMap, spellMap, idleMap } from "./actors/actionMaps.js";
export class Renderer {
	constructor(context) {
		this.context = context;
		
	}

	draw(obj, params) {
		if (obj instanceof Player) this.drawPlayer(obj);
		if (obj instanceof HUD) this.drawHUD(obj, params);
		if (obj instanceof World) this.drawWorld(obj);
		if (obj instanceof StatMenu) this.drawStatMenu(obj, params);
	}

	drawPlayer(obj) {
		let offset = 1;
		let updateParams = [0];
		let scaleX = 0;
		let scaleY = 0;
		// if we have a sword and are attacking
		if (Array.from(swordMap.values()).includes(obj.frameY)) {
			scaleX = obj.scaleWidth;
			scaleY = obj.scaleHeight;
			offset = 3;
			updateParams.push(5);
			if (obj.frameX % 3 !== 0) obj.frameX = 0;
			// if we're idle
		} else if (obj.isIdle) {
			updateParams.push(0);
			// if we have spells and are casting
		} else if (Array.from(spellMap.values()).includes(obj.frameY)) {
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
		obj.drawConsole(this.context);
		// draw hp/mp globes with a transparent white "glass" behind them
		obj.drawOrb(
			this.context,
			mpMax,
			mpMax,
			obj.x - obj.radius,
			obj.y - obj.radius,
			"white"
		);
		obj.drawOrb(
			this.context,
			mpMax,
			mpCurrent,
			obj.x - obj.radius,
			obj.y - obj.radius,
			"blue"
		);
		obj.drawOrb(
			this.context,
			hpMax,
			hpMax,
			0 + obj.radius,
			obj.y - obj.radius,
			"white"
		);
		obj.drawOrb(
			this.context,
			hpMax,
			hpCurrent,
			0 + obj.radius,
			obj.y - obj.radius,
			"red"
		);
	}

	drawWorld(obj) {
		//render out the world tiles
		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 9; j++) {
				this.context.drawImage(
					obj.img,
					obj.grid[i][j].x * obj.width,
					obj.grid[i][j].y * obj.width,
					obj.width,
					obj.height,
					obj.scaleWidth * i,
					obj.scaleHeight * j,
					//fixes breaks/seams
					obj.scaleWidth + 2,
					obj.scaleHeight + 2
				);
				//if drew plain grass in the step above
				if (obj.grid[i][j].geofeat !== false) {
					//add geographic feature on top of it
					this.context.drawImage(
						obj.img,
						obj.grid[i][j].geoFeat.x *
							obj.width,
						obj.grid[i][j].geoFeat.y *
							obj.width,
						obj.width,
						obj.height,
						obj.scaleWidth * i,
						obj.scaleHeight * j,
						//fixes breaks/seams
						obj.scaleWidth + 2,
						obj.scaleHeight + 2
					);
				}
			}
		}
	}

	drawStatMenu(obj, data) {

		// only draw if window is open
		if (!obj.open) return;
		console.log("open")
		// draw the stat window
		this.context.drawImage(
			obj.img,
			obj.x - obj.width / 2,
			obj.y - obj.height / 2,
			obj.width,
			obj.height
		);
		// loop through stats and print them out
		let i = 40;
		this.context.font = "20px serif";
		this.context.fillStyle = "yellow";
		let string = "";
		for (const stat in data) {
			if (stat === "hp") {
				string = `${stat}: ${data[stat].current}/${data[stat].max}`;
			} else if (stat === "mp") {
				string = `${stat}: ${data[stat].current}/${data[stat].max}`;
			} else {
				string = `${stat}: ${data[stat]}`;
			}
			this.context.fillText(
				string,
				obj.x - obj.width / 2 + 20,
				obj.y - obj.height / 2 + i
			);
			i += 30;
		}
	}
}
