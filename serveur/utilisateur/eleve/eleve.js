require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Assurez-vous que cette ligne est présente
const router = express.Router();
const pool = require('../../db');

const app = express();
const SECRET_KEY = "fallback_secret";

// Middleware global
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware pour gérer les CORS et autorisations
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

//Route pour recuperer la progression par chapitre
router.get('/api/progression/:id_chapitre', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Token manquant.' });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.id;
        const chapitreId = req.params.id_chapitre;

        // Compter le total des auto-évaluations pour ce chapitre
        const totalResult = await pool.query(`
            SELECT COUNT(*) 
            FROM competence.auto_evaluation ae
            JOIN competence.competence c ON ae.id_competence = c.id_competence
            WHERE ae.id_utilisateur = $1 AND c.id_chapitre = $2
        `, [userId, chapitreId]);

        // Compter les auto-évaluations complétées (id_status = 3)
        const completedResult = await pool.query(`
            SELECT COUNT(*) 
            FROM competence.auto_evaluation ae
            JOIN competence.competence c ON ae.id_competence = c.id_competence
            WHERE ae.id_utilisateur = $1 AND c.id_chapitre = $2 AND ae.id_status = 3
        `, [userId, chapitreId]);

        const total = parseInt(totalResult.rows[0].count, 10);
        const completed = parseInt(completedResult.rows[0].count, 10);

        res.json({ total, completed });
    } catch (error) {
        console.error('Erreur SQL :', error.message);
        res.status(500).json({ error: error.message });
    }
});

//route pour recuperer la progression par competence
router.get('/api/progression/competence/:id_competence', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Token manquant.' });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.id;
        const competenceId = req.params.id_competence;
        const seuil = 4; // Nombre à modifier selon les besoins

        // Compter les tentatives réussies pour cette compétence
        const result = await pool.query(`
            SELECT COUNT(*) as count
            FROM competence.tentative_assignement ta
            JOIN competence.tentative t ON ta.id_tentative = t.id_tentative
            JOIN competence.proposition p ON ta.id_proposition = p.id_proposition
            JOIN competence.question q ON p.id_question = q.id_question
            WHERE t.id_utilisateur = $1
            AND p.est_correcte = true
            AND q.id_competence = $2
        `, [userId, competenceId]);

        const completed = parseInt(result.rows[0].count, 10);
        const percentage = Math.min(Math.round((completed / seuil) * 100), 100);

        res.json({ completed, total: seuil, percentage });
    } catch (error) {
        console.error('Erreur SQL :', error.message);
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;