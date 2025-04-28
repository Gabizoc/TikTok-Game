const express = require('express');
const { WebcastPushConnection } = require('tiktok-live-connector');
const mongoose = require('mongoose');
const router = express.Router();
require('dotenv').config();
const User = require('../models/User');
const StreamSession = require('../models/StreamSession');
const Gift = require('../models/Gift');
const GiftStats = require('../models/GiftStats');

// Map pour stocker les connexions TikTok Live actives
const activeConnections = new Map();

// Middleware pour vérifier l'authentification (à adapter selon votre système d'auth)
const authMiddleware = (req, res, next) => {
    // Vérifiez votre authentification ici
    // Par exemple: 
    // if (!req.session.user) return res.status(401).json({ status: "error", message: "Not authenticated" });
    next();
};

// Démarrer une connexion TikTok Live
router.post("/start-live-connection", authMiddleware, async (req, res) => {
    const { tiktokUsername } = req.body;
    
    if (!tiktokUsername) {
        return res.status(400).json({ 
            status: "error", 
            message: "TikTok username is required" 
        });
    }
    
    try {
        // Vérifier si une connexion existe déjà
        if (activeConnections.has(tiktokUsername)) {
            return res.status(200).json({ 
                status: "info", 
                message: "Connection already active for this username" 
            });
        }
        
        // Créer une nouvelle connexion TikTok Live
        const tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);
        
        // Créer ou récupérer l'utilisateur
        let user = await User.findOne({ tiktokUsername });
        if (!user) {
            user = new User({ tiktokUsername });
            await user.save();
        }
        
        // Créer une nouvelle session de streaming
        const streamSession = new StreamSession({
            tiktokUsername,
            startTime: new Date()
        });
        await streamSession.save();
        
        // Connecter à TikTok Live
        tiktokLiveConnection.connect().then(state => {
            console.log(`Connected to roomId ${state.roomId}`);
            
            // Stocker la connexion et la session dans la map
            activeConnections.set(tiktokUsername, {
                connection: tiktokLiveConnection,
                sessionId: streamSession._id
            });
            
            // Configuration des écouteurs d'événements
            
            // Écouteur pour les cadeaux
            tiktokLiveConnection.on('gift', async (data) => {
                console.log(`Received gift: ${data.giftName} from ${data.nickname}`);
                
                // Mettre à jour la session de streaming
                const session = await StreamSession.findById(streamSession._id);
                
                // Calculer la valeur du cadeau
                const giftValue = data.diamondCount * data.repeatCount;
                
                // Ajouter le cadeau à l'historique de la session
                session.gifts.push({
                    giftId: data.giftId,
                    giftName: data.giftName,
                    diamonds: giftValue,
                    count: data.repeatCount,
                    senderId: data.userId,
                    senderUsername: data.nickname,
                    timestamp: new Date()
                });
                
                session.totalGifts += 1;
                session.totalDiamonds += giftValue;
                await session.save();
                
                // Mettre à jour l'utilisateur
                user.coins += giftValue * 0.01;
                user.totalGiftsReceived += 1;
                user.lastActive = new Date();
                user.giftHistory.push({
                    giftId: data.giftId,
                    giftName: data.giftName,
                    diamonds: giftValue,
                    senderId: data.userId,
                    senderUsername: data.nickname,
                    timestamp: new Date()
                });
                await user.save();
            });
            
            // Écouteur pour le nombre de spectateurs
            tiktokLiveConnection.on('roomUser', async (data) => {
                const session = await StreamSession.findById(streamSession._id);
                session.currentViewers = data.viewerCount;
                
                // Mettre à jour le pic de spectateurs si nécessaire
                if (data.viewerCount > session.viewerPeak) {
                    session.viewerPeak = data.viewerCount;
                }
                
                await session.save();
            });
            
            // Écouteur pour la déconnexion
            tiktokLiveConnection.on('streamEnd', async () => {
                console.log(`Stream ended for ${tiktokUsername}`);
                await endLiveSession(tiktokUsername);
            });
            
            return res.status(200).json({
                status: "success",
                message: "Connected to TikTok Live",
                roomId: state.roomId,
                sessionId: streamSession._id
            });
            
        }).catch(err => {
            console.error(`Failed to connect to TikTok Live for ${tiktokUsername}:`, err);
            return res.status(500).json({
                status: "error",
                message: "Failed to connect to TikTok Live",
                error: err.message
            });
        });
        
    } catch (error) {
        console.error("Error starting TikTok Live connection:", error);
        return res.status(500).json({
            status: "error",
            message: "Server error while connecting to TikTok Live",
            error: error.message
        });
    }
});

