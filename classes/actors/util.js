export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function getHit(hitbox, c) {
  // if we're within the X range of the hitbox
  let x = false;
  let y = false;
  if (c.x + 0 > hitbox.xMin && c.x < hitbox.xMax) {
    x = true;
  }
  if (c.x - 40 > hitbox.xMin && c.x < hitbox.xMax) {
    x = true;
  }
  if (c.x + 40 > hitbox.xMin && c.x < hitbox.xMax) {
    x = true;
  }
  if (c.y + 0 > hitbox.yMin && c.y < hitbox.yMax) {
    y = true;
  }
  if (c.y - 50 > hitbox.yMin && c.y < hitbox.yMax) {
    y = true;
  }
  if (c.y + 10 > hitbox.yMin && c.y < hitbox.yMax) {
    y = true;
  }
  return x && y;
}
