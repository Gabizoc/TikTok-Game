// models/StreamSession.js
const mongoose = require('mongoose');

const streamSessionSchema = new mongoose.Schema({
    tiktokUsername: { 
        type: String, 
        required: true,
        index: true
    },
    roomId: {
        type: String
    },
    startTime: { 
        type: Date, 
        default: Date.now 
    },
    endTime: { 
        type: Date 
    },
    totalGifts: { 
        type: Number, 
        default: 0 
    },
    totalDiamonds: { 
        type: Number, 
        default: 0 
    },
    viewerPeak: { 
        type: Number, 
        default: 0 
    },
    currentViewers: { 
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
    active: { 
        type: Boolean, 
        default: true,
        index: true
    },
    gifts: [{
        giftId: String,
        giftName: String,
        giftType: Number,
        diamondCost: Number,
        diamonds: Number,
        count: Number,
        repeatCount: Number,
        senderId: String,
        senderUsername: String,
        senderDisplayName: String,
        senderProfilePicture: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    topGifters: [{
        userId: String,
        username: String,
        displayName: String,
        profilePicture: String,
        totalDiamonds: Number,
        totalGifts: Number
    }]
}, { 
    timestamps: true,
    // Indexer pour des requêtes plus rapides
    indexes: [
        { tiktokUsername: 1, startTime: -1 },
        { active: 1 }
    ]
});

// Méthode virtuelle pour calculer la durée de la session
streamSessionSchema.virtual('duration').get(function() {
    if (!this.endTime) {
        return Math.floor((Date.now() - this.startTime) / 1000 / 60); // Minutes
    }
    return Math.floor((this.endTime - this.startTime) / 1000 / 60); // Minutes
});

// Convertir automatiquement le virtuel en JSON
streamSessionSchema.set('toJSON', { virtuals: true });
streamSessionSchema.set('toObject', { virtuals: true });

const StreamSession = mongoose.model('StreamSession', streamSessionSchema);

module.exports = StreamSession;