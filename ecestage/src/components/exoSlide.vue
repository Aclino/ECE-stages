<script setup>
import { ref, onMounted } from 'vue';

let matiere = ref('Matière')
let chapitre = ref('Chapitre')
let competence = ref('Compétence')

const progression = ref(25)

async function fetchAndDisplayData() {
  try {

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/exos`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Erreur lors de la récupération des données.')

    const data = await response.json()

    matiere.value = data.exo[0].matiere_nom
    chapitre.value = data.exo[0].chapitre_nom
    competence.value = data.exo[0].competence_nom
    
  } catch (error) {
    console.error('Erreur lors de l\'affichage des données :', error);
  }
}

onMounted(fetchAndDisplayData);
</script>

<template>
    <section class = "infos">
        <h1>{{ matiere }}</h1>
        <h2>► {{ chapitre }}</h2>
        <h3>► {{ competence }}</h3>

        <div class="progress-container">
            <p>Progression</p>
            <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progression + '%' }"></div>
            </div>
        </div>
    </section>
</template>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.infos {
    /* background: linear-gradient(135deg, #007179, #005c64); */
    background: linear-gradient(135deg, #00828b, #006f79);
    height: 100%;
    width: 100%;
    padding: 5%;
    display: flex;
    flex-direction: column;
    color: #33453f;
}

h1 {
    font-family: 'Montserrat', sans-serif;
    font-size: 2em;
    color: #ffffff;
}

h2 {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.5em;
    color: #ffffff;
    padding-top: 8px;
}

h3 {
    font-family: 'Montserrat', sans-serif;
    font-size: 1em;    
    color: #ffffff;
    padding-top: 8px;
    padding-left: 25px;
}

.progress-container {
    font-family: 'Montserrat', sans-serif;
    font-size: 1em;    
    color: #ffffff;
    width: 100%;
    padding-top: 40px;
}

.progress-bar {
    width: 100%;
    height: 15px;
    background: #005c64;
    border-radius: 50px;
    overflow: hidden;
    margin-top: 5px;
}

.progress-fill {
    height: 100%;
    background: #4CAF50;
    transition: width 0.5s ease-in-out;
    border-radius: 50px;
}
</style>