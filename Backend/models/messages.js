const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    // author: { type: mongoose.Schema.Types.ObjectId, ref:'User', required: true  }, // Référence à un User
    content : { type: String, required: true }, // Contenu du message
    latitude : { type: Number, required: true }, // Coordonnées géographiques
    longitude : { type: Number, required: true }, // Coordonnées géographiques
    font : String,
    paper : String,
    encre : String,
    // category : { type: String, required: true }, // Catégorie (poésie, encouragement, amour, etc.)
    // createdAt : { type: Date, default: Date.now }, // Date de création
    // expiresAt : { type: Date } // Date d'expiration (optionnelle)
})

// TTL (Time-to-live) activé pour suppression auto des messages dans MongoDB
// messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); 

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;