
const express = require('express');
const jwt = require('jsonwebtoken'); // Importer jsonwebtoken
const SECRET_KEY = "votre_clé_secrète";
const app = express();


// Middleware pour vérifier le token JWT
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"); // Ajout de Authorization
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Autoriser les méthodes nécessaires
    next();
  });
  function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        // Si le token est manquant, retourne une erreur explicite
        return res.status(401).json({ error: 'Token manquant. Redirection nécessaire.' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            // Si le token est invalide, retourne une erreur explicite
            return res.status(403).json({ error: 'Token invalide. Redirection nécessaire.' });
        }

        req.user = user; // Ajoute les données du token déchiffré à `req`
        next();
    });
}

module.exports = authenticateToken;

