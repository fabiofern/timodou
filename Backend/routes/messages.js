const express = require('express');
const router = express.Router();
const Message = require('../models/messages');
const User = require('../models/users');
// const {checkToken} = require('../modules/checkToken');

// -- POST /messages: Créer un message géolocalisé -- //
router.post('/', async (req, res) => {
    const { content, latitude, longitude, font, paper, encre } = req.body;
    // Vérifie que le contenu, la latitude et la longitude sont présents
    if (!content || !latitude || !longitude) {
        return res.status(400).json({ result: false, message: 'Champs manquants ou vides' });
    }
    try {
        // calcul de l'expiration du message
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Définit l'expiration à 30 jours après la création
       
        // Crée un nouveau message
        // const expiresAt = new Date();
        // expiresAt.setHours(expiresAt.getHours() + 24); // Définit l'expiration à 24 heures après la création
        // expiresAt.setDate(expiresAt.getDate() + 7); // OU Définit l'expiration à 7 jours après la création
        const newMessage = new Message({
            // author: req.user.id, // ID de l'utilisateur connecté
            content,
            latitude,
            longitude,
            font,
            paper,
            encre,
            location: {
                type: 'Point',
                coordinates: [Number(longitude), Number(latitude)] // Ordre : [longitude, latitude]
            },
            expiresAt,
        })

        const savedMessage = await newMessage.save();
        
        return res.status(201).json({ result: true, message: 'Message créé', data: savedMessage });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ result: false, error: 'Erreur serveur' });
    }
});

// Test de la route GET : http://localhost:3000/messages?latitude=48.8566&longitude=2.3522&distance=50
// -- GET /messages : Récupérer les messages proches (via lat/lng en query) -- //


router.post('/nearby', async (req, res) => {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({ result: false, message: 'Latitude and longitude required' });
    }

    try {
        const nearbyMessages = await Message.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude], // ⚡ ordre important : [longitude, latitude]
                    },
                    $maxDistance: 15, // en mètres
                },
            },
        });

        res.status(200).json({ result: true, data: nearbyMessages });
    } catch (error) {
        console.error('Erreur serveur nearby:', error);
        res.status(500).json({ result: false, error: 'Erreur serveur' });
    }
});

// // Route pour supprimer un message par son ID
//Suppression du message en front sans toucher à la DBB
// router.delete('/:id', async (req, res) => {
//     const { id } = req.params;

//     try {
//         const deletedMessage = await Message.findByIdAndDelete(id);

//         if (!deletedMessage) {
//             return res.status(404).json({ result: false, message: 'Message non trouvé' });
//         }

//         res.status(200).json({ result: true, message: 'Message supprimé avec succès', data: deletedMessage });
//     } catch (error) {
//         console.error('Erreur serveur suppression:', error);
//         res.status(500).json({ result: false, error: 'Erreur serveur' });
//     }
// });




module.exports = router;
