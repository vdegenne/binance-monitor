/**
 * Milliseconds to wait before the next fetch batch.
 */
export const FETCH_BATCH_PAUSE_MS = 5 * 1000;

/**
 * Number of fetches to perform in parallel
 */
export const FETCH_BATCH_IN_PARALLEL = 12;

/**
 * Time to wait before a new batch session
 */
export const FETCH_BATCH_PAUSE_BEFORE_RESTART_MS = 180 * 1000; // 3 minutes

export const KLINES_DEFAULT_DIGIT = 15;
export const KLINES_DEFAULT_UNIT = 'm';
/**
 * The number of candles to fetch
 */
export const KLINES_DEFAULT_WINDOW = 50;
