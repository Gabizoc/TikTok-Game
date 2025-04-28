// models/Gift.js
const mongoose = require('mongoose');

const giftSchema = new mongoose.Schema({
    giftId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    diamondCost: {
        type: Number,
        required: true
    },
    description: String,
    icon: String,
    image: String,
    type: Number,
    // Si vous avez des informations supplémentaires comme la rareté, catégorie, etc.
    rarity: String,
    category: String,
    // Un cadeau peut être limité dans le temps
    available: {
        type: Boolean,
        default: true
    },
    // Dates de disponibilité (optionnelles)
    availableFrom: Date,
    availableTo: Date
}, { timestamps: true });

const Gift = mongoose.model('Gift', giftSchema);

module.exports = Gift;