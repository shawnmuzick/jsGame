import { Skeleton } from "../player.js";
import { wander } from "../pets.js";
import {map} from '../../../app.js';

export function summonSkeleton(caller) {
	//pets should wander on idle
	let pet = new Skeleton({
		context: caller.context,
		x: caller.x,
		y: caller.y,
	});
	//pets should track their summoner
        pet.summoner = caller;
	caller.pets.push(pet);
	map.actors.push(pet);
        caller.stats.mp.current -= 2;
        pet.idle = () =>wander(pet);
	pet.stats = {
		hp: caller.stats.hp / 4,
		mp: caller.stats.mp / 4,
		vit: caller.stats.vit / 4,
		dex: caller.stats.dex / 4,
		str: caller.stats.str / 4,
		mag: caller.stats.mag / 4,
		exp: caller,
		lvl: caller.stats.lvl,
		pts: null,
	};
	delete pet.HUD;
}
