require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "votre_clé_secrète";
const router = express.Router();

router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Middleware CORS et autorisations
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

// ✅ Route pour la connexion
router.post('/api/login', async (req, res) => {
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
            { expiresIn: '10h' }
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

// ✅ Route pour l'inscription d'un utilisateur
router.post('/api/inscription', async (req, res) => {
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

// ✅ Route pour récupérer les informations de l'utilisateur à partir du JWT avec la promotion
router.get('/api/utilisateur', async (req, res) => {
    try {
        console.log("Headers reçus:", req.headers);
        
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            
            return res.status(401).json({ error: 'Token manquant.' });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("Token décodé:", decoded);
        
        const query = `
            SELECT u.nom, u.prenom, u.email, p.nom AS promo 
            FROM competence.utilisateur u
            LEFT JOIN competence.utilisateur_assignement ua ON u.id_utilisateur = ua.id_utilisateur
            LEFT JOIN competence.promotion p ON ua.id_promotion = p.id_promotion
            WHERE u.id_utilisateur = $1
        `;
        const result = await pool.query(query, [decoded.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Erreur backend:", err);
        res.status(500).json({ error: 'Erreur lors de la récupération des informations utilisateur.' });
    }
});


module.exports = router;
