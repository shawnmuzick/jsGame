import { Sprite } from "../Sprite.js";

export class HUD extends Sprite {
  constructor({ x, y }) {
    super({});
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
  drawConsole(context) {
    context.drawImage(this.img, 0, 0, this.x, 300, 0, this.y - 75, this.x, 300);
  }
  drawOrb(context, statMax, statCurrent, x, y, color, alpha) {
    context.globalAlpha = alpha;
    context.beginPath();
    context.arc(
      x,
      y,
      this.radius,
      (1.5 + (1 - statCurrent / statMax)) * Math.PI,
      (3.5 - (1 - statCurrent / statMax)) * Math.PI
    );
    context.fillStyle = color;
    context.fill();
  }
}
