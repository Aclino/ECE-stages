<script setup>
import { ref, reactive, onMounted } from 'vue';

// Données dynamiques
const matieres = ref([]);
const chapitres = ref([]);
const competences = ref([]);

// Fonction pour récupérer les données depuis l'API
async function fetchAndDisplayData() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/matiere`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Erreur lors de la récupération des données.');

    const data = await response.json();

    matieres.value = data.matieres;
    chapitres.value = data.chapitres;
    competences.value = data.competences;
  } catch (error) {
    console.error('Erreur lors de l\'affichage des données :', error);
  }
}

// Gestion des états ouverts/fermés
const openState = reactive({
  matiere: null,
  chapitre: null
});

// Fonction pour gérer l'ouverture/fermeture
function toggleOpen(type, key) {
  if (openState[type] === key) {
    // Si on clique sur le même élément, on le ferme
    openState[type] = null;
  } else {
    // Sinon, on ouvre le nouvel élément et on ferme l'ancien
    openState[type] = key;
  }
  console.log('État mis à jour :', openState);
}

onMounted(fetchAndDisplayData);
</script>

<template>
    <section class="menu">
        <a>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maxime esse modi, eos aspernatur iure quam, laborum ducimus minus incidunt, animi aliquid debitis voluptas ex aliquam molestias facere magnam minima tempora!</a>
    </section>
</template>

<style scoped>
/* RESET */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Conteneur principal */
.menu {
    border-radius: 20px;
    background: linear-gradient(45deg, #017179, #02b7c4);
    color: white;
    height: calc(100% - 20px);
    padding: 15px;
    margin: 10px 0px 10px 10px;
    font-family: 'Montserrat', sans-serif;
    overflow-y: auto;
}
</style>