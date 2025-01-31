require('dotenv').config();
const express = require('express');
const pool = require('../db'); // Assurez-vous que le fichier db.js est bien configuré
const router = express.Router();

// ✅ Route pour récupérer toutes les matières, chapitres et compétences
router.get('/api/matiere', async (req, res) => {
    try {
        const queryMat = 'SELECT * FROM competence.matiere';
        const resultMat = await pool.query(queryMat);

        const queryChap = 'SELECT * FROM competence.chapitre';
        const resultChap = await pool.query(queryChap);

        const queryComp = 'SELECT * FROM competence.competence';
        const resultComp = await pool.query(queryComp);

        res.json({
            matieres: resultMat.rows,
            chapitres: resultChap.rows,
            competences: resultComp.rows,
        });
    } catch (err) {
        console.error("Erreur interne :", err);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

// ✅ Route pour récupérer les exercices liés aux maths
// Route pour récupérer un exercice par ID
router.get('/api/exos', async (req, res) => {
    try {
        // Récupérer l'ID depuis l'URL
        const id = req.query.id;

        if (!id) {
            return res.status(400).json({ error: 'ID manquant dans la requête.' });
        }

        // Requête SQL pour récupérer l'exercice avec un seul ID
        const queryExo = `
            SELECT 
                q.id_question,
                q.nom AS question_nom,
                q.enonce AS question_enonce,
                qt.nom AS question_type,
                m.nom AS matiere_nom,
                c.nom AS chapitre_nom,
                c.description AS chapitre_description,
                p.enonce AS proposition_enonce,
                p.explication AS proposition_explication,
                p.est_correcte AS proposition_est_correcte,
                r.reponse AS reponse_correcte,
                r.explication AS reponse_explication,
                comp.nom AS competence_nom,
                comp.description AS competence_description
            FROM competence.Question q
            JOIN competence.Question_type qt ON q.id_question_type = qt.id_question_type
            JOIN competence.Competence comp ON q.id_competence = comp.id_competence
            JOIN competence.Chapitre c ON comp.id_chapitre = c.id_chapitre
            JOIN competence.Matiere m ON c.id_matiere = m.id_matiere
            LEFT JOIN competence.Proposition p ON q.id_question = p.id_question
            LEFT JOIN competence.Reponse r ON q.id_question = r.id_question
            WHERE q.id_question = $1;
        `;

        // On passe l'ID à la requête SQL
        const resultExo = await pool.query(queryExo, [id]);

        res.json({
            exo: resultExo.rows
        });
    } catch (err) {
        console.error("Erreur interne :", err);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

router.get('/api/exos/matiere', async (req, res) => { 
    try {
        console.log("Requête reçue :", req.query.count); 
        let query;
        
        const matiere = req.query.matiere || 'Mathématiques';
        console.log("Matière reçue :", matiere); 
        
        let rows;
        switch(Number(req.query.count)){ // Convertir en nombre pour éviter les erreurs
            case 1:        
                query = `
                    SELECT q.id_question
                    FROM competence.Question q
                    JOIN competence.Competence c ON q.id_competence = c.id_competence
                    JOIN competence.Chapitre ch ON c.id_chapitre = ch.id_chapitre
                    JOIN competence.Matiere m ON ch.id_matiere = m.id_matiere
                    WHERE m.nom = $1 
                    ORDER BY RANDOM()
                    LIMIT 20;
                `;
                rows = await pool.query(query, [matiere]);
                break;

            case 2:            
                query = `
                    SELECT q.id_question
                    FROM competence.Question q
                    JOIN competence.Competence c ON q.id_competence = c.id_competence
                    JOIN competence.Chapitre ch ON c.id_chapitre = ch.id_chapitre
                    JOIN competence.Matiere m ON ch.id_matiere = m.id_matiere
                    WHERE ch.nom = $1 
                    ORDER BY RANDOM()
                    LIMIT 20;
                `;
                rows = await pool.query(query, [matiere]);
                break;

            case 3:            
                query = `
                    SELECT q.id_question
                    FROM competence.Question q
                    JOIN competence.Competence c ON q.id_competence = c.id_competence
                    JOIN competence.Chapitre ch ON c.id_chapitre = ch.id_chapitre
                    JOIN competence.Matiere m ON ch.id_matiere = m.id_matiere
                    WHERE c.nom = $1 
                    ORDER BY RANDOM()
                    LIMIT 20;
                `;
                rows = await pool.query(query, [matiere]);
                break;

            default:
                return res.status(400).json({ error: "Valeur de 'count' invalide" });
        }

        console.log("Résultat SQL :", rows.rows); 

        const questionIds = rows.rows.map(row => row.id_question);
        const urlWithIds = `/api/exos/questions/${questionIds.join(',')}`;

        res.json({ url: urlWithIds, ids: questionIds });
        
    } catch (err) {
        console.error("❌ ERREUR SQL :", err.message);
        res.status(500).json({ error: err.message });
    }
});



router.get('/api/exos/questions/:ids', async (req, res) => {
    try {
        const ids = req.params.ids.split(',').map(Number); // Convertir en tableau de nombres
        const query = `SELECT * FROM competence.question WHERE id_question = ANY($1)`;
        const { rows } = await pool.query(query, [ids]);

        res.json(rows);
    } catch (err) {
        console.error("Erreur interne :", err);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});
module.exports = router;
