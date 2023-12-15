import { summonSkeleton } from "./spells.js";
import { idleMap } from "./actionMaps.js";
import { CadaverStats, NexromancerStats, PlayerStats, SkeletonStats } from "./actorStats.js";
import { ActorRegistry } from "./ActorRegistry.js";
import { PlayerInventory } from "./actorInventory.js";
import { Sprite } from "../Sprite.js";
import { StatMenu, InventoryMenu } from "../UI/Menu.js";
import { HUD } from "../UI/HUD.js";

export class Player extends Sprite {
  constructor(obj) {
    super(obj);
    this.statMenu = new StatMenu();
    this.inventoryMenu = new InventoryMenu();
    this.following = new ActorRegistry();
    this.inventory = new PlayerInventory();
    this.stats = new PlayerStats();
    this.HUD = new HUD({ x: this.x, y: this.y });
    this.spell = summonSkeleton;
    this.isIdle = true;
    this.isLiving = true;
    this.isNPC = false;
    this.worldPosition = [0, 0];
    this.scaleWidth = this.width * 1.5;
    this.scaleHeight = this.height * 1.5;
    this.speed = 5;
  }

  update(start = 0, end = 8, offset = 1) {
    if (this.frameX >= this.width * end * offset) {
      this.frameX = start;
    } else {
      this.frameX += this.width * offset;
    }
  }

  idle() {
    this.frameY = idleMap.get(this.frameY / this.height);
    this.frameX = 0;
    this.isIdle = true;
  }

  lvlUp() {
    this.stats.pts += 5;
  }
  getHitBox() {
    return {
      xMin: this.x,
      xMax: this.x + this.width,
      yMin: this.y,
      yMax: this.y + this.height,
    };
  }
}

export class Skeleton extends Player {
  constructor(obj) {
    super(obj);
    this.img = this.getSpriteSheet("skeleton");
    this.speed = 3;
    this.spell = () => {};
    this.stats = new SkeletonStats();
  }
}

export class Cadaver extends Player {
  constructor(obj) {
    super(obj);
    this.img = this.getSpriteSheet("skeleton");
    this.speed = 3;
    this.spell = () => {};
    this.stats = new CadaverStats();
    this.isNPC = true;
    this.filter = "invert(100%)";
  }
}

export class Necromancer extends Player {
  constructor(obj) {
    super(obj);
    this.img = this.getSpriteSheet("necromancer");
    this.pets = [];
    this.stats = new NexromancerStats();
    this.petRange = 100;
  }
}
