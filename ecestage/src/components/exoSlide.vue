<script setup>
import { ref, reactive, onMounted } from 'vue';

const progression = ref(25)

const matieres = ref([]);
const chapitres = ref([]);
const competences = ref([]);

async function fetchAndDisplayData() {
  try {

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/matiere`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Erreur lors de la récupération des données.')

    const data = await response.json()

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
    <nav class="menu">
        <div class="progress-container">
            <p>Progression</p>
            <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progression + '%' }"></div>
            </div>
        </div>
        <div class="item">
            <ul>
                <!-- Liste des matières -->
                <li v-for="matiere in matieres" :key="matiere.nom" class="menu-item">
                    <span @click="toggleOpen('matiere', matiere.nom)">
                        <span class="icon" :class="{ 'rotate-90': openState.matiere === matiere.nom }">▶</span>
                        {{ matiere.nom }}
                    </span>
                    <!-- Liste des chapitres avec animation -->
                    <transition name="slide">
                        <ul v-if="openState.matiere === matiere.nom" class="chapitre">
                            <li v-for="chapitre in chapitres.filter(j => j.id_matiere === matiere.id_matiere)" 
                                :key="chapitre.id_matiere" 
                                class="chapitre-item">
                                <span @click="toggleOpen('chapitre', chapitre.nom)">
                                    <span class="icon" :class="{ 'rotate-90': openState.chapitre === chapitre.nom }">▶</span>
                                    {{ chapitre.nom }}
                                </span>
                                <!-- Liste des compétences (sans flèche) -->
                                <transition name="slide">
                                    <ul v-if="openState.chapitre === chapitre.nom" class="competence">
                                        <li v-for="competence in competences.filter(j => j.id_chapitre === chapitre.id_chapitre)" 
                                            :key="competence.id_chapitre" 
                                            class="competence-item">
                                            <span>{{ competence.nom }}</span>
                                        </li>
                                    </ul>
                                </transition>
                            </li>
                        </ul>
                    </transition>
                </li>
            </ul>
        </div>
    </nav>
</template>

<style scoped>
/* RESET */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.progress-container {
    font-family: 'Montserrat', sans-serif;
    font-size: 1em;    
    color: #ffffff;
    width: 100%;
    padding: 20px 0px 20px 0px;
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


/* Liste générale */
ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

/* Styles pour les boutons */
.menu-item > span {
    cursor: pointer;
    color: white;
    padding: 10px;
    display: flex;
    align-items: center;
    border-radius: 5px;
    transition: background-color 0.3s ease;
    width: 100%;
    font-size: 1.2em;
    font-weight: bold;
}

.chapitre-item > span,
.competence-item > span {
    cursor: pointer;
    color: white;
    padding: 10px;
    display: flex;
    align-items: center;
    border-radius: 5px;
    transition: background-color 0.3s ease;
    width: 100%;
    font-size: 1.2em;
}

.menu-item > span:hover,
.chapitre-item > span:hover,
.competence-item > span:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

/* Sous-menus */
.chapitre, .competence {
    overflow: hidden;
    margin-left: 15px;
}

/* Icônes animées (uniquement matières et chapitres) */
.icon {
    transition: transform 0.3s ease-in-out;
    margin-right: 8px;
}

.rotate-90 {
    transform: rotate(90deg);
}

/* Animation d'ouverture FERMETURE en mode défilement */
.slide-enter-active, .slide-leave-active {
    transition: max-height 0.4s ease-in-out, opacity 0.3s ease-in-out;
}

.slide-enter-from, .slide-leave-to {
    max-height: 0;
    opacity: 0;
}

.slide-enter-to, .slide-leave-from {
    max-height: 300px; /* Ajustable selon le contenu */
    opacity: 1;
}

/* Suppression de la flèche pour les compétences */
.competence-item > span {
    padding-left: 20px; /* Alignement propre avec le reste */
}
</style>