import mongoose from 'mongoose';

<<<<<<< HEAD
const messageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    font: String,
    paper: String,
    encre: String,
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
});

messageSchema.index({ location: '2dsphere' });
=======
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
>>>>>>> 7fe8a8d83a91178b3ddbf82414c359abc1fa42d5

export default mongoose.model('Message', messageSchema);
