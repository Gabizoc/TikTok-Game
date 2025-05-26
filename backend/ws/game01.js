const { TikTokLiveConnection, SignConfig } = require("tiktok-live-connector");
const fs = require("fs");
require("dotenv").config();
const db = require("../utils/connectDB");

let activeConnections = new Map();
let sessionId = null;

SignConfig.apiKey = process.env.TIKTOK_API_KEY;

module.exports = async (ws, data) => {
  ws.blueGifts = data.blueGifts || [];
  ws.redGifts = data.redGifts || [];
  // const tiktok_username = "markk_officiel";
  const user_id = req.user.id;

  let tiktok_username;

  try {
    const [rows] = await db.query(
      'SELECT tiktok_username FROM users WHERE id = ?',
      [user_id]
    );

    if (rows.length === 0) {
      console.log('❌ Aucun utilisateur trouvé avec cet ID');
      return;
    }

    tiktok_username = rows[0].tiktok_username;
    console.log(`[DB] Utilisateur TikTok : ${tiktok_username}`);
  } catch (err) {
    console.error('❌ Erreur lors de la récupération du pseudo TikTok :', err);
    return;
  }

  if (!tiktok_username || !user_id) {
    return ws.send(
      JSON.stringify({
        type: "error",
        code: "UNDEFINED_USER",
        message: "Underfined user.",
      })
    );
  }

  if (activeConnections.has(tiktok_username)) {
    const connData = activeConnections.get(tiktok_username);
    
    connData.sockets.add(ws);
    console.log(`[GAME01] Nouveau client connecté au live de ${tiktok_username}, total: ${connData.sockets.size}`);
    
    configureWebsocketCloseEvent(ws);
    
    return;
  }  

  const connectionOptions = {
    processInitialData: true,
  };

  const connection = new TikTokLiveConnection(
    tiktok_username,
    connectionOptions
  );

  activeConnections.set(tiktok_username, {
    connection,
    sockets: new Set([ws]),
    createdAt: Date.now()
  });  

  connection.webClient.webSigner.webcast
    .getRateLimits()
    .then((response) => {
      const limits = response.data;

      console.log("[EULER] Rate Limits:", limits);

      const remainingMinute = limits?.minute?.remaining ?? 0;

      if (remainingMinute <= 0) {
        console.warn("[EULER] Quota minute dépassé. Connexion bloquée.");
        ws.send(
          JSON.stringify({
            type: "error",
            code: "RATE_LIMIT_EXCEEDED",
            message:
              "Le quota de requêtes par minute a été atteint. Réessaie plus tard.",
          })
        );

        activeConnections.delete(tiktok_username);
        return;
      }

      connectToTikTok();
    })
    .catch((err) => {
      console.warn(
        "[EULER] Impossible de récupérer les limites :",
        err.message
      );
      ws.send(
        JSON.stringify({
          type: "error",
          code: "RATE_LIMIT_FETCH_FAILED",
          message:
            "Impossible de vérifier les limites API. Réessaie plus tard.",
        })
      );

      activeConnections.delete(tiktok_username);
    });

  function connectToTikTok() {
    connection
      .connect()
      .then(async () => {
        console.log(`[GAME01] Connecté à TikTok (${tiktok_username})`);

        try {
          await db.query(
            "UPDATE games SET launches = launches + 1 WHERE id = ?",
            [1]
          );

          const [result] = await db.query(
            "INSERT INTO sessionlive (user_id) VALUES (?)",
            [user_id]
          );

          sessionId = result.insertId;
        } catch (error) {
          console.error(
            "[GAME01] Erreur lors de la création de sessionlive :",
            error
          );
        }

        connection.on("gift", async (giftData) => {
          const author = giftData.user.uniqueId;
          const giftId = giftData.giftId;
          const giftName = giftData.giftDetails.giftName;
          const diamondCount = giftData.giftDetails.diamondCount || 0;
        
          if (sessionId) {
            await db.query(
              "UPDATE sessionlive SET gift_count = gift_count + 1 WHERE id = ?",
              [sessionId]
            );
          }
        
          try {
            const timestamp = new Date();

            await db.query(
              "INSERT INTO gifts (author, gift_id, gift_name, diamond_count, date, user_id) VALUES (?, ?, ?, ?, ?, ?)",
              [author, giftId, giftName, diamondCount, timestamp, user_id]
            );
          } catch (error) {
            console.error("[GAME01] Erreur sauvegarde cadeau:", error);
          }
        
          const connData = activeConnections.get(tiktok_username);
          if (connData) {
            for (const client of connData.sockets) {
              const blueGifts = client.blueGifts.map(Number);
              const redGifts = client.redGifts.map(Number);
          
              const targetTeam = blueGifts.includes(giftId)
                ? "bleu"
                : redGifts.includes(giftId)
                ? "rouge"
                : null;
          
              if (targetTeam && client.readyState === 1) {
                client.send(
                  JSON.stringify({
                    type: "points",
                    team: targetTeam,
                    points: diamondCount,
                  })
                );
              }
            }
          }
        });
        
        connection.on("member", async (data) => {
          if (sessionId) {
            await db.query(
              "UPDATE sessionlive SET viewer_count = viewer_count + 1 WHERE id = ?",
              [sessionId]
            );
          }
        });

        connection.on("follow", async (data) => {
          if (sessionId) {
            await db.query(
              "UPDATE sessionlive SET follow_count = follow_count + 1 WHERE id = ?",
              [sessionId]
            );
          }
        });

        connection.on("like", async (data) => {
          if (sessionId) {
            await db.query(
              "UPDATE sessionlive SET like_count = like_count + ? WHERE id = ?",
              [data.likeCount, sessionId]
            );
          }
        });
      })
      .catch((err) => {
        console.error("❌ Erreur connexion TikTok:", err);
        ws.send(
          JSON.stringify({
            type: "error",
            code: "TIKTOK_CONNECTION_FAILED",
            message: "Erreur lors de la connexion à TikTok.",
            details: err.message,
          })
        );
        activeConnections.delete(tiktok_username);
      });

    configureWebsocketCloseEvent(ws, tiktok_username);
  }
};

function configureWebsocketCloseEvent(ws, tiktok_username) {
  ws.on("close", () => {
    const connData = activeConnections.get(tiktok_username);
    if (!connData) return;

    connData.sockets.delete(ws);
    
    if (connData.sockets.size === 0) {
      connData.connection.disconnect();
      activeConnections.delete(tiktok_username);
      console.log(`[GAME01] Dernier client déconnecté, fermeture du live ${tiktok_username}`);
    } else {
      console.log(`[GAME01] Client déconnecté du live ${tiktok_username}, ${connData.sockets.size} clients restants`);
    }
  });
}