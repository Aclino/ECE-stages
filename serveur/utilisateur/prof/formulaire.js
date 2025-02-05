require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const pool = require('../../db');
const verifyToken = require('../../mildleware/midleware');

const SECRET_KEY = process.env.SECRET_KEY || "votre_clé_secrète";
const router = express.Router();

router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Récupérer les promotions
// Récupérer les promotions
router.get('/api/promotions', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;  // Correction ici

        const result = await pool.query(
            `SELECT p.* 
             FROM competence.promotion p
             INNER JOIN competence.utilisateur_assignement up ON p.id_promotion = up.id_promotion
             WHERE up.id_utilisateur = $1`,
            [userId]
        );

        console.log('Résultat des promotions:', result.rows);
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des promotions:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Récupérer les matières assignées
router.get('/api/subjects', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;  // Correction ici

        const result = await pool.query(
            `SELECT m.id_matiere AS id, m.nom, p.id_promotion, p.nom AS promo_nom 
             FROM competence.promomatiere_assignement pm
             INNER JOIN competence.matiere m ON pm.id_matiere = m.id_matiere
             INNER JOIN competence.promotion p ON pm.id_promotion = p.id_promotion
             INNER JOIN competence.utilisateur_assignement up ON p.id_promotion = up.id_promotion
             WHERE up.id_utilisateur = $1`,
            [userId]
        );

        console.log('Résultat des matières:', result.rows);
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des matières:', err.message);
        res.status(500).json({ error: err.message });
    }
});


// Ajouter une matière et l'assigner à une promotion
router.post('/api/subjects', verifyToken, async (req, res) => {
    const { nom, id_promotion } = req.body;
    try {
        const insertMatiere = await pool.query(
            'INSERT INTO competence.matiere (nom) VALUES ($1) RETURNING id_matiere',
            [nom]
        );

        const id_matiere = insertMatiere.rows[0].id_matiere;

        await pool.query(
            'INSERT INTO competence.promomatiere_assignement (id_promotion, id_matiere) VALUES ($1, $2)',
            [id_promotion, id_matiere]
        );

        res.status(201).json({ id: id_matiere, nom, id_promotion });
    } catch (err) {
        console.error('Erreur lors de l’ajout de la matière:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Supprimer une matière assignée
router.delete('/api/subjects/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM competence.promomatiere_assignement WHERE id_matiere = $1', [id]);
        await pool.query('DELETE FROM competence.matiere WHERE id_matiere = $1', [id]);

        res.status(200).json({ message: 'Matière supprimée' });
    } catch (err) {
        console.error('Erreur lors de la suppression de la matière:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;