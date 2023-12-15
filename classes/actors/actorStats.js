class PlayerStats {
  constructor() {
    this.hp = { max: 0, current: 0 };
    this.mp = { max: 0, current: 0 };
    this.vit = 0;
    this.dex = 0;
    this.str = 0;
    this.mag = 0;
    this.exp = 0;
    this.lvl = 1;
    // pts represents lvl up points to allocate
    this.pts = 0;
  }
}

class SkeletonStats extends PlayerStats {
  constructor() {
    super();
    this.hp = 8;
    this.vit = 8;
    this.dex = 7;
    this.str = 10;
    this.mag = 5;
    this.lvl = 1;
  }
}
class CadaverStats extends PlayerStats {
  constructor() {
    super();
    this.hp = 8;
    this.vit = 8;
    this.dex = 7;
    this.str = 10;
    this.mag = 5;
    this.lvl = 1;
  }
}
class NexromancerStats extends PlayerStats {
  constructor() {
    super();
    this.hp = { max: 10, current: 10 };
    this.mp = { max: 20, current: 20 };
    this.vit = 10;
    this.dex = 5;
    this.str = 5;
    this.mag = 10;
    this.exp = 0;
    this.lvl = 1;
    this.pts = 0;
  }
}
export { PlayerStats, SkeletonStats, CadaverStats, NexromancerStats };
