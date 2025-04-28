// models/GiftStats.js
const mongoose = require('mongoose');

// Ce modèle permet de suivre les statistiques globales des cadeaux
const giftStatsSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        index: true
    },
    tiktokUsername: {
        type: String,
        required: true,
        index: true
    },
    totalSessions: {
        type: Number,
        default: 0
    },
    totalStreamTime: {
        type: Number, // minutes
        default: 0
    },
    totalViewers: {
        type: Number,
        default: 0
    },
    uniqueViewers: {
        type: Number,
        default: 0
    },
    totalGifts: {
        type: Number,
        default: 0
    },
    totalDiamonds: {
        type: Number,
        default: 0
    },
    totalLikes: {
        type: Number,
        default: 0
    },
    totalComments: {
        type: Number,
        default: 0
    },
    // Pour suivre les statistiques par cadeau
    giftBreakdown: [{
        giftId: String,
        giftName: String,
        count: Number,
        diamonds: Number
    }],
    // Pour suivre les top donneurs
    topGifters: [{
        userId: String,
        username: String,
        displayName: String,
        totalDiamonds: Number,
        totalGifts: Number
    }]
}, { timestamps: true });

// Index composite pour recherches efficaces
giftStatsSchema.index({ tiktokUsername: 1, date: 1 });

const GiftStats = mongoose.model('GiftStats', giftStatsSchema);

module.exports = GiftStats;