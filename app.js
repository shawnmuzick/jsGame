// skele sprite playground
import { Necromancer } from "./classes/actors/player.js";
import { KEYMAP } from "./classes/actors/KeyMapper.js";
import { Renderer } from "./classes/Renderer.js";
import { InventoryMenu, StatMenu } from "./classes/UI/Menu.js";
import { World } from "./classes/world/world.js";
import { REGISTRY } from "./classes/actors/ActorRegistry.js";
import Canvas from "./classes/Canvas.js";
//Initialization
const CANVAS = new Canvas(800);
const WORLD = new World(CANVAS);
let RENDERER = new Renderer(CANVAS.context);
REGISTRY.add(new Necromancer({ x: CANVAS.centerX, y: CANVAS.centerY, context: CANVAS.context }));
let menu = new StatMenu(CANVAS.centerX, CANVAS.centerY, CANVAS.context);
let invMenu = new InventoryMenu(CANVAS.centerX, CANVAS.centerY, CANVAS.context);

function drawWorld() {
  RENDERER.draw(WORLD.world[WORLD.currentSpaceX][WORLD.currentSpaceY]);
}

function drawActors() {
  function handleDraw(p, renderer) {
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
  }
  REGISTRY.listActors().forEach((p) => {
    handleDraw(p, RENDERER);
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
    drawWorld();
    // map.checkPosition(players[0]);
    drawActors();
  }
}

function keydown(e) {
  function handleKey(player) {
    player.isIdle = false;
    KEYMAP.keys[e.key](player);
    // if (player.pets?.length > 0) {
    //   keydown(e, player.pets);
    // }
  }

  REGISTRY.listActors().forEach((player) => {
    handleKey(player);
  });
}

function keyUp() {
  function handleKey(p) {
    p.idle();
    if (p.pets?.length > 0) {
      p.pets.forEach((pet) => {
        pet.idle();
      });
    }
  }
  REGISTRY.listActors().forEach((p) => {
    handleKey(p);
  });
}

document.addEventListener("keydown", (e) => keydown(e));
document.addEventListener("keyup", keyUp);
window.onload = requestAnimationFrame(paint);
