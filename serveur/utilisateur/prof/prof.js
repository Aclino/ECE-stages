require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('../../db');

const router = express.Router();

router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/api/prof/promo', async (req, res) => { // Ajout du "/" manquant
    try {
        const query = `SELECT nom FROM competence.utilisateur`; // Vérifie que "utilisateur" contient bien les promos
        const promo = await pool.query(query);
        
        res.json(promo.rows); // Envoie directement un tableau pour correspondre au frontend
    } catch (error) {
        console.error("Erreur lors de la récupération des promos :", error);
        res.status(500).json({ error: "Erreur serveur, impossible de récupérer les promos" });
    }
});

module.exports = router;
