require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcryptjs'); // Import de bcrypt pour le hachage des mots de passe
const jwt = require('jsonwebtoken'); // Importer jsonwebtoken
const SECRET_KEY = "votre_clé_secrète";
const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(PORT, () => {
    console.log(`Le serveur est démarré sur http://localhost:${PORT}`);
});
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"); // Ajout de Authorization
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Autoriser les méthodes nécessaires
  next();
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

        // Envoyer une réponse combinée au frontend
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
///////////////////////////////////////////////////////////////////////////////
                        //Pour la page inscription//
///////////////////////////////////////////////////////////////////////////////







// Middleware pour vérifier le token JWT
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Accès non autorisé.' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token invalide.' });
        }
        req.user = user; // Ajouter les données du token à la requête
        next();
    });
}

// ✅ Route pour récupérer l'utilisateur connecté
app.get('/api/utilisateur', authenticateToken, async (req, res) => {
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

// ✅ Route pour l'inscription d'un utilisateur
app.post('/api/utilisateur', async (req, res) => {
    try {
        const { nom, prenom, email, mot_de_passe } = req.body;

        if (!nom || !prenom || !email || !mot_de_passe) {
            return res.status(400).json({ error: 'Tous les champs sont requis.' });
        }

        const emailCheckQuery = 'SELECT * FROM competence.utilisateur WHERE email = $1';
        const emailCheckResult = await pool.query(emailCheckQuery, [email]);

        if (emailCheckResult.rows.length > 0) {
            return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
        }

        const motDePasseHache = await bcrypt.hash(mot_de_passe, 10);

        const query = `
            INSERT INTO competence.utilisateur (nom, prenom, email, mot_de_passe) 
            VALUES ($1, $2, $3, $4)
            RETURNING id_utilisateur;
        `;
        const result = await pool.query(query, [nom, prenom, email, motDePasseHache]);

        res.status(201).json({ message: 'Utilisateur créé avec succès.', utilisateurId: result.rows[0].id_utilisateur });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'utilisateur.' });
    }
});

// ✅ Route pour la connexion
app.post('/api/login', async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;

        if (!email || !mot_de_passe) {
            return res.status(400).json({ error: 'Email et mot de passe requis.' });
        }

        const query = 'SELECT * FROM competence.utilisateur WHERE email = $1';
        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
        }

        const utilisateur = result.rows[0];

        const motDePasseValide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
        if (!motDePasseValide) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
        }

        const token = jwt.sign(
            { id: utilisateur.id_utilisateur, email: utilisateur.email },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Connexion réussie.',
            token,
            utilisateur: {
                id_utilisateur: utilisateur.id_utilisateur,
                nom: utilisateur.nom,
                prenom: utilisateur.prenom,
                email: utilisateur.email,
            },
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la connexion.' });
    }
});


///////////////////////////////////////////////////////////////////////////////
                        //Pour la page connexion//
///////////////////////////////////////////////////////////////////////////////



                        //     Page exercices      //
///////////////////////////////////////////////////////////////////////////////

app.get('/api/exos',async(req, res) => {
    try {
        const queryExo = " SELECT q.id_question,q.nom AS question_nom, q.enonce AS question_enonce,qt.nom AS question_type,  m.nom AS matiere_nom,  c.nom AS chapitre_nom,  c.description AS chapitre_description,  p.enonce AS proposition_enonce,  p.explication AS proposition_explication,  p.est_correcte AS proposition_est_correcte, r.reponse AS reponse_correcte, r.explication AS reponse_explication, comp.nom AS competence_nom,  comp.description AS competence_description FROM competence.Question q JOIN competence.Question_type qt ON q.id_question_type = qt.id_question_type JOIN competence.Competence comp ON q.id_competence = comp.id_competence JOIN competence.Chapitre c ON comp.id_chapitre = c.id_chapitre JOIN competence.Matiere m ON c.id_matiere = m.id_matiere LEFT JOIN competence.Proposition p ON q.id_question = p.id_question LEFT JOIN competence.Reponse r ON q.id_question = r.id_question WHERE m.nom  ILIKE '%math%';"

        const resultExo = await pool.query(queryExo)

        res.json({
            exo: resultExo.rows
        })
    } catch (err) {
        console.error("Erreur interne :", err)
        res.status(500).json({ error: 'Erreur interne du serveur' })
    }
})

///////////////////////////////////////////////////////////////////////////////

