import Koa from 'koa';
import serve from 'koa-static';
import WebSocket, {WebSocketServer} from 'ws';
import path from 'path';
import './data.js';
import {type MasterDataEntry, type MasterData} from './data.js';

import {fileURLToPath} from 'url';
import {dirname} from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = new Koa();

// Serve static files from the 'dist' directory
app.use(serve(path.join(__dirname, 'dist')));

// Create the HTTP server for Koa to listen on
const server = app.listen(3000, () => {
	console.log('Server is running on http://localhost:3014');
});

// WebSocket server
const wss = new WebSocketServer({server});

// Connected clients
const clients: Set<WebSocket> = new Set();

// When a client connects
wss.on('connection', (ws: WebSocket) => {
	clients.add(ws);
	console.log('New client connected');

	// Remove the client from the set on disconnect
	ws.on('close', () => {
		clients.delete(ws);
		console.log('Client disconnected');
	});
});

const cleanEntry = (entry: MasterDataEntry) =>
	(({fetchLink, klines, MA25, ...o}) => ({...o}))(entry);

// Function to broadcast data to all connected clients
export function broadcastData(data: any) {
	for (const key in data) {
		data[key] = cleanEntry(data[key]);
	}

	const jsonData = JSON.stringify(Object.values(data));
	clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(jsonData);
		}
	});
}
