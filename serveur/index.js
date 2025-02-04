require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('/Users/ismaelsaid/Documents/ECE-stages-1/serveur/db');

const utilisateur = require('./utilisateur/utilisateur');
const connexion = require('./connexion/connexion');
const cours = require('./cours/cours');
const prof = require('./utilisateur/prof/prof');
const eleve = require('/Users/ismaelsaid/Documents/ECE-stages-1/serveur/utilisateur/eleve/eleve');
const app = express();
const PORT = process.env.PORT || 3001;

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

// Routes
app.use(connexion);
app.use(utilisateur);
app.use(cours);
app.use(prof);
app.use(eleve);

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Le serveur est démarré sur http://localhost:${PORT}`);
});
