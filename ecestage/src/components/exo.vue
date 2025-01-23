<script setup>
import { ref, onMounted } from 'vue';

let enonce = ref('Nom question - Enoncé')
let inputType = ref('')
let currentQuestionMode = ref('')
let reponses = ref([])

let userAnswers = ref([]);
let showError = ref(false);
let resultMessage = ref('')
let showResult = ref(false);

async function fetchAndDisplayData() {
  try {

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/exos`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Erreur lors de la récupération des données.')

    const data = await response.json()

    enonce.value = data.exo[0].question_nom + " - " + data.exo[0].question_enonce

    reponses.value = data.exo

    switch (data.exo[0].question_type){
        case "QCU":
            currentQuestionMode.value = 1
            inputType.value = "radio"
            break
        case "QCM":
            currentQuestionMode.value = 2
            inputType.value = "checkbox"
            break
        case "Question Ouverte":
            currentQuestionMode.value = 3
            inputType.value = "text"
            break
        default:
            currentQuestionMode.value = 0
            break
    }
    
  } catch (error) {
    console.error('Erreur lors de l\'affichage des données :', error);
  }
}

function validateForm(answers) {
    return Array.isArray(answers) ? answers.length > 0 : answers.trim() !== "";
}

function checkAnswers(answers, reponses) {
    let propositionsBonnes = [];
    
    switch (currentQuestionMode.value) {
        case 1:
        case 2:
            for (let i = 0; i < reponses.length; i++) {
                const isChecked = answers.includes(reponses[i].proposition_enonce);
                
                if (isChecked === reponses[i].proposition_est_correcte) {
                    propositionsBonnes.push(true);
                } else {
                    propositionsBonnes.push(false);
                }
            }
            break;

        case 3:
            if (answers === reponses[0].proposition_enonce) {
                propositionsBonnes.push(true);
            } else {
                propositionsBonnes.push(false);
            }
        break;
    }
    return propositionsBonnes.every(a => a === true);
}

function onSubmit() {
    showError.value = false;
    showResult.value = false;

    if (validateForm(userAnswers.value)) {
        showError.value = false;

        if (checkAnswers(userAnswers.value, reponses.value)) {
            resultMessage.value = "Bravo ! Vous avez trouvé la bonne réponse !";
        } else {
            resultMessage.value = "Dommage, vous n'avez pas trouvé la bonne réponse.";
        }

        showResult.value = true;
    } else {
        showError.value = true;
    }
}

onMounted(fetchAndDisplayData);
</script>

<template>
    <section class = "question">
        <div class = "enonce">
            <h2>{{ enonce }}</h2>
            <h4 v-if="inputType === 'radio'" class = "une-reponse">Une seule réponse possible</h4>
            <h4 v-else-if="inputType === 'checkbox'" class = "plusieurs-reponses">Plusieurs réponses possibles</h4>
        </div>
        
        <div class = "reponse">
        <form @submit.prevent="onSubmit" v-if="currentQuestionMode === 1" id="form">
            <div v-for="reponse in reponses">
                <label>
                    <input type="radio" name="question" :value="reponse.proposition_enonce" v-model="userAnswers" :disabled="showResult"> {{ reponse.proposition_enonce }}
                </label>
            </div>
        </form>
        <form @submit.prevent="onSubmit" v-else-if="currentQuestionMode === 2" id="form">
            <div v-for="reponse in reponses">
                <label>
                    <input type="checkbox" name="question" :value="reponse.proposition_enonce" v-model="userAnswers" :disabled="showResult"> {{ reponse.proposition_enonce }}
                </label>
            </div>
        </form>
        <form @submit.prevent="onSubmit" v-else id="form" class ="OQ">
            <div v-for="reponse in reponses">
                <label>
                    Réponse : <input type="input" name="question" placeholder="Ex : 5" v-model="userAnswers" :disabled="showResult">
                </label>
                <p v-if="showResult">La réponse était : {{ reponse.proposition_enonce }}</p>
            </div>
        </form>
        </div>

        <button v-if="!showResult" class="send-button" id="bouton" type="submit" form="form"><h3>Valider</h3></button>
        <button v-else class="question-suivante" href=""> <h3>Question suivante</h3></button>
 
        <div v-if="showError" class="erreur-reponse">
            <h3>Veuillez donner une réponse</h3>
        </div>

        <div v-if="showResult" class = "correction">
            <h3>Correction :</h3>
            <div v-for="reponse in reponses">
                <p>{{ reponse.proposition_explication }}</p>
            </div>
        </div>

        <div v-if="showResult" class = "resultat">
            <h3>{{ resultMessage }}</h3>
        </div>
    </section>
</template>

<style scoped>
* {
    margin: 0px;
}

section {
    font-family: 'Monrope', sans-serif;
    display: flex;
    flex-direction: column;
}

h1 {
    font-family: 'Montserrat', sans-serif;
    font-size: 2em;
}

h2 {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.5em;
}

h3 {
    font-family: 'Montserrat', sans-serif;
    font-size: 1em;    
}

h4 {
    font-family: 'Montserrat', sans-serif;
    font-size: 0.8em;   
}

.question {
  background-color: #ffffff;
  grid-column: 2/3;
  grid-row: 1/5;

  display: grid;
  grid-template-columns: repeat(11, 1fr);
  grid-template-rows: repeat(5, 1fr);
  
  height: 100%;
}

.enonce{
    text-align: center;
    padding: 5%;
    grid-column: 2/11;
    grid-row: 1/2;
}

.reponse {
    background: linear-gradient(135deg, #0097a1, #007580);
    border-radius: 10px;
    padding: 5px;
    margin: 5%;
    grid-column: 3/10;
    grid-row: 2/3;
    color: #ffffff;
}

input{
    margin: 5px;
}

.OQ{
    border-radius: 50px;
    padding: 5%;
    text-align: center;
}

.OQ p {
  display: inline-block;
  margin-left: 15px;
  vertical-align: middle;
}

.send-button{
    grid-column: 5/8;
    grid-row: 3/4;
    font-size: 1em;

    text-align: center;

    padding: 5%;
    margin: 12% 0% 12% 0%;
    border-radius: 50px;
    background: linear-gradient(135deg, #0097a1, #007580);
    text-decoration: none;
    color: #ffffff;
    box-shadow: 0px 0px 25px rgba(0, 134, 143, 0.5);

    border: none;
}

.send-button:hover{
    box-shadow: none;
}

.erreur-reponse{
    color: red;
    grid-column: 5/8;
    grid-row: 4/5;
    text-align: center;
}

.correction{
    grid-column: 4/9;
    grid-row: 5/6;
    text-align: center;
}

.correction h3{
    padding: 10px;
}

.resultat{
    grid-column: 4/9;
    grid-row: 4/5;
    text-align: center;
}

.question-suivante{
    grid-column: 5/8;
    grid-row: 3/4;
    font-size: 1em;

    text-align: center;

    padding: 5%;
    margin: 12% 0% 12% 0%;
    border-radius: 50px;
    background: linear-gradient(135deg, #0097a1, #007580);
    text-decoration: none;
    color: #ffffff;
    box-shadow: 0px 0px 25px rgba(0, 134, 143, 0.5);

    border: none;
}

.question-suivante:hover{
    box-shadow: none;
    text-decoration: none;
    text-decoration: none;   
}
</style>