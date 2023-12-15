import { ActorRegistry } from "./ActorRegistry.js";

export class PlayerInventory extends ActorRegistry {
  constructor() {
    super();
    this.inventory = this.registry;
  }
  addItem() {
    super.addActor();
  }
  dropItem() {
    super.removeActor();
  }
}
