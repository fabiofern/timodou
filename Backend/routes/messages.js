const express = require('express');
const router = express.Router();
const Message = require('../models/messages');
const User = require('../models/users');
const { checkToken } = require('../modules/checkToken');

// -- POST /messages: Créer un message géolocalisé -- //
router.post('/', checkToken, async (req, res) => {
    const { content, latitude, longitude } = req.body;
    // Vérifie que le contenu, la latitude et la longitude sont présents
    if (!content || !latitude || !longitude) {
        return res.status(400).json({ result: false, message: 'Champs manquants ou vides' });
    }
    try {

        const newMessage = new Message({
            author: req.user.id, // ID de l'utilisateur connecté
            content,
            latitude,
            longitude,
            expiresAt

            // ce au on doit absolument retropouver pour que j affiche le message avec les bonnes coouluers font etc ..

            // message: String,
            // latitude: Number,
            // longitude: Number,
            // font: String,
            // paper: String,
            // encre: String,
        })

        const savedMessage = await newMessage.save();
        return res.status(201).json({ result: true, message: 'Message créé', data: savedMessage });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ result: false, error: 'Erreur serveur' });
    }
});

// ROUTE QUI VERIFIE PAR SA GEO LOC VIA 2DSPHERE SI UN MESSAGE EST A MOINS DE 15 METRES DE L UTILISATEUR
router.post('/nearby', async (req, res) => {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({ result: false, message: 'Coordonnées manquantes' });
    }

    try {
        const message = await Message.findOneAndDelete({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 15, // mètres
                },
            },
        });

        if (!message) {
            return res.json({ result: true, data: null }); // rien à lire ici...
        }

        return res.json({ result: true, data: message }); // message lu, disparu du monde
    } catch (err) {
        console.error(err);
        return res.status(500).json({ result: false, error: 'Erreur serveur' });
    }
});
















// -- GET /messages : Récupérer les messages proches (via lat/lng en query) -- //
router.get('/', checkToken, async (req, res) => {
    const { latitude, longitude, radius = 0.01 } = req.query;
    if (!latitude || !longitude) {
        return res.status(400).json({ result: false, message: 'Latitude et longitude requises' })
    }
    try {
        // Récupère les messages proches de l'utilisateur
        const messages = await Message.find({
            latitude: { $gte: Number(latitude) - radius, $lte: Number(latitude) + radius },
            longitude: { $gte: Number(longitude) - radius, $lte: Number(longitude) + radius },
        }).populate('author', 'username');

        res.status(200).json({ result: true, message: 'Messages récupérés', data: messages });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ result: false, error: 'Erreur serveur' });

    }
});

// DELETE	/messages/:id	Supprimer un message (par son auteur uniquement)
// GET    /messages/:id	Récupérer un message 

module.exports = router;