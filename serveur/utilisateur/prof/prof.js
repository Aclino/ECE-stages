require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Ajout pour décoder le token
const pool = require('../../db');
const SECRET_KEY = "votre_clé_secrète";
const router = express.Router();


router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Récupère le token après "Bearer "
    
    console.log("🔑 Token reçu :", token);

    if (!token) {
        return res.status(401).json({ error: "Accès refusé, token manquant" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY); // Vérifie et décode le token
        console.log("✅ Token décodé :", decoded);
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.error("🚨 Erreur de vérification du token :", error.message);
        return res.status(403).json({ error: "Token invalide" });
    }
};

// ✅ Route pour récupérer les promotions d'un prof
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

        res.json(promo.rows.map(row => row.nom)); // Renvoie seulement un tableau de noms de promos
    } catch (error) {
        console.error("🚨 Erreur serveur :", error);
        res.status(500).json({ error: "Erreur serveur, impossible de récupérer les promos." });
    }
});

// ✅ Route pour récupérer les matières associées à une promotion spécifique
router.get('/api/prof/promo/:nom/matieres', verifyToken, async (req, res) => {
    const promoNom = req.params.nom;

    try {
        const query = `
            SELECT m.id_matiere, m.nom AS matiere_nom
            FROM competence.matiere m
            JOIN competence.promomatiere_assignement pa ON m.id_matiere = pa.id_matiere
            JOIN competence.promotion p ON pa.id_promotion = p.id_promotion
            WHERE p.nom = $1;
        `;

        const matieres = await pool.query(query, [promoNom]);

        if (matieres.rows.length === 0) {
            return res.status(404).json({ error: "Aucune matière trouvée pour cette promotion." });
        }

        res.json(matieres.rows);
    } catch (error) {
        console.error("🚨 Erreur serveur :", error);
        res.status(500).json({ error: "Erreur serveur, impossible de récupérer les matières." });
    }
});

module.exports = router;
