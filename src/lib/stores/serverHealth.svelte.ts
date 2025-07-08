import type { IServerHealth } from '../../types/ServerHealth';

export class ServerHealth {
	#serverHealth = $state() as IServerHealth | null;

	get data() {
		return this.#serverHealth;
	}
	set data(object) {
		this.#serverHealth = object;
	}
}

export const serverHealth = new ServerHealth();
