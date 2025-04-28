const mongoose = require('mongoose');

const newMessage = new Message({
    content,
    latitude,
    longitude,
    font,
    paper,
    encre,
    location: {
        type: 'Point',
        coordinates: [longitude, latitude],
    }
});


// Crée un index géospatial sur location pour les requêtes near
messageSchema.index({ location: '2dsphere' });

// Avant de sauvegarder, remplir automatiquement location si latitude/longitude sont là
messageSchema.pre('save', function (next) {
    if (this.latitude && this.longitude) {
        this.location = {
            type: 'Point',
            coordinates: [this.longitude, this.latitude],
        };
    }
    next();
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
