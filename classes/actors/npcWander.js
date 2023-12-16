import { getRandomInt } from "./util.js";
import { swordMap } from "./actionMaps.js";
import { KEYMAP } from "./KeyMapper.js";
import { REGISTRY } from "./ActorRegistry.js";

const directions = [0, 1, 2, 3];

const action = new Map([
  [0, "ArrowUp"],
  [1, "ArrowLeft"],
  [2, "ArrowDown"],
  [3, "ArrowRight"],
  [4, " "],
]);

function CheckAttackFrame(caller) {
  return Array.from(swordMap.values()).includes(caller.frameY);
}
function CheckAttackEnding(caller) {
  return caller.frameX >= 960;
}

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

//increase the odds of continuing the same direction
//make npc choices more nature/predicable
function getRandomDirection(caller) {
  //roll for whether or not we change directions
  let processNewDirection = getRandomInt(0, 2);

  //if not, return our current direction
  if (processNewDirection == 0) {
    //minus the Y sprite columns we're not using here
    return caller.frameY / caller.height - 8;
  }
  //otherwise, roll for a new one
  let arr = directions.map((a) => a);
  let direction = arr[getRandomInt(0, arr.length)];
  return (direction = getRandomInt(0, 5) === 1 ? direction : caller.direction);
}

export function npcWander(caller) {
  let direction = caller.direction;

  //if we're finishing an attack
  if (CheckAttackEnding(caller)) {
    //idle to prevent update flicker
    caller.idle();
    return;
  }
  //else we were attacking, but not finished, keep doing that, don't wander further
  else if (CheckAttackFrame(caller)) {
    return;
  }

  //list each actor that is not an NPC
  const actors = REGISTRY.listActors().filter((a) => (!a.isNPC || a.summoner) && a !== caller);

  //check if we can see another actor, if yes, attack
  for (let actor of actors) {
    //if they're in x axis line of sight, attack
    if (caller.CheckLineOfSight(actor) && !caller.following.has(actor.id)) {
      direction = 4;
      //otherwise roll to change what we're doing, if yes, get a new action, otherwise keep the current one
    } else {
      direction = getRandomDirection(caller);

      //>5 indicates idle, do so and return
      if (direction > 5) {
        caller.idle();
        caller.isIdle = true;
        return;
      } else {
        caller.isIdle = false;
      }

      //if this npc is a pet, check distance from master
      if (caller.following.has(actor.id)) {
        direction = handlePet(direction, caller);
      }
    }
  }

  //get the action from the dictionary and execute it
  KEYMAP.keys[action.get(direction)](caller);

  caller.direction = direction;
  return;
}
