const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        message: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true },
        isRead: { type: Boolean, default: false },
        sentAt: { type: Date, default: Date.now }
})
const Notification = mongoose.model('notifications', notificationSchema);
module.exports = Notification;

// Exemple concret :
// Lorsque l’utilisateur passe à proximité d’un message géolocalisé, 
// tu crées une entrée dans Notification afin de gérer sa lecture côté front et de prévenir les notifications en double. 
// Cela sera particulièrement utile avec la mise en place des notifications push.


// Exemple de routes recommandées :

// swift
// Copier
// Modifier
// GET     /api/notifications           // Récupère toutes les notifications d'un utilisateur
// PUT     /api/notifications/:id/read  // Marquer une notification comme lue
// DELETE  /api/notifications/:id       // Supprimer une notification