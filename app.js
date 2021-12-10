// skele sprite playground
import { Necromancer } from "./classes/actors/player.js";
import KeyMapper from "./classes/actors/KeyMapper.js";
import { Renderer } from "./classes/Renderer.js";
import { InventoryMenu, StatMenu } from "./classes/UI/Menu.js";
import { World, GameWorld } from "./classes/world/world.js";
import { buildCanvas } from "./DOM/DOMbuilders.js";
import ActorRegistry from "./classes/actors/ActorRegistry.js";
import Canvas from "./classes/Canvas.js";
//Initialization
//New Implementation
const CANVAS = new Canvas(100);
const WORLD = new GameWorld(CANVAS);
const KEYMAP = new KeyMapper();
let REGISTRY = new ActorRegistry();
let RENDERER = new Renderer(CANVAS.context);
REGISTRY.add(new Necromancer({ x: 1, y: 1, context: CANVAS.context }));
//-----------------------------------------------------
//Old Implementation
const canvas = buildCanvas(800);
const context = canvas.getContext("2d");
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

let renderer = new Renderer(context);
let menu = new StatMenu(centerX, centerY, context);
let invMenu = new InventoryMenu(centerX, centerY, context);
let players = [];
let p = new Necromancer({ x: centerX, y: centerY, context });
players.push(p);

export let map = new World({
  cWidth: canvas.width / 8,
  cHeight: canvas.height / 8,
});
map.actors.push(p);

export function getActorsInWorld() {
  return map.actors;
}

function clear() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawWorld() {
  renderer.draw(map.world[map.currentSpaceX][map.currentSpaceY]);
}

function drawActors() {
  map.actors.forEach((p) => {
    //if the caster is idle, keep the pets wandering
    if (p.isIdle) {
      p.pets?.forEach((pet) => pet.idle());
    }
    renderer.draw(p);
    renderer.draw(menu, p.stats);
    renderer.draw(invMenu, p.inventory);
    if (p.HUD)
      renderer.draw(p.HUD, {
        hpMax: p.stats.hp.max,
        hpCurrent: p.stats.hp.current,
        mpMax: p.stats.mp.max,
        mpCurrent: p.stats.mp.current,
      });
  });
}
let fps, fpsInterval, startTime, now, then, elapsed;
function fpsInit() {
  fps = 20;
  fpsInterval = 1000 / fps;
  then = Date.now();
  startTime = then;
}
fpsInit();
function fpsIncrement() {
  now = Date.now();
  elapsed = now - then;
}
function fpsUpdate() {
  then = now - (elapsed % fpsInterval);
}

function paint() {
  requestAnimationFrame(paint);
  fpsIncrement();
  if (elapsed > fpsInterval) {
    fpsUpdate();
    clear();
    drawWorld();
    map.checkPosition(players[0]);
    drawActors();
  }
}

function keydown(e, players) {
  players.forEach((player) => {
    player.isIdle = false;
    KEYMAP.keys[e.key](player);
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

document.addEventListener("keydown", (e) => keydown(e, players));
document.addEventListener("keyup", keyUp);
window.onload = requestAnimationFrame(paint);
