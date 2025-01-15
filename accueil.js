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

// Appeler la fonction au chargement de la page
document.addEventListener('DOMContentLoaded', initDropdownMenu);
