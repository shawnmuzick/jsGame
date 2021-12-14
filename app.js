// skele sprite playground
import { Necromancer } from "./classes/actors/player.js";
import { KEYMAP } from "./classes/actors/KeyMapper.js";
import { Renderer } from "./classes/Renderer.js";
import { InventoryMenu, StatMenu } from "./classes/UI/Menu.js";
import { World, checkPosition } from "./classes/world/world.js";
import { REGISTRY } from "./classes/actors/ActorRegistry.js";
import Canvas from "./classes/Canvas.js";
import { HUD } from "./classes/UI/HUD.js";
//Initialization
const CANVAS = new Canvas(800);
const WORLD = new World(CANVAS);
let RENDERER = new Renderer(CANVAS.context);
let PLAYER = new Necromancer({ x: CANVAS.centerX, y: CANVAS.centerY, context: CANVAS.context });
PLAYER.HUD = new HUD({ x: PLAYER.x, y: PLAYER.y });
PLAYER.statsMenu = new StatMenu(CANVAS.centerX, CANVAS.centerY, CANVAS.context);
PLAYER.invMenu = new InventoryMenu(CANVAS.centerX, CANVAS.centerY, CANVAS.context);
REGISTRY.add(PLAYER);

function drawPlayers(players) {
  players.forEach((p) => {
    //if the caster is idle, keep updating pets
    if (p.isIdle) p.pets?.forEach((pet) => pet.idle());

    RENDERER.drawActors(p);
    RENDERER.drawStatMenu(p.statsMenu, p.stats);
    RENDERER.drawInventoryMenu(p.invMenu, p.id);
    RENDERER.drawHUD(p.HUD, {
      hpMax: p.stats.hp.max,
      hpCurrent: p.stats.hp.current,
      mpMax: p.stats.mp.max,
      mpCurrent: p.stats.mp.current,
    });
  });
}
function drawNPCs(npcs) {
  npcs.forEach((p) => {
    RENDERER.drawActors(p);
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
    CANVAS.clear();
    RENDERER.drawScreen(WORLD.world[WORLD.currentSpaceX][WORLD.currentSpaceY]);
    checkPosition(REGISTRY.listActors()[0], WORLD);
    drawPlayers(REGISTRY.listActors().filter((a) => a.isNPC === false));
    drawNPCs(REGISTRY.listActors().filter((a) => a.isNPC === true));
  }
}

function keydown(e) {
  REGISTRY.listActors().forEach((player) => {
    player.isIdle = false;
    KEYMAP.keys[e.key](player);
  });
}

function keyUp() {
  REGISTRY.listActors().forEach((p) => {
    p.idle();
  });
}

document.addEventListener("keydown", (e) => keydown(e));
document.addEventListener("keyup", keyUp);
window.onload = requestAnimationFrame(paint);
