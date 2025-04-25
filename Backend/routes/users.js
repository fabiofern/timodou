const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const { checkToken } = require('../modules/checkToken');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// -- ROUTE POST : Créer un nouvel utilisateur -- //
router.post('/register', async (req, res) => {
  try {
    //Vérifie les champs du body
    if (!checkBody(req.body, ['username', 'email', 'password'])) {
      return res.status(400).json({ result: false, message: 'Champs manquants ou vides' })
    }

    // Vérifie le format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json({ result: false, message: 'Email invalide' })
    };
    // Vérifie que l'email n'existe pas déjà
    const existingEmail = await User.findOne({email: req.body.email });
    if (existingEmail) {
      return res.status(400).json({ result: false, message: 'Cet email existe déjà' })
    }

    // // Vérifie que le mot de passe contient au moins une majuscule, une minuscule et un chiffre
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    // if (!passwordRegex.test(req.body.password)) {
    //   return res.status(400).json({ result: false, message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre' })
    // };

    //Vérifie que le mot de passe fait au moins 8 caractères
    if (req.body.password.length < 8) {
      return res.status(400).json({ result: false, message: 'Le mot de passe doit faire au moins 8 caractères' })
    };


    // Vérifie que l'utilisateur existe pas déjà
    const existingUsername = await User.findOne({ username: req.body.username });
    if (existingUsername) {
      return res.status(400).json({ result: false, message: 'Cet utilisateur existe déjà' })
    }

    // Hash le mot de passe
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Crée un nouvel utilisateur
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword, 
    });
    const savedUser = await newUser.save();

    //Génération du nouveau token
    const token = jwt.sign(
      { id: savedUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    //réponse
    res.status(201).json({
      result: true,
      message: 'Inscription réussie',
      token,
      savedUser,
    })


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
})

// -- ROUTE POST LOGIN : route pour se connecter --//
router.post('/login', async (req, res) => {
  try {
    //Vérifie les champs du body
    if (!checkBody(req.body, ['username', 'password'])) {
      return res.status(400).json({ message: 'Champs manquant ou vide' });
    }

    const user = await User.findOne({ username: req.body.username });
    //Vérifie si l'utilisateur existe
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur introuvable' })
    };

    //Vérifie si le mot de passe est correct
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    };

    // Génération du token
    const token = jwt.sign(
      { id: user._id }, // payload du token
      process.env.JWT_SECRET, // secret pour signer le token
      { expiresIn: '1h' } // durée de validité du token
    );

    // Envoi de la réponse
    res.status(200).json({
      result: true,
      message: 'Connexion réussie',
      token,
      userId: user._id
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'erreur serveur' });
  }
});

// -- ROUTE GET : Récupérer le profil de l'utilisateur -- //
router.get('/profile', checkToken, async (req, res) => {
  try {
    // Récupère l'utilisateur grâce au middleware checkToken
    const user = await User.findById(req.user.id);
    console.log("req.user :", req.user);
    // Vérifie si l'utilisateur existe
    if (!user) {
      return res.status(404).json({ result: false, message: 'Utilisateur introuvable' });
    }

    // Renvoie les infos de l'utilisateur (sans le mot de passe)
    res.status(200).json({
      result: true,
      message: 'Profil récupéré',
      user: {
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        // createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, message: 'Erreur serveur' });
  }
});


// -- ROUTE PUT : Mettre à jour le profil de l'utilisateur -- //
router.put('/UpdateProfile', checkToken, async (req, res) => {
  try {
    const userId = req.user.id; // fourni par ton middleware checkToken

    // Vérifie les champs obligatoires
    if (!checkBody(req.body, ['username', 'email', 'password'])) {
      return res.status(400).json({ result: false, message: 'Champs manquants ou vides' });
    }

    // Vérifie le format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json({ result: false, message: 'Email invalide' });
    }

    // Vérifie si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ result: false, message: 'Utilisateur non trouvé' });
    }

    // Vérifie que l'email n'existe pas déjà (hors utilisateur actuel)
    const existingEmail = await User.findOne({ email: req.body.email, _id: { $ne: userId } });
    if (existingEmail) {
      return res.status(400).json({ result: false, message: 'Cet email existe déjà' });
    }

    // Vérifie que le username n'existe pas déjà (hors utilisateur actuel)
    const existingUsername = await User.findOne({ username: req.body.username, _id: { $ne: userId } });
    if (existingUsername) {
      return res.status(400).json({ result: false, message: 'Ce nom d’utilisateur existe déjà' });
    }

    // Vérifie que le mot de passe fait au moins 8 caractères
    if (req.body.password.length < 8) {
      return res.status(400).json({ result: false, message: 'Le mot de passe doit faire au moins 8 caractères' });
    }

    // Hash le mot de passe
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Mise à jour des données utilisateur
    user.username = req.body.username;
    user.email = req.body.email;
    user.password = hashedPassword;

    const updatedUser = await user.save();

    // Envoi de la réponse (sans renvoyer le mot de passe)
    res.status(200).json({
      result: true,
      message: 'Profil mis à jour',
      user: {
        username: updatedUser.username,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
        createdAt: updatedUser.createdAt
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, message: 'Erreur serveur' });
  }
});


// -- ROUTE DELETE : Supprimer le compte de l'utilisateur -- //
router.delete('/delete', checkToken, async (req, res) => {
  try {
    // Vérifie si l'utilisateur existe
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ result: false, message: 'Utilisateur introuvable' });
    }

    // Supprime directement l'utilisateur
    await User.findByIdAndDelete(req.user.id);

    // Envoi confirmation de suppression
    res.status(200).json({
      result: true,
      message: 'Compte supprimé'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, message: 'Erreur serveur' });
  }
});




module.exports = router;
