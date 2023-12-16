import { Sprite } from "../Sprite.js";

export class HUD extends Sprite {
  constructor({ x, y, context }) {
    super({});
    this.context = context;
    this.img = this.getSpriteSheet("stoneFloor");
    this.x = x * 2; // original canvas width
    this.y = y * 2; //original canvas height
    this.radius = 50;
    this.orbs = [
      {
        x: this.x - this.radius,
        y: this.y - this.radius,
        color: "white",
        alpha: 0.5,
      },
      {
        x: this.x - this.radius,
        y: this.y - this.radius,
        color: "blue",
        alpha: 1,
      },
      { x: 0 + this.radius, y: this.y - this.radius, color: "white", alpha: 0.5 },
      { x: 0 + this.radius, y: this.y - this.radius, color: "red", alpha: 1 },
    ];
  }
  drawConsole() {
    this.context.drawImage(this.img, 0, 0, this.x, 300, 0, this.y - 75, this.x, 300);
  }
  drawOrb(statMax, statCurrent, x, y, color, alpha) {
    this.context.globalAlpha = alpha;
    this.context.beginPath();
    this.context.arc(
      x,
      y,
      this.radius,
      (1.5 + (1 - statCurrent / statMax)) * Math.PI,
      (3.5 - (1 - statCurrent / statMax)) * Math.PI
    );
    this.context.fillStyle = color;
    this.context.fill();
  }
  drawHUD(params) {
    const { hpMax, hpCurrent, mpMax, mpCurrent } = params;
    // draw the dash area
    this.drawConsole(this.context);
    const arr = [
      [mpMax, mpMax],
      [mpMax, mpCurrent],
      [hpMax, hpMax],
      [hpMax, hpCurrent],
    ];
    // loop through the orbs and drawn them out
    for (let i = 0; i < this.orbs.length; i++) {
      this.drawOrb(
        arr[i][0],
        arr[i][1],
        this.orbs[i].x,
        this.orbs[i].y,
        this.orbs[i].color,
        this.orbs[i].alpha
      );
    }
  }
}
