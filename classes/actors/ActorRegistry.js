export class ActorRegistry {
  constructor() {
    this.actors = new Map();
  }

  add(actor) {
    if (!this.has(actor.actorid)) this.actors.set(actor.id, actor);
  }

  remove(actorID) {
    if (this.has(actorID)) this.actors.delete(actorID);
  }

  has(actorID) {
    return this.actors.has(actorID);
  }

  getByID(actorID) {
    return this.actors.get(actorID);
  }
  listActors() {
    //if no id provided, return an array of all actors
    return Array.from(this.actors.values());
  }
}

export let REGISTRY = new ActorRegistry();
