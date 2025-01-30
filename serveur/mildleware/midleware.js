
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
        return res.status(401).json({ error: 'Accès non autorisé.' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token invalide.' });
        }
        req.user = user; // Ajouter les données du token à la requête
        next();
    });
};
module.exports=  authenticateToken;