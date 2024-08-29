export type Pair = {
	b: string; // base
	q: string; // quote
	status: string;
};

class PairsManager {
	#availablePairs: Pair[] = [];

	async fetchAvailablePairs() {
		const response = await fetch(`https://www.binance.com/api/v3/exchangeInfo`);
		const data = await response.json();
		this.#availablePairs = data.symbols.map((s: any) => ({
			b: s.baseAsset,
			q: s.quoteAsset,
			status: s.status,
		}));
		return this.#availablePairs;
	}

	getStatus(base: string, quote: string) {
		const pair = this.#availablePairs.find(
			(pair) => pair.b === base && pair.q === quote,
		);
		return pair.status;
	}

	getAllPairsOfQuote(quote: string) {
		return this.#availablePairs.filter((pair) => pair.q === quote);
	}
}

export const pairsManager = new PairsManager();
