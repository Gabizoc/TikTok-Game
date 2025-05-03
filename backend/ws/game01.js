const { WebcastPushConnection } = require('tiktok-live-connector');
const { HttpsProxyAgent } = require('https-proxy-agent');
const fs = require('fs');

// Charge la liste de proxys
const proxies = JSON.parse(fs.readFileSync('proxy_list.json'));

let activeConnections = new Map();

module.exports = (ws, data) => {
    console.log('Chargé');

    ws.pseudo = data.pseudo || 'Anonyme';
    ws.blueGifts = data.blueGifts || [];
    ws.redGifts = data.redGifts || [];
    ws.tiktokUsername = data.tiktokUsername;

    if (!ws.tiktokUsername) {
        return ws.send(JSON.stringify({
            type: 'error',
            code: 'MISSING_USERNAME',
            message: 'Aucun pseudo TikTok fourni.'
        }));
    }

    console.log(`[GAME01] ${ws.tiktokUsername} a rejoint le jeu !`);
    console.log(ws.blueGifts, ws.redGifts);

    // Choisir un proxy aléatoire à chaque connexion
    const randomProxy = proxies[Math.floor(Math.random() * proxies.length)];
    const proxyUrl = `http://${randomProxy.ip}:${randomProxy.port}`;
    const proxyAgent = new HttpsProxyAgent(proxyUrl);   

    const connectionOptions = {
        processInitialData: true,
        requestOptions: {
            agent: proxyAgent
        }
    };

    if (activeConnections.has(ws.tiktokUsername)) {
        return /*ws.send(JSON.stringify({
            type: 'error',
            code: 'LIVE_ALREADY_WATCHED',
            message: 'Ce live TikTok est déjà surveillé.'
        }));*/
    }

    const connection = new WebcastPushConnection(ws.tiktokUsername, connectionOptions);
    activeConnections.set(ws.tiktokUsername, connection);

    connection.connect().then(() => {
        console.log(`📡 Connecté à TikTok (${ws.tiktokUsername}) via proxy`);

        connection.on('gift', (giftData) => {
            const giftId = giftData.giftId;
            const repeatCount = giftData.repeat_count || 1;
            const diamondCount = giftData.diamondCount || 0;

            const blueGiftsIds = ws.blueGifts.map(id => Number(id));
            const redGiftsIds = ws.redGifts.map(id => Number(id));

            const targetTeam = blueGiftsIds.includes(giftId)
                ? 'bleu'
                : redGiftsIds.includes(giftId)
                ? 'rouge'
                : null;

            if (targetTeam) {
                for (let i = 0; i < repeatCount; i++) {
                    const message = JSON.stringify({
                        type: 'points',
                        team: targetTeam,
                        points: diamondCount
                    });
                    ws.send(message);                    
                }
            }
        });

    }).catch(err => {
        console.error('❌ Erreur connexion TikTok:', err);
        ws.send(JSON.stringify({
            type: 'error',
            code: 'TIKTOK_CONNECTION_FAILED',
            message: 'Erreur lors de la connexion à TikTok.',
            details: err.message
        }));
        activeConnections.delete(ws.tiktokUsername);
    });

    ws.on('close', () => {
        const conn = activeConnections.get(ws.tiktokUsername);
        if (conn) conn.disconnect();
        activeConnections.delete(ws.tiktokUsername);
        console.log(`[GAME01] ${ws.tiktokUsername} a quitté le jeu !`);
    });
};
