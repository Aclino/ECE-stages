//choisir le type de reponse attendue : 1 pour QCU 2 pour QCM 3 pour Question ouverte
let currentQuestionMode = 2

//les 3 formulaires possibles
const choixUniqueForm = document.getElementById("choix-unique")
const choixMultiplesForm = document.getElementById("choix-multiples")
const questionOuverteForm = document.getElementById("bulle-texte")

//les 3 types d'inputs possibles
let reponsesQCU = document.querySelectorAll("input[type = radio]")
let reponsesQCM = document.querySelectorAll("input[type = checkbox]")
let reponseQO = document.querySelectorAll("input[type = text]")

//les 3 boutons d'envoi possibles
const QCUSendBtn = document.getElementById("choix-unique-btn")
const QCMSendBtn = document.getElementById("choix-multiples-btn")
const QOSendBtn = document.getElementById("question-ouverte-btn")

//correction et question suivante
const btnQuestionSuivante = document.querySelector(".question-suivante")
const correction = document.querySelector(".correction")

//on prend les variables dont on a besoin en fonction de currentQuestionMode
let currentForm = choixUniqueForm
let currentBtn = QCUSendBtn
let currentAnswers = reponsesQCU

const indicationQCU = document.querySelector(".une-reponse")
const indicationQCM = document.querySelector(".plusieurs-reponses")

switch (currentQuestionMode){
    case 1:
        choixUniqueForm.style.display = "block"
        choixMultiplesForm.style.display = "none"
        questionOuverteForm.style.display = "none"

        QCUSendBtn.style.display = "block"
        QCMSendBtn.style.display = "none"
        QOSendBtn.style.display = "none"

        currentForm = choixUniqueForm
        currentBtn = QCUSendBtn
        currentAnswers = reponsesQCU

        indicationQCU.style.display = "block"
        indicationQCM.style.display = "none"
        break
    case 2:
        choixUniqueForm.style.display = "none"
        choixMultiplesForm.style.display = "block"
        questionOuverteForm.style.display = "none"

        QCUSendBtn.style.display = "none"
        QCMSendBtn.style.display = "block"
        QOSendBtn.style.display = "none"

        currentForm = choixMultiplesForm
        currentBtn = QCMSendBtn
        currentAnswers = reponsesQCM

        indicationQCU.style.display = "none"
        indicationQCM.style.display = "block"
        break
    case 3:
        choixUniqueForm.style.display = "none"
        choixMultiplesForm.style.display = "none"
        questionOuverteForm.style.display = "block"

        QCUSendBtn.style.display = "none"
        QCMSendBtn.style.display = "none"
        QOSendBtn.style.display = "block"

        currentForm = questionOuverteForm
        currentBtn = QOSendBtn
        currentAnswers = reponseQO

        indicationQCU.style.display = "none"
        indicationQCM.style.display = "none"
        break
    default:
        choixUniqueForm.style.display = "none"
        choixMultiplesForm.style.display = "none"
        questionOuverteForm.style.display = "none"

        QCUSendBtn.style.display = "none"
        QCMSendBtn.style.display = "none"
        QOSendBtn.style.display = "block"

        indicationQCU.style.display = "none"
        indicationQCM.style.display = "none"

        break
}

function envoyerFormulaire(btnQuestionSuivante, correction, currentAnswers){
    btnQuestionSuivante.style.display = "block"
    correction.style.display = "block"
}

function afficherReponses(currentAnswers, currentQuestionMode){
    let answerIsValid = false
    switch (currentQuestionMode){
        case 1: //radio answers
            for (let i = 0; i < currentAnswers.length; i++){
                if (currentAnswers[i].checked){
                    console.log(currentAnswers[i].value)
                    answerIsValid = true
                }
            }
            break
        case 2: //checkbox answers
            for (let i = 0; i < currentAnswers.length; i ++){
                if (currentAnswers[i].checked){
                    console.log(currentAnswers[i].value)
                    answerIsValid = true
                }
            }
            break
        case 3: //question ouverte
            for (let i = 0; i < currentAnswers.length; i ++){
                if (currentAnswers[i].value !== ""){
                    console.log(currentAnswers[i].value)
                    answerIsValid = true
                }
            }
            break
        default:
            break
    }

    return answerIsValid
}

currentForm.addEventListener("submit", (event) => {
    const messageErreur = document.querySelector(".erreur-reponse")
    event.preventDefault()
    if (afficherReponses(currentAnswers, currentQuestionMode)){
        messageErreur.style.display = "none"
        if (currentQuestionMode === 3){
            const boiteDialogue = document.getElementById("questionOuverte-reponse")
            boiteDialogue.value= ""
        }

        envoyerFormulaire(btnQuestionSuivante, correction)
    } else {
        messageErreur.style.display = "block"
    }
})

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



