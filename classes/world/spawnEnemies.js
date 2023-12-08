import { REGISTRY } from "../actors/ActorRegistry.js";
import { CANVAS } from "../Canvas.js";
import { Cadaver } from "../actors/player.js";
import { getRandomInt } from "../actors/util.js";
export function spawnEnemies(num = 1) {
  for (let i = 0; i < num; i++) {
    const x = getRandomInt(50, CANVAS.width - 50);
    const y = getRandomInt(50, CANVAS.height - 50);
    const enemy = new Cadaver({
      x: x,
      y: y,
      context: CANVAS.context,
    });
    REGISTRY.add(enemy);
  }
}
