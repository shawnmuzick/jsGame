import { getRandomInt } from "./util.js";
import { swordMap } from "./actionMaps.js";
import { KEYMAP } from "./KeyMapper.js";

function handlePet(direction, caller) {
  //if out of summoner x range, don't let them wander further
  let xLimit = Math.abs(caller.summoner.x - caller.x) > caller.summoner.petRange;
  let yLimit = Math.abs(caller.summoner.y - caller.y) > caller.summoner.petRange;
  //if out of range, move towards in range
  if (xLimit) {
    if (caller.summoner.x > caller.x) direction = 3;
    else direction = 1;
  }
  if (yLimit) {
    if (caller.summoner.y > caller.y) direction = 2;
    else direction = 0;
  }
  return direction;
}

function isAttacking(caller) {
  const attacking = Array.from(swordMap.values()).includes(caller.frameY);
  const endOfAttack = caller.frameX >= 960;
  if (endOfAttack) {
    //idle to prevent update flicker
    caller.idle();
    return false;
  } else if (attacking) return true;
  else return false;
}

const changeDirection = () => getRandomInt(0, 2);
const getRandomDirection = () => getRandomInt(0, 5);

const action = new Map([
  [0, "ArrowUp"],
  [1, "ArrowLeft"],
  [2, "ArrowDown"],
  [3, "ArrowRight"],
  [4, " "],
]);

export function npcWander(caller) {
  //we we're attacking, keep doing that, don't wander further
  if (isAttacking(caller)) return;

  //roll to change what we're doing, if yes, get a new action, otherwise keep the current one
  let direction = changeDirection() ? getRandomDirection() : caller.frameY / caller.height;
  //>5 indicates idle, do so and return
  if (direction > 5) {
    caller.idle();
    return;
  }

  //if this npx is a pet, check distance from master
  if (caller.summoner) {
    direction = handlePet(direction, caller);
  }

  //get the action from the dictionary and execute it
  KEYMAP.keys[action.get(direction)](caller);
  return;
}
