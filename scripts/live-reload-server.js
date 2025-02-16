import { WebSocketServer } from 'ws';

export class LiveReloadServer {
    constructor(port = 35729) {
        this.port = port;
        this.clients = new Set();
    }

    start() {
        this.wss = new WebSocketServer({ port: this.port });
        
        this.wss.on('connection', (ws) => {
            console.log('🔌 Live reload client connected');
            this.clients.add(ws);

            ws.on('close', () => {
                console.log('🔌 Live reload client disconnected');
                this.clients.delete(ws);
            });
        });

        console.log(`\n🔄 Live reload server running on ws://localhost:${this.port}\n`);
    }

    reload() {
        const message = JSON.stringify({ type: 'reload' });
        this.clients.forEach(client => {
            if (client.readyState === 1) { // OPEN
                client.send(message);
            }
        });
        console.log('🔄 Sent reload signal to all clients');
    }

    close() {
        if (this.wss) {
            this.wss.close();
            console.log('\n👋 Live reload server closed');
        }
    }
}
