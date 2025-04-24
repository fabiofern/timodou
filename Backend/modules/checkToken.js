const jwt = require('jsonwebtoken');

function checkToken(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) 
    return res.status(401).json({ result: false, error: 'Token manquant' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ajoute les infos utilisateur au req
    next();
  } catch (error) {
    return res.status(401).json({ result: false, error: 'Token invalide' });
  }
}

module.exports = {checkToken};