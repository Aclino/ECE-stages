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
const deleteCompetenceByName = async (req, res) => {
    const { nom, id_chapitre } = req.body;

    if (!nom || !id_chapitre) {
        return res.status(400).json({ message: "Nom et id_chapitre sont requis." });
    }

    try {
        const result = await pool.query(
            'DELETE FROM competence.competence WHERE nom = $1 AND id_chapitre = $2 RETURNING *',
            [nom, id_chapitre]
        );

        if (result.rowCount > 0) {
            return res.status(200).json({ message: "Compétence supprimée avec succès." });
        } else {
            return res.status(404).json({ message: "Compétence introuvable." });
        }
    } catch (error) {
        console.error("Erreur lors de la suppression de la compétence:", error);
        return res.status(500).json({ message: "Erreur serveur." });
    }
};


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

router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Récupérer les chapitres
router.get('/api/chapters', verifyToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT c.id_chapitre AS id, c.nom, c.description, m.nom AS matiere_nom 
             FROM competence.chapitre c
             INNER JOIN competence.matiere m ON c.id_matiere = m.id_matiere`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des chapitres:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Ajouter un chapitre
router.post('/api/chapters', verifyToken, async (req, res) => {
    const { nom, description, id_matiere } = req.body;
    try {
        const insertChapitre = await pool.query(
            'INSERT INTO competence.chapitre (nom, description, id_matiere) VALUES ($1, $2, $3) RETURNING id_chapitre',
            [nom, description, id_matiere]
        );

        res.status(201).json({ id: insertChapitre.rows[0].id_chapitre, nom, description, id_matiere });
    } catch (err) {
        console.error('Erreur lors de l’ajout du chapitre:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Supprimer un chapitre
router.delete('/api/chapters/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM competence.chapitre WHERE id_chapitre = $1', [id]);
        res.status(200).json({ message: 'Chapitre supprimé' });
    } catch (err) {
        console.error('Erreur lors de la suppression du chapitre:', err.message);
        res.status(500).json({ error: err.message });
    }
});
router.get('/api/competences/:id_chapitre', async (req, res) => {
    const { id_chapitre } = req.params;
    try {
        console.log("ID du chapitre reçu:", id_chapitre);

        const result = await pool.query(
            `SELECT c.id_competence, c.nom, c.description, c.ordre, p.valeur AS poids 
             FROM competence.competence c
             INNER JOIN competence.poids p ON c.id_poids = p.id_poids
             WHERE c.id_chapitre = $1
             `,
            [id_chapitre]
        );

        console.log("Toutes les compétences récupérées:", result.rows);
        res.json(result.rows);
    } catch (err) {
        console.error("Erreur lors de la récupération des compétences:", err.message);
        res.status(500).json({ error: err.message });
    }
});


router.post('/api/competences', verifyToken, async (req, res) => {
    const { nom, description, ordre, id_chapitre, id_poids } = req.body;
    try {
        const insertCompetence = await pool.query(
            'INSERT INTO competence.competence (nom, description, ordre, id_chapitre, id_poids) VALUES ($1, $2, $3, $4, $5) RETURNING id_competence',
            [nom, description, ordre, id_chapitre, id_poids]
        );
        res.status(201).json({ id: insertCompetence.rows[0].id_competence, nom, description, ordre, id_chapitre, id_poids });
    } catch (err) {
        console.error("Erreur lors de l’ajout de la compétence:", err.message);
        res.status(500).json({ error: err.message });
    }
});
router.delete('/api/competences',verifyToken,deleteCompetenceByName,  async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM competence.competence WHERE id_competence = $1', [id]);
        res.status(200).json({ message: 'Compétence supprimée' });
    } catch (err) {
        console.error("Erreur lors de la suppression de la compétence:", err.message);
        res.status(500).json({ error: err.message });
    }
});
// Récupérer les poids disponibles
router.get('/api/poids', verifyToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id_poids, nom, valeur FROM competence.poids ORDER BY valeur DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Erreur lors de la récupération des poids:", err.message);
        res.status(500).json({ error: err.message });
    }
});



// Ajouter une question avec propositions ou réponse


router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


// Ajouter une question avec nom, propositions ou réponse liée à une compétence
router.post('/api/questions', verifyToken, async (req, res) => {
    const { nom, texte, type, propositions, reponse, id_competence, id_poids } = req.body;

    if (!id_competence) {
        return res.status(400).json({ error: "La compétence associée est requise." });
    }

    try {
        const result = await pool.query(
            'INSERT INTO competence.question (nom, enonce, id_question_type, id_competence, id_poids) VALUES ($1, $2, $3, $4, $5) RETURNING id_question',
            [nom, texte, type, id_competence, id_poids]
        );

        const id_question = result.rows[0].id_question;

        if (type === 1 && propositions.length > 0) { // Type QCM
            for (const prop of propositions) {
                await pool.query(
                    'INSERT INTO competence.proposition (id_question, enonce, est_correcte) VALUES ($1, $2, FALSE)',
                    [id_question, prop]
                );
            }
        } else if (type === 2 && reponse) { // Type Question ouverte
            await pool.query(
                'INSERT INTO competence.reponse (id_question, reponse) VALUES ($1, $2)',
                [id_question, reponse]
            );
        }

        res.status(201).json({ message: 'Question ajoutée avec succès', id_question });
    } catch (err) {
        console.error('Erreur lors de l’ajout de la question:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;





// Récupérer toutes les questions avec leurs propositions ou réponse
router.get('/api/questions', async (req, res) => {
    try {
        const questions = await pool.query('SELECT id_question AS id, enonce AS texte, id_question_type AS type FROM competence.question');
        const data = [];

        for (const question of questions.rows) {
            let propositions = [];
            let reponse = null;

            if (question.type === 1) { // Type QCM
                const result = await pool.query(
                    'SELECT enonce FROM competence.proposition WHERE id_question = $1',
                    [question.id]
                );
                propositions = result.rows.map(row => row.enonce);
            } else if (question.type === 2) { // Type Question Ouverte
                const result = await pool.query(
                    'SELECT reponse FROM competence.reponse WHERE id_question = $1',
                    [question.id]
                );
                reponse = result.rows.length > 0 ? result.rows[0].reponse : null;
            }

            data.push({
                id: question.id,
                texte: question.texte,
                type: question.type,
                propositions,
                reponse
            });
        }

        res.json(data);
    } catch (err) {
        console.error('Erreur lors de la récupération des questions:', err.message);
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;


