export async function getThemeStore() {
	const {themeStore} = await import('./styles/styles.js');
	return themeStore;
}
