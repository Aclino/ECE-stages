// Initialiser le comportement du menu déroulant
function initDropdownMenu() {
    const profileIcon = document.getElementById('profileIcon');
    const dropdownMenu = document.getElementById('dropdownMenu');

    if (profileIcon && dropdownMenu) {
        // Afficher ou masquer le menu déroulant au clic sur l'icône
        profileIcon.addEventListener('click', (event) => {
            event.stopPropagation(); // Empêche la fermeture immédiate
            const isDropdownVisible = dropdownMenu.style.display === 'block';
            dropdownMenu.style.display = isDropdownVisible ? 'none' : 'block';
        });

        // Fermer le menu déroulant si on clique en dehors
        window.addEventListener('click', () => {
            dropdownMenu.style.display = 'none';
        });
    }
}

// Vérifier la présence et la validité du token
function checkToken() {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local

    if (!token) {
        // Si le token est manquant, rediriger vers register.html
        //window.location.href = 'register.html';
        console.log('token manquant')
        return;
    }

    // Valider le token en effectuant une requête à une route protégée
    fetch('http://localhost:3000/api/utilisateur', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Inclure le token dans les en-têtes
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Token invalide ou expiré');
            }
        })
        .catch(() => {
            // Rediriger vers register.html en cas d'erreur
            window.location.href = 'register.html';
        });
}

// Fonction pour gérer la déconnexion
function handleLogout() {
    const logoutButton = document.getElementById('logoutButton');

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('token'); // Supprimer le token du stockage local
           // window.location.href = 'register.html'; // Rediriger vers la page de connexion
           console.log('tojen supprimer');
        });
    }
}

// Initialiser la vérification du token et le menu déroulant
document.addEventListener('DOMContentLoaded', () => {
    checkToken(); // Vérifier le token avant d'afficher la page
    initDropdownMenu(); // Initialiser le menu déroulant
    handleLogout(); // Initialiser la déconnexion
});