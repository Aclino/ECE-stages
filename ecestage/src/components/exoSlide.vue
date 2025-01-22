<script setup>
import { ref, onMounted } from 'vue';

let matiere = ref('Matière')
let chapitre = ref('Chapitre')
let competence = ref('Compétence')

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
        <h2>{{ chapitre }}</h2>
        <h3>{{ competence }}</h3>
        <p>Progression (barre)</p>
    </section>        
</template>

<style scoped>
* {
    margin: 0px;
}

section {
    font-family: 'Monrope', sans-serif;
}

.infos {
    background: linear-gradient(#8e86b5, #acaeed);
    height: 100%;
    width: 100%;
    padding: 5%;
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
</style>