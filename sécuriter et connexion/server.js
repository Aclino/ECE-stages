const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');
const bcrypt = require('bcrypt'); // Import de bcrypt pour le hachage des mots de passe
const jwt = require('jsonwebtoken'); // Importer jsonwebtoken

const SECRET_KEY = "votre_clé_secrète"; // À remplacer par une clé secrète sécurisée

const app = express();
const PORT = 3000;

app.use(bodyParser.json()); // Pour prendre en charge les corps JSON
app.use(bodyParser.urlencoded({ extended: true })); // Pour prendre en charge les corps URL-encodés

// Middleware pour CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"); // Ajout de Authorization
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Autoriser les méthodes nécessaires
    next();
});


//Middleware de vérification :
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Récupérer le token depuis l'en-tête Authorization

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

// Route pour récupérer tous les utilisateurs
app.get('/api/utilisateur', async (req, res) => {
    try {
        const query = 'SELECT * FROM stageproject.utilisateur';
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
});

// Route pour ajouter un utilisateur avec hachage du mot de passe, vérification de l'email et gestion des rôles
app.post('/api/utilisateur', async (req, res) => {
    try {
        const { nom, email, mot_de_passe } = req.body;

        if (!nom || !email || !mot_de_passe) {
            return res.status(400).json({ error: 'Les champs nom, email et mot_de_passe sont requis.' });
        }

        // Vérifier si l'email existe déjà dans la base de données
        const emailCheckQuery = 'SELECT * FROM stageproject.utilisateur WHERE email = $1';
        const emailCheckResult = await pool.query(emailCheckQuery, [email]);

        if (emailCheckResult.rows.length > 0) {
            return res.status(409).json({ error: 'Cet email est déjà utilisé.' }); // Code 409 : Conflit
        }

        // Hachage du mot de passe avec bcrypt
        const saltRounds = 10; // Facteur de coût pour bcrypt
        const motDePasseHache = await bcrypt.hash(mot_de_passe, saltRounds);

        // Insertion de l'utilisateur dans la table utilisateur
        const query = `
            INSERT INTO stageproject.utilisateur (nom, email, mot_de_passe) 
            VALUES ($1, $2, $3)
            RETURNING id_utilisateur;
        `;
        const values = [nom, email, motDePasseHache];

        const result = await pool.query(query, values);

        //Recuperation de l'id_utilisateur
        const query2 = 'SELECT id_utilisateur FROM stageproject.utilisateur WHERE email = $1';
        const utilisateurResult = await pool.query(query2, [email]);
        const utilisateurId = utilisateurResult.rows[0].id_utilisateur;

        // Définir le rôle en fonction du domaine de l'email
        let idRole = 3; // Rôle par défaut
        if (email.endsWith('@ece.fr')) {
            idRole = 2; // Rôle spécifique pour @ece.fr
        }

        // Insérer le rôle dans la table role_assignment
        const roleQuery = `
            INSERT INTO stageproject.role_assignement (id_utilisateur, id_role)
            VALUES ($1, $2);
        `;
        await pool.query(roleQuery, [utilisateurId, idRole]);

        res.status(201).json({
            message: 'Utilisateur créé avec succès avec le rôle attribué.',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'utilisateur.' });
    }
});

// Route pour gérer la connexion d'un utilisateur
app.post('/api/login', async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;

        if (!email || !mot_de_passe) {
            return res.status(400).json({ error: 'Les champs email et mot de passe sont requis.' });
        }

        // Vérification si l'utilisateur existe dans la base de données
        const query = 'SELECT * FROM stageproject.utilisateur WHERE email = $1';
        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
        }

        const utilisateur = result.rows[0];

        // Comparer le mot de passe avec celui haché dans la base de données
        const motDePasseValide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);

        if (!motDePasseValide) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
        }
        // Générer un token JWT
        const token = jwt.sign(
            { id: utilisateur.id_utilisateur, email: utilisateur.email }, // Payload
            SECRET_KEY, // Clé secrète
            { expiresIn: '2h' } // Expiration
        );

        // Réponse en cas de succès
        res.status(200).json({
            message: 'Connexion réussie.',
            token: token, // Inclure le token dans la réponse
            utilisateur: {
                id: utilisateur.id,
                nom: utilisateur.nom,
                email: utilisateur.email,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la connexion.' });
    }
});

// Exemple de route protégée
app.get('/api/profil', authenticateToken, (req, res) => {
    res.json({ message: `Bienvenue sur votre profil, utilisateur ${req.user.email}` });
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
