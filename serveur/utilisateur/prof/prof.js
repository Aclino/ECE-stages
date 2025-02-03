require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Ajout pour décoder le token
const pool = require('../../db');
const SECRET_KEY = process.env.SECRET_KEY || "fallback_secret";
const router = express.Router();
const check = require('../../mildleware/midleware');

router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Récupère le token après "Bearer "
    
    console.log("🔑 Token reçu :", token);
    console.log("🔐 Clé secrète utilisée :", SECRET_KEY);

    if (!token) {
        return res.status(401).json({ error: "Accès refusé, token manquant" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY); // Vérifie et décode le token
        console.log("✅ Token décodé :", decoded);
        req.userId = decoded.id; // Assure-toi que le token contient bien `id`, pas `id_utilisateur`
        next();
    } catch (error) {
        console.error("🚨 Erreur de vérification du token :", error.message);
        return res.status(403).json({ error: "Token invalide" });
    }
};

router.get('/api/prof/promo', verifyToken, async (req, res) => {
    console.log("🔍 Utilisateur authentifié :", req.userId);

    try {
        const query = `
            SELECT p.nom
            FROM competence.promotion p
            JOIN competence.utilisateur_assignement ua ON p.id_promotion = ua.id_promotion
            WHERE ua.id_utilisateur = $1;
        `;

        const promo = await pool.query(query, [req.userId]);

        if (promo.rows.length === 0) {
            console.log("⚠️ Aucun résultat trouvé pour l'utilisateur ID :", req.userId);
            return res.status(403).json({ error: "Aucune promotion associée à cet utilisateur." });
        }

        res.json(promo.rows);
    } catch (error) {
        console.error("🚨 Erreur serveur :", error);
        res.status(500).json({ error: "Erreur serveur, impossible de récupérer les promos." });
    }
});
router.get({/api/prof/promo/})
module.exports = router;
