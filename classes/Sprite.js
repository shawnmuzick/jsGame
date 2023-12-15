class Sprite {
  constructor({ img, frameX = 0, frameY = 10, width = 64, height = 64, x = 0, y = 0 }) {
    this.id = crypto.randomUUID();
    this.img = img;
    this.frameX = frameX;
    this.frameY = frameY * height;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
  }
  getSpriteSheet(name) {
    const sprites = {
      skeleton: "./sprites/skeleton.png",
      necromancer: "./sprites/necromancer.png",
      grassTiles: "./LPC_forest/forest_tiles.png",
      stoneFloor: "./tiles/Stone_Floor.png",
    };
    const sprite = new Image();
    sprite.src = sprites[name];
    return sprite;
  }
  draw() {
    //child classes must implement
  }
}
export { Sprite };
