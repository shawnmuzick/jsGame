import { Sprite } from "../Sprite.js";
import { CANVAS } from "../Canvas.js";
import { REGISTRY } from "../actors/ActorRegistry.js";
import { walkMap } from "../actors/actionMaps.js";

export class Menu extends Sprite {
  constructor(x, y, context, width, height) {
    super({});
    this.img = this.getSpriteSheet("stoneFloor");
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.context = context;
    this.open = false;
  }
}

export class InventoryMenu extends Menu {
  constructor() {
    super(CANVAS.centerX, CANVAS.centerY, CANVAS.context, 400, 400);
  }

  draw(actorID) {
    //no menu system, is an NPC
    if (this === undefined) return;
    if (!this.open) return;
    const player = REGISTRY.getByID(actorID);
    const startX = this.x - this.width / 2;
    let startY = this.y - this.height / 2;
    startY += this.height - 100;
    // window
    this.context.drawImage(
      this.img,
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    // player space
    this.context.strokeStyle = "white";
    this.context.beginPath();
    this.context.rect(
      this.x - player.scaleWidth / 2,
      this.y - player.scaleHeight / 2 - 50,
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
      this.x - player.scaleWidth / 2,
      this.y - player.scaleHeight / 2 - 55,
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

export class StatMenu extends Menu {
  constructor() {
    super(CANVAS.centerX, CANVAS.centerY, CANVAS.context, 400, 400);
  }

  draw(actor) {
    // only draw if window is open
    if (!this.open) return;
    // draw the stat window
    this.context.drawImage(
      this.img,
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    // loop through stats and print them out
    let i = 40;
    this.context.font = "20px serif";
    this.context.fillStyle = "yellow";
    let string = "";
    for (const stat in actor) {
      if (stat === "hp") {
        string = `${stat}: ${actor[stat].current}/${actor[stat].max}`;
      } else if (stat === "mp") {
        string = `${stat}: ${actor[stat].current}/${actor[stat].max}`;
      } else {
        string = `${stat}: ${actor[stat]}`;
      }
      this.context.fillText(string, this.x - this.width / 2 + 20, this.y - this.height / 2 + i);
      i += 30;
    }
  }
}
