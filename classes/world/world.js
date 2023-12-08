import { Sprite } from "../actors/player.js";
const img = new Image();
img.src = "./LPC_forest/forest_tiles.png";

const worldSize = 9 * 100;

function getRandomTile(maxX, maxY, minX = 0, minY = 0) {
  const x = Math.floor(Math.random() * (maxX - minX) + minX);
  const y = Math.floor(Math.random() * (maxY - minY) + minY);
  let geoFeat = false;
  //if we got the empty grass tile, mark for a geographic feature
  if (!x && !y) geoFeat = true;
  if (geoFeat) {
    //it can never return true in the 3rd parameter
    const obj = getRandomTile(7, 3, 0, 3);
    //this particular source tile is broken, so just skip over it
    if (obj.x === 5) obj.x++;
    geoFeat = {
      x: obj.x,
      y: obj.y,
    };
  }
  return { x, y, geoFeat };
}

/**Represents 1 viewable screen */
export class Screen extends Sprite {
  constructor({ cWidth, cHeight }) {
    const obj = { width: 32, height: 32, img: img };
    super(obj);
    this.scaleWidth = cWidth;
    this.scaleHeight = cHeight;
    this.grid = [[], [], [], [], [], [], [], [], []];
    //fill the visible world with random grass tiles
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        this.grid[i][j] = getRandomTile(5, 3);
      }
    }
  }
}

/**Represents the collection of all Viewable Screens */
export class World {
  constructor(CANVAS) {
    this.world = [];
    this.populate({ cWidth: CANVAS.width / 8, cHeight: CANVAS.height / 8 });
    this.renderedSpaceX = 0;
    this.renderedSpaceY = 0;
    this.actors = [];
  }
  //create a 9x9 world of screens
  populate(obj) {
    for (let i = 0; i < 9; i++) {
      const arr = [];
      for (let j = 0; j < 9; j++) {
        arr.push(new Screen(obj));
      }
      this.world.push(arr);
    }
    console.log(this.world);
  }
}

export function checkPosition(player, world) {
  //check if the player has gone over one of the edges
  //if so, reset that cooridnate and move a space on the world grid
  const { x, y, width } = player;
  // leftmost
  if (x + width < 0 && world.renderedSpaceX > 0) {
    // move right
    world.renderedSpaceX--;
    player.x = worldSize - player.width;
    player.pets?.forEach((p) => (p.x = worldSize - p.width));
    // rightmost
  } else if (x > worldSize && world.renderedSpaceX < 8) {
    world.renderedSpaceX++;
    player.x = 0;
    player.pets?.forEach((p) => (p.x = 0));
    // upmost
  } else if (y + width < 0 && world.renderedSpaceY > 0) {
    world.renderedSpaceY--;
    player.y = worldSize - player.width;
    player.pets?.forEach((p) => (p.y = worldSize - p.width));
    // downmost
  } else if (y > worldSize && world.renderedSpaceY < 8) {
    world.renderedSpaceY++;
    player.y = 0;
    player.pets?.forEach((p) => (p.y = 0));
  }
}
