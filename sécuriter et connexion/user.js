const pool = require('./db');

// Fonction pour récupérer tous les jeux
const getAllUsers = async () => {
    const query = 'Select * FROM stageproject.utilisateur';
    const result = await pool.query(query);
    return result.rows;
};

module.exports = {
    getAllUsers
};