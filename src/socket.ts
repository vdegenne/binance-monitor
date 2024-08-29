import {ReactiveController, state} from '@snar/lit';
import {PropertyValues} from 'snar';
import {app} from './app-shell/app-shell.js';
import {pairsManager} from './PairsManager.js';
import {MasterDataEntry} from './server/data.js';

class SocketCtrl extends ReactiveController {
	@state() ws: WebSocket | undefined;

	constructor() {
		super();
		this.#connect();
	}

	updated(changed: PropertyValues<SocketCtrl>) {
		if (changed.has('ws') && this.ws !== undefined) {
			this.ws.addEventListener('message', (event) => {
				const data = JSON.parse(event.data) as MasterDataEntry[];
				data.sort(
					(a, b) =>
						b.rateOfChangePercent[b.rateOfChangePercent.length - 1] -
						a.rateOfChangePercent[a.rateOfChangePercent.length - 1],
				);
				app.masterData = data;
			});
		}
	}

	#connect() {
		this.ws = new WebSocket('ws://localhost:3000');
	}
}

export const socketCtrl = new SocketCtrl();
