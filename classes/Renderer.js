import { Player } from "./actors/player.js";
import { Menu, StatMenu } from "./UI/Menu.js";
import { HUD } from "./UI/HUD.js";
import { World } from "./world/world.js";
import { walkMap, swordMap, spellMap, idleMap } from "./actors/actionMaps.js";
import { getHitBox, getHit } from "./actors/util.js";
import { getActorsInWorld } from "../app.js";
function getHitDirection(){

}

function iterateActors(actors, obj) {
	for (let i = 0; i < actors.length; i++) {
		//if actor is the caller of DrawPlayer, skip, because the player can't hit themselves
		if (actors[i] === obj) {
			continue;
			// if the actor is the summoner of the caller of DrawPlayer, skip, because pets shouldn't kill summoner
		} else if (obj.summoner === actors[i]) {
			continue;
		} else {
			//get the actor's hitbox
			let bx = getHitBox(actors[i]);
			// animation frames
			let animationFrames = [192, 384, 576, 768, 960];
			let cooridnate = animationFrames.indexOf(obj.frameX);
			// facing up, depending on position and frameX
			let upFrames = [
				{ x: obj.x - obj.width * 1.0, y: obj.y + 0.5 * obj.height }, //left
				{ x: obj.x - obj.width * 0.5, y: obj.y - 0.5 * obj.height }, //upper left
				{ x: obj.x + obj.width * 0.5, y: obj.y - 1.0 * obj.height }, //mid
				{ x: obj.x + obj.width * 1.5, y: obj.y - 0.5 * obj.height }, //upper right
				{ x: obj.x + obj.width * 2.0, y: obj.y + 0.5 * obj.height }, // right
			];
			let downFrames = [
				{ x: obj.x - obj.width * 1.0, y: obj.y + 0.5 * obj.height }, //left
				{ x: obj.x - obj.width * 0.5, y: obj.y + 1.5 * obj.height }, //lower left
				{ x: obj.x + obj.width * 0.5, y: obj.y + 2.0 * obj.height }, //mid
				{ x: obj.x + obj.width * 1.5, y: obj.y + 1.5 * obj.height }, //lower right
				{ x: obj.x + obj.width * 2.0, y: obj.y + 0.5 * obj.height }, // right
			];
			let leftFrames = [
				{ x: obj.x - obj.width * 0.25, y: obj.y + 0.5 * obj.height },
				{ x: obj.x - obj.width * 0.5, y: obj.y + 0.5 * obj.height },
				{ x: obj.x - obj.width * 0.75, y: obj.y + 0.5 * obj.height },
				{ x: obj.x - obj.width * 1.0, y: obj.y + 0.5 * obj.height },
				{ x: obj.x - obj.width * 1.25, y: obj.y + 0.5 * obj.height },
			];
			let rightFrames = [
				{ x: obj.x + obj.width * 1.0, y: obj.y + 0.5 * obj.height },
				{ x: obj.x + obj.width * 0.25, y: obj.y + 0.5 * obj.height },
				{ x: obj.x + obj.width * 0.5, y: obj.y + 0.5 * obj.height },
				{ x: obj.x + obj.width * 0.75, y: obj.y + 0.5 * obj.height },
				{ x: obj.x + obj.width * 1.0, y: obj.y + 0.5 * obj.height },
				{ x: obj.x + obj.width * 1.25, y: obj.y + 0.5 * obj.height },
			];
			//if the current attack frame was within the hitbox, register the hit
			let hit = null;

			if (obj.frameY === 21 * obj.width && cooridnate != -1) {
				hit = getHit(bx, upFrames[cooridnate]); //if facing up
			}
			if (obj.frameY === 24 * obj.width && cooridnate != -1) {
				hit = getHit(bx, leftFrames[cooridnate]); //if facing up
			}
			if (obj.frameY === 27 * obj.width && cooridnate != -1) {
				hit = getHit(bx, downFrames[cooridnate]); //if facing up
			}
			if (obj.frameY === 30 * obj.width && cooridnate != -1) {
				hit = getHit(bx, rightFrames[cooridnate]); //if facing up
			}
			//if the hit registered, kill the actor
			actors[i].isLiving = !hit;
			//if actor is dead, remove them from the list of actors
			if (!actors[i].isLiving) {
				actors.splice(i, 1);
			}
		}
	}
}
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
			// clean frameX from a previous action sequence
			if (obj.frameX % 3 !== 0) obj.frameX = 0;
			// only hit check on players for now
			if (obj.HUD) {
				//acquire list of actors
				let actors = getActorsInWorld();
				//iterate over the actors
				iterateActors(actors, obj);
			}
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
		let arr = [
			[mpMax, mpMax],
			[mpMax, mpCurrent],
			[hpMax, hpMax],
			[hpMax, hpCurrent],
		];
		// loop through the orbs and drawn them out
		for (let i = 0; i < obj.orbs.length; i++) {
			obj.drawOrb(
				this.context,
				arr[i][0],
				arr[i][1],
				obj.orbs[i].x,
				obj.orbs[i].y,
				obj.orbs[i].color,
				obj.orbs[i].alpha
			);
		}
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
						obj.grid[i][j].geoFeat.x * obj.width,
						obj.grid[i][j].geoFeat.y * obj.width,
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
