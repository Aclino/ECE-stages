const { Pool } = require('pg');

// Configuration de la connexion (chaîne par défaut)
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'azerty',//penser a changer le mdp
    port: 5432
});

module.exports = pool;