// Arrêter une connexion TikTok Live
router.post("/stop-live-connection", authMiddleware, async (req, res) => {
    const { tiktokUsername } = req.body;
    
    if (!tiktokUsername) {
        return res.status(400).json({ 
            status: "error", 
            message: "TikTok username is required" 
        });
    }
    
    try {
        const result = await endLiveSession(tiktokUsername);
        
        if (result.success) {
            return res.status(200).json({
                status: "success",
                message: "Live connection stopped",
                sessionSummary: result.session
            });
        } else {
            return res.status(404).json({
                status: "error",
                message: result.message
            });
        }
    } catch (error) {
        console.error("Error stopping TikTok Live connection:", error);
        return res.status(500).json({
            status: "error",
            message: "Server error while stopping TikTok Live connection",
            error: error.message
        });
    }
});

// Fonction pour terminer une session de streaming
async function endLiveSession(tiktokUsername) {
    if (!activeConnections.has(tiktokUsername)) {
        return {
            success: false,
            message: "No active connection found for this username"
        };
    }
    
    const { connection, sessionId } = activeConnections.get(tiktokUsername);
    
    // Déconnecter de TikTok Live
    connection.disconnect();
    
    // Terminer la session
    const session = await StreamSession.findById(sessionId);
    session.endTime = new Date();
    session.active = false;
    await session.save();
    
    // Supprimer de la map des connexions actives
    activeConnections.delete(tiktokUsername);
    
    return {
        success: true,
        session: {
            id: session._id,
            tiktokUsername: session.tiktokUsername,
            duration: (session.endTime - session.startTime) / 1000 / 60,
            totalGifts: session.totalGifts,
            totalDiamonds: session.totalDiamonds,
            viewerPeak: session.viewerPeak
        }
    };
}

// Obtenir les stats d'une session de streaming
router.get("/live-session/:sessionId", authMiddleware, async (req, res) => {
    const { sessionId } = req.params;
    
    try {
        const session = await StreamSession.findById(sessionId);
        
        if (!session) {
            return res.status(404).json({
                status: "error",
                message: "Session not found"
            });
        }
        
        // Calculer des statistiques supplémentaires
        const duration = session.endTime 
            ? (session.endTime - session.startTime) / 1000 / 60 
            : (new Date() - session.startTime) / 1000 / 60;
        
        return res.status(200).json({
            status: "success",
            session: {
                id: session._id,
                tiktokUsername: session.tiktokUsername,
                startTime: session.startTime,
                endTime: session.endTime,
                active: session.active,
                duration: duration.toFixed(2),
                totalGifts: session.totalGifts,
                totalDiamonds: session.totalDiamonds,
                viewerPeak: session.viewerPeak,
                currentViewers: session.currentViewers,
                gifts: session.gifts
            }
        });
        
    } catch (error) {
        console.error("Error retrieving session stats:", error);
        return res.status(500).json({
            status: "error",
            message: "Server error while retrieving session stats",
            error: error.message
        });
    }
});

// Obtenir toutes les sessions de streaming d'un utilisateur
router.get("/user-sessions/:tiktokUsername", authMiddleware, async (req, res) => {
    const { tiktokUsername } = req.params;
    
    try {
        const sessions = await StreamSession.find({ 
            tiktokUsername 
        }).sort({ startTime: -1 });
        
        return res.status(200).json({
            status: "success",
            sessions: sessions.map(session => ({
                id: session._id,
                startTime: session.startTime,
                endTime: session.endTime,
                active: session.active,
                duration: session.endTime 
                    ? ((session.endTime - session.startTime) / 1000 / 60).toFixed(2)
                    : ((new Date() - session.startTime) / 1000 / 60).toFixed(2),
                totalGifts: session.totalGifts,
                totalDiamonds: session.totalDiamonds,
                viewerPeak: session.viewerPeak
            }))
        });
        
    } catch (error) {
        console.error("Error retrieving user sessions:", error);
        return res.status(500).json({
            status: "error",
            message: "Server error while retrieving user sessions",
            error: error.message
        });
    }
});

// Obtenir les détails d'un utilisateur
router.get("/user/:tiktokUsername", authMiddleware, async (req, res) => {
    const { tiktokUsername } = req.params;
    
    try {
        const user = await User.findOne({ tiktokUsername });
        
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }
        
        return res.status(200).json({
            status: "success",
            user: {
                tiktokUsername: user.tiktokUsername,
                coins: user.coins,
                lastActive: user.lastActive,
                totalGiftsReceived: user.totalGiftsReceived
            }
        });
        
    } catch (error) {
        console.error("Error retrieving user:", error);
        return res.status(500).json({
            status: "error",
            message: "Server error while retrieving user",
            error: error.message
        });
    }
});

// Récupérer une liste des connexions actives
router.get("/active-connections", authMiddleware, async (req, res) => {
    try {
        const connections = Array.from(activeConnections.keys()).map(username => ({
            tiktokUsername: username,
            sessionId: activeConnections.get(username).sessionId
        }));
        
        return res.status(200).json({
            status: "success",
            connections
        });
    } catch (error) {
        console.error("Error retrieving active connections:", error);
        return res.status(500).json({
            status: "error",
            message: "Server error while retrieving active connections",
            error: error.message
        });
    }
});

module.exports = router;