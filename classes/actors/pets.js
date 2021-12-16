import { getRandomInt } from "./util.js";
import { swordMap, idleMap } from "./actionMaps.js";
import { KEYMAP } from "./KeyMapper.js";
import { RENDERER } from "../../app.js";
export function wander(caller) {
  //if out of summoner x range, don't let them wander further
  let xLimit = Math.abs(caller.summoner.x - caller.x) > caller.summoner.petRange;
  let yLimit = Math.abs(caller.summoner.y - caller.y) > caller.summoner.petRange;

  let direction = caller.frameY / caller.height;
  // if we hit either of the limits
  if (xLimit || yLimit) {
    let tmp = getRandomInt(8, 12);
    //reroll until we get a new one, preferably opposite direction
    while (tmp === direction && Math.abs(tmp - direction) >= 2) {
      tmp = getRandomInt(8, 12);
    }
    direction = tmp;
  }
  // if we were attacking when this gets called
  if (Array.from(swordMap.values()).includes(caller.frameY)) {
    caller.frameY = idleMap.get(caller.frameY / caller.height);
    caller.frameX = 0;
  } else {
    caller.frameY = direction * caller.height;
  }
  switch (direction) {
    // in order: up, left, down, right
    case 8:
      caller.y -= caller.speed;
      break;
    case 9:
      caller.x -= caller.speed;
      break;
    case 10:
      caller.y += caller.speed;
      break;
    case 11:
      caller.x += caller.speed;
      break;
    default:
      caller.y -= caller.speed;
  }
  return;
}
export function npcWander(caller) {
  //get current direction
  let direction = caller.frameY / caller.height;
  //roll to change
  let change = getRandomInt(0, 2);
  //if yes, roll new direction
  if (change) direction = getRandomInt(0, 5);

  // if we were attacking when this gets called
  if (Array.from(swordMap.values()).includes(caller.frameY)) {
    //if we've completed an attack cycle
    if (caller.frameX >= 960) {
      caller.idle();
      return;
    }
    return;
  }
  switch (direction) {
    // in order: up, left, down, right,stay
    case 0:
      KEYMAP.keys["ArrowUp"](caller);
      break;
    case 1:
      KEYMAP.keys["ArrowLeft"](caller);
      break;
    case 2:
      KEYMAP.keys["ArrowDown"](caller);
      break;
    case 3:
      KEYMAP.keys["ArrowRight"](caller);
      break;
    case 4:
      KEYMAP.keys[" "](caller);
      break;
    default:
      caller.idle();
      break;
  }
  return;
}
