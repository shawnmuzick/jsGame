import { walkMap, swordMap, spellMap, idleMap } from "./actionMaps.js";
export const keymap = {
  ArrowUp: (actor) => {
    actor.frameY = walkMap.get("up");
    actor.y -= actor.speed;
  },
  ArrowDown: (actor) => {
    actor.frameY = walkMap.get("down");
    actor.y += actor.speed;
  },
  ArrowLeft: (actor) => {
    actor.frameY = walkMap.get("left");
    actor.x -= actor.speed;
  },
  ArrowRight: (actor) => {
    actor.frameY = walkMap.get("right");
    actor.x += actor.speed;
  },
  " ": (actor) => {
    if (walkMap.has(actor.frameY)) {
      actor.frameY = swordMap.get(actor.frameY);
      actor.pets?.forEach((p) => {
        p.frameY = swordMap.get(p.frameY);
      });
    }
  },
  s: (actor) => {
    // if not enough mana, return
    if (actor.stats.mp.current <= 0) return;
    if (walkMap.has(actor.frameY)) actor.frameY = spellMap.get(actor.frameY);
    actor.spell(actor);
  },
  t: (actor) => {
    // check if they're a player, not a pet
    if (actor.HUD) {
      menu.open = !menu.open;
      //prevent walking animation while opening menu
      actor.idle();
    }
  },
  i: (actor) => {
    if (player.HUD) {
      invMenu.open = !invMenu.open;
      actor.idle();
    }
  },
};
export default class KeyMapper {
  constructor(obj) {
    this.keys = obj || keymap;
  }

  remap(action, key) {
    this.keys[key] = action;
  }
}
