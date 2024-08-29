import ms from 'ms';

export type Kline = [
	number, // open time
	string, // open price
	string, // high price
	string, // low price
	string, // close price
	string, // volume
	number, // close time
	string, // quote asset volume
	number, // number of trades
	string, // Taker buy base asset volume
	string, // Taker buy quote asset volume
	string, // Ignore.
];

export enum KI {
	OPEN_TIME = 0,
	OPEN_PRICE = 1,
	HIGH_PRICE = 2,
	LOW_PRICE = 3,
	CLOSE_PRICE = 4,
	VOLUME = 5,
	CLOSE_TIME = 6,
	QUOTE_ASSET_VOLUME = 7,
	NUMBER_OF_TRADES = 8,
	TAKER_BUY_BASE_ASSET_VOLUME = 9,
	TAKER_BUY_QUOTE_ASSET_VOLUME = 10,
}

export async function fetchPairKlines(
	pair: string,
	digit = 1,
	unit: 'M' | 'w' | 'd' | 'h' | 'm' = 'm',
	startTime?: number,
	endTime?: number,
): Promise<Kline[]> {
	let url = `https://www.binance.com/api/v3/klines?symbol=${pair}&interval=${digit}${unit}`;
	if (!startTime) {
		// 180 units by default
		startTime = Date.now() - ms(`180${unit}`);
	}
	url += `&startTime=${startTime}`;
	if (endTime) {
		url += `&endTime=${endTime}`;
	}
	const response = await fetch(url);
	return await response.json();
}
