const express = require('express');
const router = express.Router();


// ├── POST     / (créer un message)
// ├── GET      / (récupérer les messages proches via query params latitude/longitude)
// ├── GET      /:id (récupérer un message précis, optionnel)
// └── DELETE   /:id (supprimer un message précis)

module.exports = router;