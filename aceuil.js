//** */ Gestion du menu principal "Matière"
const menuItems = document.querySelectorAll('.menu-item > span');
menuItems.forEach((menuItem) => {
    menuItem.addEventListener('click', () => {
        const submenu = menuItem.nextElementSibling;
        if (submenu) {
            submenu.classList.toggle('open');
        }
    });
});

// Gestion des sous-menus
const submenuItems = document.querySelectorAll('.submenu-item > span');
submenuItems.forEach((submenuItem) => {
    submenuItem.addEventListener('click', (event) => {
        event.stopPropagation(); // Empêche la propagation
        const submenuContent = submenuItem.nextElementSibling;
        if (submenuContent) {
            submenuContent.classList.toggle('open');
        }
    });
});

// Fermer tous les menus si on clique ailleurs
document.addEventListener('click', (event) => {
    if (!event.target.closest('.menu')) {
        document.querySelectorAll('.submenu, .submenu-content').forEach((submenu) => {
            submenu.classList.remove('open');
        });
    }
});
async function fetchAndDisplayData() {
    try {
        const response = await fetch('http://localhost:3001/api/matiere', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Erreur lors de la récupération des données.');

        const data = await response.json();
        console.log("Données reçues :", data);

        // Sélection des sous-menus pour injecter les données
        const matiereMenu = document.querySelector('.menu .submenu');
        const chapitreMenu = document.querySelector('.submenu-content');
        const competenceMenu = chapitreMenu.querySelector('.submenu-content');

        // Affichage des matières
        data.matieres.forEach((matiere) => {
            const li = document.createElement('li');
            li.classList.add('submenu-item');
            li.innerHTML = `<span>${matiere.nom} ▼</span>`;
            matiereMenu.appendChild(li);
        });

        // Affichage des chapitres
        data.chapitres.forEach((chapitre) => {
            const li = document.createElement('li');
            li.classList.add('submenu-item');
            li.innerHTML = `<span>${chapitre.nom} ▼</span>`;
            chapitreMenu.appendChild(li);
        });

        // Affichage des compétences
        data.competences.forEach((competence) => {
            const li = document.createElement('li');
            li.classList.add('submenu-item');
            li.innerHTML = `<span>${competence.nom}</span>`;
            competenceMenu.appendChild(li);
        });

    } catch (error) {
        console.error("Erreur lors de l'affichage des données :", error);
    }
}

// Charger les données au chargement de la page
document.addEventListener('DOMContentLoaded', fetchAndDisplayData);



