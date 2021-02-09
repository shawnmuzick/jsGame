// skele sprite playground
import { Necromancer } from './classes/actors/player.js';
import { Renderer } from './classes/Renderer.js';
import { StatMenu } from './classes/UI/Menu.js';
import { FullWorld } from './classes/world.js';

const canvas = document.createElement('canvas');
canvas.classList.add('canvas');
canvas.width = 800;
canvas.height = 800;
const context = canvas.getContext('2d');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

document.body.appendChild(canvas);
let renderer = new Renderer(context);
let menu = new StatMenu(centerX, centerY, context);
let players = [];
players.push(new Necromancer({ x: centerX, y: centerY, context }));

let map = new FullWorld({
	cWidth: Math.round(canvas.width / 8),
	cHeight: Math.round(canvas.height / 8),
});
function clear() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawWorld() {
	renderer.draw(map.world[0][0]);
}

function drawActors() {
	players.forEach((p) => {
		if (p.pets?.length > 0) {
			p.pets.forEach((pet) => renderer.draw(pet));
		}
		//if the caster is idle, keep the pets wandering
		if (p.isIdle === true) {
			p.pets.forEach((pet) => pet.idle());
		}
		renderer.draw(p);
		renderer.draw(menu, p.stats);
		if (p.HUD)
			renderer.draw(p.HUD, {
				hpMax: p.stats.hp.max,
				hpCurrent: p.stats.hp.current,
				mpMax: p.stats.mp.max,
				mpCurrent: p.stats.mp.current,
			});
	});
}

function paint() {
	clear();
	drawWorld();
	drawActors();
}

function keydown(e, players) {
	players.forEach((player) => {
		player.isIdle = false;
		switch (e.key) {
			case 'ArrowRight':
				player.right();
				break;
			case 'ArrowLeft':
				player.left();
				break;
			case 'ArrowUp':
				player.up();
				break;
			case 'ArrowDown':
				player.down();
				break;
			case 's':
				player.spell?.();
				break;
			case ' ':
				player.mele();
				break;
			case 't':
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
			p.pets.forEach((pet) => {
				pet.idle();
			});
		}
	});
}

document.addEventListener('keydown', (e) => keydown(e, players));
document.addEventListener('keyup', keyUp);
window.onload = setInterval(paint, 1000 / 15);
