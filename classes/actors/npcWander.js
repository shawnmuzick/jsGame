import { getRandomInt } from "./util.js";
import { swordMap } from "./actionMaps.js";
import { KEYMAP } from "./KeyMapper.js";
import { REGISTRY } from "./ActorRegistry.js";

const directions = [0, 1, 2, 3];
const DEBUG_LINE_OF_SIGHT = false;

const action = new Map([
  [0, "ArrowUp"],
  [1, "ArrowLeft"],
  [2, "ArrowDown"],
  [3, "ArrowRight"],
  [4, " "],
]);

const CheckAttackFrame = (caller) => Array.from(swordMap.values()).includes(caller.frameY);
const CheckAttackEnding = (caller) => caller.frameX >= 960;

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

//add the current direction into the array of possible options
//increase the odds of continuing the same direction
//make npc choices more nature/predicable
function getRandomDirection(bias) {
  let arr = directions.map((a) => a);
  arr.push(bias);
  arr.push(bias);
  return arr[getRandomInt(0, arr.length)];
}

export function npcWander(caller) {
  //if we're finishing an attack
  if (CheckAttackEnding(caller)) {
    //idle to prevent update flicker
    caller.idle();
  }
  //else we were attacking, but not finished, keep doing that, don't wander further
  else if (CheckAttackFrame(caller)) {
    return;
  }

  //roll to change what we're doing, if yes, get a new action, otherwise keep the current one
  let direction = getRandomInt(0, 2)
    ? getRandomDirection(caller.direction)
    : caller.frameY / caller.height;

  //>5 indicates idle, do so and return
  if (direction > 5) {
    caller.idle();
    return;
  }

  //check if we can see another actor, if yes, attack
  REGISTRY.listActors()
    //check each actor that is not an npc or a pet
    .filter((actor) => (!actor.isNPC || actor.summoner) && actor !== caller)
    .forEach((actor) => {
      //if caller is a pet of actor summoner, don't attack
      if (actor.summoner == caller) {
        console.log(actor, caller.summoner);
        return;
      }
      //if they're in x axis line of sight, attack
      if (caller.CheckLineOfSight(actor) && caller.summoner !== actor) {
        direction = 4;
      }
    });

  //if this npc is a pet, check distance from master
  if (caller.summoner) {
    direction = handlePet(direction, caller);
  }

  //get the action from the dictionary and execute it
  KEYMAP.keys[action.get(direction)](caller);
  return;
}
