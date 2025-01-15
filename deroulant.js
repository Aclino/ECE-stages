
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
        const matiereMenu = document.querySelector('.menu ul');
       //console.log(matiereMenu);
        //const competenceMenu = doc.querySelector('.submenu-content');

        // Affichage des matières
        data.matieres.forEach((matiere) => {
            if(!document.querySelector('.'+matiere.nom)){
            const li = document.createElement('li');
            li.classList.add('menu-item');
            li.innerHTML = `<span class="${matiere.nom} ">${matiere.nom} <span class="icon">▶</span> </span>
            <ul class="chapitre"></ul>`;
            matiereMenu.appendChild(li);
           // console.log(document.querySelector(`.chapitre`));
            const chapitreMenu = document.querySelector('.'+matiere.nom);
          // console.log(chapitreMenu);
        }

        });  

      
        
         data.joins.forEach( (chapitre) => {
            const chapitreMenu = document.querySelector(`.${chapitre.matiere_nom}`); //console.log(chapitreMenu);
           const competence= chapitreMenu.nextElementSibling;
           
            const li = document.createElement('li');
            li.classList.add('chapitre-item');
            li.innerHTML = `<span class="${chapitre.chapitre_nom}">${chapitre.chapitre_nom} <span class="icon">▶</span> </span>
            <ul class="competence"></ul>`;
            competence.appendChild(li);


        });
        
        
       


        // Affichage des compétences
        data.joins.forEach((competence) => {
            const competenceMenu = document.querySelector(` .${competence.chapitre_nom}`);// console.log(competenceMenu);
           const exercice= competenceMenu.nextElementSibling;
           
            const li = document.createElement('li');
            li.classList.add('competence-item');
            li.innerHTML = `<span>${competence.competence_nom} <span class="icon">▶</span> </span>
            <ul class="exercice"></ul>`;
            exercice.appendChild(li);
        });
        


        THECLICK();
       /* document.querySelectorAll('span').forEach(span => {
            span.textContent=span.textContent.replace("<span class="icon">▼</span> ","");
          });*/
          
    } catch (error) {
        console.error("Erreur lors de l'affichage des données :", error);
    }
}

// Charger les données au chargement de la page
document.addEventListener('DOMContentLoaded', fetchAndDisplayData);


//** */ Gestion du menu principal "Matière"
async function THECLICK(){
    const menuItems = document.querySelectorAll('.menu-item > span');
menuItems.forEach((menuItem) => {
    menuItem.addEventListener('click', () => {
        const submenu = menuItem.nextElementSibling;
        
        if (submenu) {
            submenu.classList.toggle('open');

        }
        const icon = menuItem.querySelector('.icon'); 
        console.log(icon)// Sélectionne l'icône dans le menu
        if (icon) {
            icon.classList.toggle('rotate-45');
        }
    });
});

const chapitreItems = document.querySelectorAll('.chapitre-item > span');//console.log( document.querySelectorAll('.chapitre-item > span'));
chapitreItems.forEach((chapitreItem) => {
    chapitreItem.addEventListener('click', (event) => {
        event.stopPropagation(); // Empêche la propagation
        const competence = chapitreItem.nextElementSibling;

        if (competence) {
            competence.classList.toggle('open');
        }
        const icon = chapitreItem.querySelector('.icon'); 
        console.log(icon)// Sélectionne l'icône dans le menu
        if (icon) {
            icon.classList.toggle('rotate-45');
        }
    });
});
const competenceItems = document.querySelectorAll('.competence-item > span');
competenceItems.forEach((competenceItem) => {
    competenceItem.addEventListener('click', (event) => {
        event.stopPropagation(); // Empêche la propagation

        
        const exercice = competenceItem.nextElementSibling;
        if (exercice) {
           
            exercice.classList.toggle('open');
        }
        const icon = competenceItem.querySelector('.icon'); 
        console.log(icon)// Sélectionne l'icône dans le menu
        if (icon) {
            icon.classList.toggle('rotate-45');
        }
    });
});console.log(document.querySelectorAll('.chapitre-item,.competence'));
document.querySelectorAll('chapitre-item').forEach((menuItem) => {
    menuItem.addEventListener('click', () => {
        const icon = menuItem.querySelector('.icon'); 
        console.log(icon)// Sélectionne l'icône dans le menu
        if (icon) {
            icon.classList.toggle('rotate-45');
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


}
document.addEventListener('DOMContentLoaded', THECLICK);
// Gestion des sous-menus
