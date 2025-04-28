// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    tiktokUsername: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true
    },
    displayName: {
        type: String,
        trim: true
    },
    coins: { 
        type: Number, 
        default: 0 
    },
    lastActive: { 
        type: Date, 
        default: Date.now 
    },
    totalGiftsReceived: { 
        type: Number, 
        default: 0 
    },
    totalDiamondsReceived: {
        type: Number,
        default: 0
    },
    profilePictureUrl: {
        type: String
    },
    giftHistory: [{
        giftId: String,
        giftName: String,
        diamonds: Number,
        count: Number,
        senderId: String,
        senderUsername: String,
        senderDisplayName: String,
        senderProfilePicture: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;