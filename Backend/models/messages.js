const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref:'User', required: true  }, // Référence à un User
    content : { type: String, required: true }, // Contenu du message
    latitude : { type: Number, required: true }, // Coordonnées géographiques
    longitude : { type: Number, required: true }, // Coordonnées géographiques
    category : { type: String, required: true }, // Catégorie (poésie, encouragement, amour, etc.)
    createdAt : { type: Date, default: Date.now }, // Date de création
    expiresAt : { type: Date } // Date d'expiration (optionnelle)
})

const Message = mongoose.model('messages', messageSchema);
module.exports = Message;