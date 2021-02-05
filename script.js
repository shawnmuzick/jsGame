// skele sprite playground
import { Skeleton, Necromancer } from "./classes/actors/player.js";
import { StatMenu } from "./classes/UI/Menu.js";
import { World } from "./classes/world.js";

const canvas = document.createElement("canvas");
canvas.classList.add("canvas");
canvas.width = 800;
canvas.height = 800;
const context = canvas.getContext("2d");
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

document.body.appendChild(canvas);
let menu = new StatMenu(centerX, centerY, context);
let players = [];
players.push(new Necromancer({ x: centerX, y: centerY, context }));

let worldImg = new Image();
worldImg.src = "./LPC_forest/forest_tiles.png";
let world = new World(
	worldImg,
	0,
	0,
	32,
	32,
	0,
	0,
	Math.round(canvas.width / 8),
	Math.round(canvas.height / 8),
	context
);
function clear() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function paint() {
	clear();
	world.draw();
	players.forEach((p) => {
		if (p.pets?.length > 0) {
			p.pets.forEach((pet) => pet.draw());
		}
		//if the caster is idle, keep the pets wandering
		if (p.isIdle === true) {
			p.pets.forEach((pet) => pet.idle());
		}
		//draw player last so they appear above pets in an overlap
		p.draw();
		// if the menu is open, draw it
		if (menu.open) menu.draw(p.stats);
	});
}

function keydown(e, players) {
	players.forEach((player) => {
		player.isIdle = false;
		switch (e.key) {
			case "ArrowRight":
				player.right();
				break;
			case "ArrowLeft":
				player.left();
				break;
			case "ArrowUp":
				player.up();
				break;
			case "ArrowDown":
				player.down();
				break;
			case "s":
				player.spell?.();
				break;
			case " ":
				player.mele();
				break;
			case "t":
				menu.open = !menu.open;
				//prevent walking while opening menu
				player.idle();
				break;
			default:
				player.idle();
		}
		if (player.pets?.length > 0) {
			keydown(e, player.pets);
		}
	});
}

function keyUp() {
	players.forEach((p) => {
		p.idle();
		if (p.pets?.length > 0) {
			p.pets.forEach((pet) => pet.idle());
		}
	});
}

document.addEventListener("keydown", (e) => keydown(e, players));
document.addEventListener("keyup", keyUp);
window.onload = setInterval(paint, 1000 / 15);
