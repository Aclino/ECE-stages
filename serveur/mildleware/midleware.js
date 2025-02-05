const express = require('express');
const jwt = require('jsonwebtoken'); // Importer jsonwebtoken
const SECRET_KEY = "votre_clé_secrète";
const app = express();

// Middleware pour gérer CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"); // Autorise les headers nécessaires, dont Authorization
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Méthodes autorisées
    if (req.method === "OPTIONS") {
        return res.status(200).end(); // Répondre immédiatement au pré-vol OPTIONS
    }
    next();
});

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Récupère le token après "Bearer "

    if (!token) {
        console.log("🚨 Aucun token trouvé.");
        return res.status(401).json({ error: "Accès refusé, token manquant" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY); // Vérifie et décode le token
        console.log("✅ Token décodé : ", decoded);
        req.userId = decoded.id;  // Met l'ID utilisateur dans la requête pour l'utiliser après
        next(); // Passe au middleware suivant ou à la route
    } catch (error) {
        console.error("🚨 Erreur de vérification trop chiant du token : ", error.message);
        return res.status(403).json({ error: "Token invalide" });
    }
};

module.exports = verifyToken;
