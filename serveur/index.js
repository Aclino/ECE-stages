require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(PORT, () => {
    console.log(`Le serveur est démarré sur http://localhost:${PORT}`);
});
////////////////////////////////////////////////////////////////////////////////
app.get('/api/matiere', async (req, res) => {
    try {
        // Requête pour récupérer toutes les matières
        const queryMat = 'SELECT * FROM competence.matiere';
        const resultMat = await pool.query(queryMat);

        // Requête pour récupérer tous les chapitres
        const queryChap = 'SELECT * FROM competence.chapitre';
        const resultChap = await pool.query(queryChap);

        // Requête pour récupérer toutes les compétences
        const queryComp = 'SELECT * FROM competence.competence';
        const resultComp = await pool.query(queryComp);

       const queryJoin = 'SELECT c.id_competence,c.nom AS competence_nom,c.description AS competence_description,c.ordre AS competence_ordre,ch.id_chapitre,ch.nom AS chapitre_nom,ch.description AS chapitre_description,ch.ordre AS chapitre_ordre,m.id_matiere,m.nom AS matiere_nom FROM competence.competence c INNER JOIN competence.chapitre ch ON c.id_chapitre = ch.id_chapitre INNER JOIN competence.matiere m ON ch.id_matiere = m.id_matiere';
        const resultJoin = await pool.query(queryJoin);

        // Envoyer une réponse combinée au frontend
        res.json({
            matieres: resultMat.rows,
            joins: resultJoin.rows,
        });
    } catch (err) {
        console.error("Erreur interne :", err);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});
///////////////////////////////////////////////////////////////////////////////
                        //Pour la page inscription//
///////////////////////////////////////////////////////////////////////////////
// Route pour ajouter un utilisateur
app.post('/api/inscription', (req, res) => {
    const { email, nom, prenom, code, password } = req.body;
  
    // Vérifier si l'email existe déjà dans la base de données
    const checkEmailQuery = 'SELECT * FROM Utilisateur WHERE email = ?';
    connection.query(checkEmailQuery, [email], (err, results) => {
      if (err) {
        res.status(500).json({ success: false, message: 'Erreur de vérification de l\'email' });
        return;
      }///////////////////////////////////PAS FINI/////////////////////////////////////
  
      if (results.length > 0) {
        res.status(400).json({ success: false, message: 'Cet email est déjà utilisé' });
        return;
      }
  
      // Si l'email est unique, insérer l'utilisateur dans la base de données
      const insertQuery = 'INSERT INTO Utilisateur (email, nom, prenom, code_inscription, mot_de_passe) VALUES (?, ?, ?, ?, ?)';
      connection.query(insertQuery, [email, nom, prenom, code, password], (err, result) => {
        if (err) {
          res.status(500).json({ success: false, message: 'Erreur lors de l\'ajout de l\'utilisateur' });
          return;
        }
  
        res.status(200).json({ success: true, message: 'Utilisateur ajouté avec succès' });
      });
    });
  });
///////////////////////////////////////////////////////////////////////////////
                        //Pour la page connexion//
///////////////////////////////////////////////////////////////////////////////
