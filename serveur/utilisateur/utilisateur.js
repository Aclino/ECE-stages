require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('../db');

const router = express.Router();

const authenticateToken=require('../mildleware/midleware');
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"); // Ajout de Authorization
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Autoriser les méthodes nécessaires
  next();
});
// ✅ Route pour récupérer l'utilisateur connecté
router.get('/api/checktoken', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const query = `SELECT id_utilisateur, nom, prenom, email FROM competence.utilisateur WHERE id_utilisateur = $1`;
        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        }

        res.json({ utilisateur: result.rows[0] });

    } catch (err) {
        console.error("Erreur :", err);
        res.status(500).json({ error: 'Erreur lors de la récupération des informations utilisateur.' });
    }
});
module.exports=router;

