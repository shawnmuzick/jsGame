import { walkMap, swordMap, spellMap, idleMap } from "./actors/actionMaps.js";
import { getHit } from "./actors/util.js";
import { REGISTRY } from "./actors/ActorRegistry.js";

function processHit(obj, bx) {
  // animation frames
  const animationFrames = [192, 384, 576, 768, 960];
  const cooridnate = animationFrames.indexOf(obj.frameX);
  // facing up, depending on position and frameX
  const upFrames = [
    { x: obj.x - obj.width * 1.0, y: obj.y + 0.5 * obj.height }, //left
    { x: obj.x - obj.width * 0.5, y: obj.y - 0.5 * obj.height }, //upper left
    { x: obj.x + obj.width * 0.5, y: obj.y - 1.0 * obj.height }, //mid
    { x: obj.x + obj.width * 1.5, y: obj.y - 0.5 * obj.height }, //upper right
    { x: obj.x + obj.width * 2.0, y: obj.y + 0.5 * obj.height }, // right
  ];
  const downFrames = [
    { x: obj.x - obj.width * 1.0, y: obj.y + 0.5 * obj.height }, //left
    { x: obj.x - obj.width * 0.5, y: obj.y + 1.5 * obj.height }, //lower left
    { x: obj.x + obj.width * 0.5, y: obj.y + 2.0 * obj.height }, //mid
    { x: obj.x + obj.width * 1.5, y: obj.y + 1.5 * obj.height }, //lower right
    { x: obj.x + obj.width * 2.0, y: obj.y + 0.5 * obj.height }, // right
  ];
  const leftFrames = [
    { x: obj.x - obj.width * 0.25, y: obj.y + 0.5 * obj.height },
    { x: obj.x - obj.width * 0.5, y: obj.y + 0.5 * obj.height },
    { x: obj.x - obj.width * 0.75, y: obj.y + 0.5 * obj.height },
    { x: obj.x - obj.width * 1.0, y: obj.y + 0.5 * obj.height },
    { x: obj.x - obj.width * 1.25, y: obj.y + 0.5 * obj.height },
  ];
  const rightFrames = [
    { x: obj.x + obj.width * 1.0, y: obj.y + 0.5 * obj.height },
    { x: obj.x + obj.width * 0.25, y: obj.y + 0.5 * obj.height },
    { x: obj.x + obj.width * 0.5, y: obj.y + 0.5 * obj.height },
    { x: obj.x + obj.width * 0.75, y: obj.y + 0.5 * obj.height },
    { x: obj.x + obj.width * 1.0, y: obj.y + 0.5 * obj.height },
    { x: obj.x + obj.width * 1.25, y: obj.y + 0.5 * obj.height },
  ];
  //if the current attack frame was within the hitbox, register the hit
  let hit = null;
  console.log(obj.frameY);

  if (obj.frameY === 21 * obj.width && cooridnate !== -1) {
    hit = getHit(bx, upFrames[cooridnate]); //if facing up
  }
  if (obj.frameY === 24 * obj.width && cooridnate !== -1) {
    hit = getHit(bx, leftFrames[cooridnate]); //if facing up
  }
  if (obj.frameY === 27 * obj.width && cooridnate !== -1) {
    hit = getHit(bx, downFrames[cooridnate]); //if facing up
  }
  if (obj.frameY === 30 * obj.width && cooridnate !== -1) {
    hit = getHit(bx, rightFrames[cooridnate]); //if facing up
  }
  console.log(hit);
  return hit;
}

export function checkHit(actor, obj) {
  console.log(actor, obj);
  //both actors are NPC's, don't process the hit, shouldn't be friendly fire
  if (actor.isNPC == true && obj.isNPC == true) {
    console.log("both npcs");
    return;
  }
  //if the actor is not the summoner of the caller of DrawPlayer, skip, because pets shouldn't kill summoner
  if (!(actor === obj) && !obj.following.has(actor.id)) {
    const hit = obj.CheckLineOfAttack(actor);
    //if the hit registered, kill the actor
    actor.isLiving = !hit;
    //if actor is dead, remove them from the list of actors
    if (!actor.isLiving) {
      REGISTRY.remove(actor.id);
    }
  }
}
export class Renderer {
  constructor(context) {
    this.context = context;
  }

  drawActors(obj) {
    let offset = 1;
    const updateParams = [0];
    let scaleX = 0;
    let scaleY = 0;
    // if we have a sword and are attacking
    if (Array.from(swordMap.values()).includes(obj.frameY)) {
      scaleX = obj.scaleWidth;
      scaleY = obj.scaleHeight;
      offset = 3;
      updateParams.push(5);
      // clean frameX from a previous action sequence
      if (obj.frameX % 3 !== 0) obj.frameX = 0;
      // if we're idle
    } else if (obj.isIdle === true) {
      updateParams.push(0);
      // if we have spells and are casting
    } else if (Array.from(spellMap.values()).includes(obj.frameY)) {
      updateParams.push(6);
      // otherwise general update
    } else {
      updateParams.push(8);
    }
    if (obj.filter) {
      this.context.filter = "invert(100%)";
    }
    if (obj.currentAction) {
      obj.currentAction(obj);
    }
    obj.update(...updateParams, offset);
    this.context.drawImage(
      obj.img,
      obj.frameX,
      obj.frameY,
      obj.width * offset,
      obj.height * offset,
      obj.x - obj.width - scaleX,
      obj.y - obj.width - scaleY,
      obj.scaleWidth * offset,
      obj.scaleHeight * offset
    );
    if (obj.filter) this.context.filter = "invert(0%)";
  }

  drawScreen(obj) {
    //render out the world tiles
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        this.context.drawImage(
          obj.img,
          obj.grid[i][j].x * obj.width,
          obj.grid[i][j].y * obj.width,
          obj.width,
          obj.height,
          obj.scaleWidth * i,
          obj.scaleHeight * j,
          //fixes breaks/seams
          obj.scaleWidth + 2,
          obj.scaleHeight + 2
        );
        //if drew plain grass in the step above
        if (obj.grid[i][j].geofeat !== false) {
          //add geographic feature on top of it
          this.context.drawImage(
            obj.img,
            obj.grid[i][j].geoFeat.x * obj.width,
            obj.grid[i][j].geoFeat.y * obj.width,
            obj.width,
            obj.height,
            obj.scaleWidth * i,
            obj.scaleHeight * j,
            //fixes breaks/seams
            obj.scaleWidth + 2,
            obj.scaleHeight + 2
          );
        }
      }
    }
  }
}
