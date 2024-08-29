import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {withStyles} from 'lit-with-styles';
import styles from './login-interface.css?inline';
import {SVG_LOGO, SVG_GOOGLE_G} from '../assets/assets.js';
import {materialShellLoadingOff} from 'material-shell';
import {login} from '../firebase/LoginOrLogout.js';

declare global {
	interface HTMLElementTagNameMap {
		'login-interface': LoginInterface;
	}
	interface Window {
		loginInterface: LoginInterface;
	}
}

@customElement('login-interface')
@withStyles(styles)
export class LoginInterface extends LitElement {
	render() {
		return html`
			<div
				id="container"
				class="absolute inset-0 flex items-center justify-center"
			>
				<md-elevated-card class="p-5">
					<header class="text-center m-5">
						<md-icon style="--md-icon-size:64px">${SVG_LOGO}</md-icon>
					</header>
					<div id="content" class="">
						<md-filled-tonal-button @click=${this.#login}>
							<md-icon slot="icon">${SVG_GOOGLE_G}</md-icon>
							Sign in to continue
						</md-filled-tonal-button>
					</div>
				</md-elevated-card>
			</div>
		`;
	}

	firstUpdated() {
		materialShellLoadingOff.call(this);

		// Preloading the main app for fast loading when user connects
		// TODO: Should probably load on real intention to connect
		// import('../app-shell/app-shell.js');
	}

	async #login() {
		try {
			login();
			this.remove();
		} catch {}
	}
}

export const loginInterface = (window.loginInterface = new LoginInterface());
