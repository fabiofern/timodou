const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    content: { type: String, required: true }, // Contenu du message
    latitude: { type: Number, required: true }, // Coordonnées géographiques
    longitude: { type: Number, required: true }, // Coordonnées géographiques
    font: String,
    paper: String,
    encre: String,
    location: {
        type: { type: String, enum: ['Point'], required: true, default: 'Point' }, // Type de géométrie (Point)
        coordinates: { type: [Number], required: true }
    },
})

// créer un index géospatial pour la localisation
messageSchema.index({ location: '2dsphere' });

// Avant de sauvegarder, on définit automatiquement les coordonnées de la localisation
messageSchema.pre('save', function (next) {
    if (this.latitude && this.longitude) {
        this.location = {
            type: 'Point',
            coordinates: [this.longitude, this.latitude] // Ordre : [longitude, latitude]
        };
    }
    next();
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
