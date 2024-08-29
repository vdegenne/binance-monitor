import {LitElement, html} from 'lit';
import {withStyles} from 'lit-with-styles';
import {customElement, state} from 'lit/decorators.js';
import {materialShellLoadingOff} from 'material-shell';
import {type MasterDataEntry} from '../server/data.js';
import '../socket.js';
import styles from './app-shell.css?inline';
import s2l from 'coinmarketcap-s2l';
import {openBinance} from '../utils.js';

@customElement('app-shell')
@withStyles(styles)
export class AppShell extends LitElement {
	@state() masterData: MasterDataEntry[] = [];

	firstUpdated() {
		materialShellLoadingOff.call(this);
	}

	render() {
		return html` <span class="font-bold bg-blue-200 text-orange-500">
			${this.masterData.map((asset) => {
				return html`<div
					style="padding: 12px"
					@click=${() => {
						/* window.open(s2l(asset.symbol), '_blank'); */
						openBinance(asset.symbol, asset.quote);
					}}
				>
					${asset.symbol}/${asset.quote}
					(${asset.rateOfChangePercent[asset.rateOfChangePercent.length - 1]})
				</div>`;
			})}
		</span>`;
	}
}

declare global {
	interface Window {
		app: AppShell;
	}
	interface HTMLElementTagNameMap {
		'app-shell': AppShell;
	}
}

export const app = (window.app = new AppShell());
