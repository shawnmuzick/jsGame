import { REGISTRY } from "../actors/ActorRegistry.js";
import { CANVAS } from "../Canvas.js";
import { Cadaver } from "../actors/player.js";
export function spawnEnemies(num = 1) {
  for (let i = 0; i < num; i++) {
    let enemy = new Cadaver({
      x: CANVAS.centerX - 50,
      y: CANVAS.centerY - 50,
      context: CANVAS.context,
    });
    REGISTRY.add(enemy);
  }
}
