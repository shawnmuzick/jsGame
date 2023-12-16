// skele sprite playground
import { Necromancer } from "./classes/actors/Player.js";
import { KEYMAP } from "./classes/actors/KeyMapper.js";
import { Renderer } from "./classes/Renderer.js";
import { World, checkPosition } from "./classes/world/world.js";
import { REGISTRY } from "./classes/actors/ActorRegistry.js";
import { CANVAS } from "./classes/Canvas.js";
import { spawnEnemies } from "./classes/world/spawnEnemies.js";
import { npcWander } from "./classes/actors/npcWander.js";
//Initialization
const WORLD = new World(CANVAS);
export const RENDERER = new Renderer(CANVAS.context);
const PLAYER = new Necromancer({ x: CANVAS.centerX, y: CANVAS.centerY, context: CANVAS.context });
REGISTRY.add(PLAYER);
spawnEnemies(1);

function drawPlayers(players) {
  for (const p of players) {
    RENDERER.drawActors(p);
    p.statMenu?.draw(p);
    p.inventoryMenu?.draw(p.id);
    p.HUD?.drawHUD({
      hpMax: p.stats.hp.max,
      hpCurrent: p.stats.hp.current,
      mpMax: p.stats.mp.max,
      mpCurrent: p.stats.mp.current,
    });
  }
}
function drawNPCs(npcs) {
  for (const p of npcs) {
    RENDERER.drawActors(p);
  }
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
    RENDERER.drawScreen(WORLD.world[WORLD.renderedSpaceX][WORLD.renderedSpaceY]);
    checkPosition(REGISTRY.listActors()[0], WORLD);
    drawNPCs(REGISTRY.listActors().filter((a) => a.isNPC === true));
    drawPlayers(REGISTRY.listActors().filter((a) => a.isNPC === false));
    REGISTRY.listActors()
      .filter((a) => a.isNPC === true)
      .forEach((a) => npcWander(a));
  }
}

function keydown(e) {
  try {
    PLAYER.isIdle = false;
    PLAYER.currentAction = KEYMAP.keys[e.key];
  } catch (e) {
    console.log(e);
  }
}

function keyUp() {
  PLAYER.idle();
}

document.addEventListener("keydown", (e) => keydown(e));
document.addEventListener("keyup", keyUp);
window.onload = requestAnimationFrame(paint);
