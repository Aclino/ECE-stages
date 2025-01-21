//choisir le type de reponse attendue : 1 pour QCU 2 pour QCM 3 pour Question ouverte
let currentQuestionMode = 0

//correction et question suivante
const btnQuestionSuivante = document.querySelector(".question-suivante")




function setCurrentInputType(data){
    let inputType = ""

    switch (data.exo[0].question_type){
        case "QCU":
            currentQuestionMode = 1
            inputType = "radio"
            break
        case "QCM":
            currentQuestionMode = 2
            inputType = "checkbox"
            break
        case "Question Ouverte":
            currentQuestionMode = 3
            inputType = "text"
            break
        default:
            currentQuestionMode = 0
            break
    }

    return inputType
}

function verifierReponses(currentAnswers, data, currentQuestionMode){
    let propositionsBonnes = []
    switch (currentQuestionMode){
        case 1:
            for (let i = 0; i < currentAnswers.length; i ++){
                if (currentAnswers[i].checked === data.exo[i].proposition_est_correcte){
                    propositionsBonnes.push(true)
                } else {
                    propositionsBonnes.push(false)
                }
            }
            break
        case 2:
            for (let i = 0; i < currentAnswers.length; i ++){
                if (currentAnswers[i].checked === data.exo[i].proposition_est_correcte){
                    propositionsBonnes.push(true)
                } else {
                    propositionsBonnes.push(false)
                }
            }
            break
        case 3:
            if (currentAnswers[0].value === data.exo[0].reponse_correcte){
                propositionsBonnes.push(true)
            } else {
                propositionsBonnes.push(false)
            }
            break
    }
    let reponseBonne = propositionsBonnes.every(a => a === true)
    return(reponseBonne)
}

function checkAnswers(currentAnswers, currentQuestionMode){
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

function afficherCorrection(data, correction, btnQuestionSuivante, sendButton){
    let newCorrection = '<h3>Correction :</h3><p>'
    for (let i = 0; i < data.exo.length; i++){
        newCorrection+= `
            ${i + 1}: ${data.exo[i].proposition_explication}
            <br>
        `
    }

    correction.innerHTML = newCorrection
    correction.style.display = "block"
    btnQuestionSuivante.style.display = "block"
    sendButton.style.display = "none"
}


async function recupDataExo(){
    try {
        const response = await fetch('http://localhost:3021/api/exos')

        if (!response.ok) throw new Error('Erreur lors de la récupération des données.')

        const data = await response.json()

        //A SUPPRIMER PLUS TARD
        console.log("Données reçues: ", data);

//barre à gauche avec les infos

        document.querySelector(".infos h1").innerText = data.exo[0].matiere_nom
        document.querySelector(".infos h2").innerText = data.exo[0].chapitre_nom
        document.querySelector(".infos h3").innerText = data.exo[0].competence_nom

//afficher le bon type de question et recup le type d'input

        let inputType = setCurrentInputType(data)

//afficher l'énoncé

        let classEnonce = document.querySelector(".enonce")
        let enonce = `
            <h2>${data.exo[0].question_nom} - ${data.exo[0].question_enoncer}</h2>
        `
        if (inputType === "radio"){
            enonce += `
                <h4>Une seule réponse possible</h4>
            `
        } else if (inputType === "checkbox"){
            enonce += `
                <h4>Plusieurs réponses possibles</h4>
            `
        }
        classEnonce.innerHTML = enonce

//afficher les reponses possibles
        let newForm = `<form id = form action = "" method = "get">`

        if (inputType ===  "text"){
            for (let i = 0; i < data.exo.length; i++){
                newForm += `
                <label for = "reponse${i}">
                    <input type = "${inputType}" id = "reponse${i}" name = "question" value = ""> ${data.exo[i].proposition_enoncer}
                </label>
                <br>
            `

            }
        } else {
            for (let i = 0; i < data.exo.length; i++){
                newForm += `
                <label for = "reponse${i}">
                    <input type = "${inputType}" id = "reponse${i}" name = "question" value = "${data.exo[i].proposition_enoncer}"> ${data.exo[i].proposition_enoncer}
                </label>
                <br>
            `
            }
        }


        newForm+= `</form>`
        const formulaireAdd = document.querySelector(".reponse")
        formulaireAdd.innerHTML = newForm

//config du bon bouton d'envoi du form
        const sendButton = document.getElementById("bouton")
        sendButton.setAttribute("form", "form")

//quand le formulaire est envoyé :
        const currentForm = document.getElementById("form")
        currentForm.addEventListener("submit", (event) => {
            const messageErreur = document.querySelector(".erreur-reponse")
            event.preventDefault()
            let currentAnswers = document.querySelectorAll("#form input")
            formulaireAdd.style.display = "none"
            console.log(currentAnswers)

            if (checkAnswers(currentAnswers, currentQuestionMode)){
                messageErreur.style.display = "none"

                const correction = document.querySelector(".correction")
                afficherCorrection(data, correction, btnQuestionSuivante, sendButton)

                if (verifierReponses(currentAnswers,data,currentQuestionMode)){
                    document.querySelector(".resultat h3").innerText = "Bravo ! Vous avez trouvé la bonne réponse !"
                } else {
                    document.querySelector(".resultat h3").innerText = "Dommage, vous n'avez pas trouvé la bonne réponse."
                }
                document.querySelector(".resultat").style.display = "block"

                if (currentQuestionMode === 3){
                    const boiteDialogue = document.getElementById("reponse0")
                    boiteDialogue.value = ""
                }
            } else {
                messageErreur.style.display = "block"
            }
        })

    } catch (error) {
        console.error("Erreur lors de l'affichage des données :", error);
    }

}

document.addEventListener('DOMContentLoaded', recupDataExo)













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



