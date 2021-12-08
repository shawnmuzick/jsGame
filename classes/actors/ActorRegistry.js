export default class ActorRegistry {
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

  get(actorID) {
    //if no id provided, return an array of all actors
    if (!actorID) return Array.from(this.actors.values());
    return this.actors.get(actorID);
  }
}
