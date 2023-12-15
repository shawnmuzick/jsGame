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
  return hit;
}

function iterateActors(actors, obj) {
  for (let i = 0; i < actors.length; i++) {
    //if actor is not the caller of DrawPlayer, skip, because the player can't hit themselves
    //and if the actor is not the summoner of the caller of DrawPlayer, skip, because pets shouldn't kill summoner
    if (!(actors[i] === obj) && !(obj.summoner === actors[i])) {
      //get the actor's hitbox
      const bx = actors[i].getHitBox();
      const hit = processHit(obj, bx);
      //if the hit registered, kill the actor
      actors[i].isLiving = !hit;
      //if actor is dead, remove them from the list of actors
      if (!actors[i].isLiving) {
        console.log("HIT!!!", actors[i].id);
        REGISTRY.remove(actors[i].id);
      }
    }
  }
}
export class Renderer {
  constructor(context) {
    this.context = context;
  }

  drawActors(obj, filter) {
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
      // only hit check on players for now
      if (obj.HUD) {
        //iterate over the actors
        iterateActors(REGISTRY.listActors(), obj);
      }
      // if we're idle
    } else if (obj.isIdle) {
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
    obj.update(...updateParams, offset);
  }

  drawHUD(obj, params) {
    //no hud, is an NPC
    if (obj === undefined) return;
    const { hpMax, hpCurrent, mpMax, mpCurrent } = params;
    // draw the dash area
    obj.drawConsole(this.context);
    const arr = [
      [mpMax, mpMax],
      [mpMax, mpCurrent],
      [hpMax, hpMax],
      [hpMax, hpCurrent],
    ];
    // loop through the orbs and drawn them out
    for (let i = 0; i < obj.orbs.length; i++) {
      obj.drawOrb(
        this.context,
        arr[i][0],
        arr[i][1],
        obj.orbs[i].x,
        obj.orbs[i].y,
        obj.orbs[i].color,
        obj.orbs[i].alpha
      );
    }
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

  drawInventoryMenu(obj, actorID) {
    //no menu system, is an NPC
    if (obj === undefined) return;
    if (!obj.open) return;
    const player = REGISTRY.getByID(actorID);
    const startX = obj.x - obj.width / 2;
    let startY = obj.y - obj.height / 2;
    startY += obj.height - 100;
    // window
    this.context.drawImage(
      obj.img,
      obj.x - obj.width / 2,
      obj.y - obj.height / 2,
      obj.width,
      obj.height
    );
    // player space
    this.context.strokeStyle = "white";
    this.context.beginPath();
    this.context.rect(
      obj.x - player.scaleWidth / 2,
      obj.y - player.scaleHeight / 2 - 50,
      player.scaleWidth,
      player.scaleHeight
    );
    this.context.stroke();
    // draw player image,
    this.context.drawImage(
      player.img,
      0,
      walkMap.get("down"),
      player.width,
      player.height,
      obj.x - player.scaleWidth / 2,
      obj.y - player.scaleHeight / 2 - 55,
      player.scaleWidth,
      player.scaleHeight
    );

    // draw the grid at the bottom
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 2; j++) {
        // outer square
        this.context.strokeStyle = "white";
        this.context.beginPath();
        this.context.rect(startX + i * 50, startY + j * 50, 50, 50);
        this.context.stroke();
      }
    }
  }
}
