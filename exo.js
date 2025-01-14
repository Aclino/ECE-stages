document.addEventListener("DOMContentLoaded", function () {
    const validerButtons = document.querySelectorAll(".send-button");
    const questionSuivante = document.querySelector(".question-suivante");

    validerButtons.forEach((button) => {
        button.addEventListener("click", function (event) {
            event.preventDefault(); // On empêche le rechargement

            const formId = button.getAttribute("form"); // Récupère l'ID du formulaire
            const form = document.getElementById(formId); // Sélectionne le formulaire
            const correction = document.querySelector(".correction");

            if (form) {
                const formData = new FormData(form); // Récupère les données du formulaire

                // Simule l'envoi des données
                console.log("Données du formulaire envoyées :");
                for (let [key, value] of formData.entries()) {
                    console.log(key, value);
                }

                // Si tout va bien, on cache les boutons "Valider"
                validerButtons.forEach((btn) => (btn.style.display = "none"));
                questionSuivante.style.display = "block";
                correction.style.display = "block";
            } else {
                console.error("Formulaire introuvable pour le bouton !");
            }
        });
    });
});

// document.querySelectorAll('.send-button').forEach(button => {
//     button.addEventListener('click', function (event) {
//         // Récupère le formulaire lié au bouton
//         const formId = button.getAttribute('form');
//         const form = document.getElementById(formId);
//         const correction = document.querySelector(".correction");

//         // Vérifie si une réponse est sélectionnée ou saisie
//         let isValid = false;

//         if (form) {
//             // Vérifie les types de champs
//             const inputs = form.querySelectorAll('input');
//             inputs.forEach(input => {
//                 if (
//                     (input.type === 'radio' || input.type === 'checkbox') && input.checked
//                 ) {
//                     isValid = true; // Un bouton est coché
//                 } else if (input.type === 'text' && input.value.trim() !== '') {
//                     isValid = true; // Un texte est saisi
//                 }
//             });
//         }

//         // Si aucune réponse, empêche l'envoi du formulaire et affiche un message
//         if (!isValid) {
//             event.preventDefault();
//             alert('Veuillez répondre à la question avant de valider !');
//             return;
//         }

//         // Si tout va bien, on continue
//         event.preventDefault(); // Empêche le rechargement automatique
//         button.style.display = 'none'; // Cache le bouton actuel
//         correction.style.display = "block"; //Affiche la correction
//         document.querySelector('.question-suivante').style.display = 'block'; // Affiche le bouton suivant
//         console.log('Formulaire soumis avec succès !');
//     });
// });



//Si tu tiens à envoyer le formulaire directement et à le laisser gérer 
// tout seul son comportement, une autre approche serait d'attendre un court délai avant de cacher le bouton, comme ceci :
// button.addEventListener("click", function (event) {
//     setTimeout(() => {
//         validerButtons.forEach((btn) => (btn.style.display = "none"));
//         questionSuivante.style.display = "block";
//     }, 100); // Attendre 100 ms
// });


