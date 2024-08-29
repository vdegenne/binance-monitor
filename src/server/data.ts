import ms from 'ms';
import {type Pair, pairsManager} from '../PairsManager.js';
import {KI, type Kline, fetchPairKlines} from '../klines.js';
import {
	FETCH_BATCH_IN_PARALLEL,
	FETCH_BATCH_PAUSE_BEFORE_RESTART_MS,
	FETCH_BATCH_PAUSE_MS,
	KLINES_DEFAULT_DIGIT,
	KLINES_DEFAULT_UNIT,
	KLINES_DEFAULT_WINDOW,
} from './constants.js';
import {sleep} from '../utils.js';
import {broadcastData} from './server.js';

pairsManager.fetchAvailablePairs().then(async () => {
	startLoop();
});

let fetchRunning = true;
async function startLoop() {
	const usdtPairs = pairsManager.getAllPairsOfQuote('USDT');
	let startIndex = 0;
	let endIndex: number;
	while (fetchRunning) {
		endIndex = startIndex + FETCH_BATCH_IN_PARALLEL;
		const pairsToFetch = usdtPairs.slice(startIndex, endIndex);

		if (pairsToFetch.length === 0) {
			await sleep(FETCH_BATCH_PAUSE_BEFORE_RESTART_MS);
			startIndex = 0;
			continue;
		}

		const batch = pairsToFetch.map(async (pair: Pair) => {
			const startTime =
				Date.now() -
				ms(
					`${KLINES_DEFAULT_DIGIT * KLINES_DEFAULT_WINDOW}${KLINES_DEFAULT_UNIT}`,
				);
			const returnObject = {
				klines: await fetchPairKlines(
					`${pair.b}${pair.q}`,
					KLINES_DEFAULT_DIGIT,
					KLINES_DEFAULT_UNIT,
					startTime,
				),
				fetchLink: `https://www.binance.com/api/v3/klines?symbol=${pair.b}${pair.b}&interval=${KLINES_DEFAULT_DIGIT}${KLINES_DEFAULT_UNIT}&startTime=${startTime}`,
			};

			return returnObject;
		});

		const batchKlines = await Promise.all(batch);

		batchKlines.forEach(({klines, fetchLink}, i) => {
			if (klines.length === 0) {
				return;
			}
			processKlines(pairsToFetch[i], klines, fetchLink);
		});

		broadcastData(masterData);

		await sleep(FETCH_BATCH_PAUSE_MS);

		startIndex = endIndex;
	}
}

export type MasterDataEntry = {
	symbol: string;
	quote: string;
	klines: Kline[];
	fetchLink: string;
	MA25: number[];
	rateOfChange: number[];
	rateOfChangePercent: number[];
	acceleration: number[];
	accelerationPercent: number[];
};

export type MasterData = {[symbol: string]: MasterDataEntry};

const masterData: MasterData = {};

export function processKlines(pair: Pair, klines: Kline[], fetchLink: string) {
	const entry = {} as Partial<MasterDataEntry>;
	entry.symbol = pair.b;
	entry.quote = pair.q;
	entry.klines = klines;
	entry.fetchLink = fetchLink;

	/* MA25 */
	entry.MA25 = klines
		.map((_kline, i) => {
			if (i < 24) {
				return undefined;
			}

			const closePrices = klines
				.slice(i - 24, i + 1)
				.map((kline) => kline[KI.CLOSE_PRICE]);
			return closePrices.reduce((acc, curr) => acc + parseFloat(curr), 0) / 25;
		})
		.filter((value) => value);

	// Calculate the first derivative (rate of change)
	// entry.rateOfChange = entry.MA25.map((value, index, array) => {
	// 	if (index === 0 || array[index - 1] === undefined || value === undefined) {
	// 		return undefined;
	// 	}
	// 	return value - array[index - 1];
	// });
	entry.rateOfChangePercent = entry.MA25.map((value, index, array) => {
		if (index === 0 || array[index - 1] === undefined || value === undefined) {
			return undefined;
		}
		return ((value - array[index - 1]) / array[index - 1]) * 100; // Normalize to percentage
	});
	// entry.acceleration = entry.rateOfChange.map((value, index, array) => {
	// 	if (index === 0 || array[index - 1] === undefined || value === undefined) {
	// 		return undefined;
	// 	}
	// 	return value - array[index - 1];
	// });
	// entry.accelerationPercent = entry.rateOfChange.map((value, index, array) => {
	// 	if (index === 0 || array[index - 1] === undefined || value === undefined) {
	// 		return undefined;
	// 	}
	// 	return ((value - array[index - 1]) / Math.abs(array[index - 1])) * 100; // Normalize to percentage
	// });

	masterData[`${pair.b}${pair.q}`] = entry as MasterDataEntry;
}
