const handlers = {
  game01: require('./game01'),
};

module.exports = function setupWSHandlers(wss) {
  wss.on('connection', (ws) => {
    console.log('🟢 Client connecté');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type && handlers[data.type]) {
                handlers[data.type](ws, data);
            } else {
                console.warn('⚠️ Type handler inconnu ou non défini');
            }
        } catch (err) {
            console.error('❌ Erreur parsing message WS:', err.message);
        }
    });    
  });
};