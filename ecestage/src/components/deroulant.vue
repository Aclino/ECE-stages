<script setup>
import { ref, reactive, onMounted } from 'vue';

// Données dynamiques
const matieres = ref([]); // Liste des matières
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
    console.log('Données reçues :', data);

    matieres.value = data.matieres; // Stocker les matières
    chapitres.value = data.chapitres;
    competences.value = data.competences;
  } catch (error) {
    console.error('Erreur lors de l\'affichage des données :', error);
  }
}


// Gestion des états ouverts/fermés
const openState = reactive({}); // État des menus

// Fonction pour gérer l'ouverture/fermeture
function toggleOpen(key) {
  openState[key] = !openState[key]; // Basculer l'état
  console.log('État mis à jour :', openState);
}

onMounted(fetchAndDisplayData);
</script>

<template>
    <nav class="menu">
        <div class="item">
            <ul>
                <!-- Liste des matières -->
                <li v-for="matiere in matieres" :key="matiere.nom" class="menu-item">
                    <span @click="toggleOpen(matiere.nom)">
                        <h1>{{ matiere.nom }}</h1>
                        <span class="icon" :class="{ 'rotate-90':  openState[matiere.nom]}"></span>
                    </span>
                    <!-- Liste des chapitres avec animation -->
                    <transition name="slide">
                        <ul v-if="openState[matiere.nom]" class="chapitre">
                            <li v-for="chapitre in chapitres.filter(j => j.id_matiere === matiere.id_matiere)" 
                                :key="chapitre.id_matiere" 
                                class="chapitre-item">
                                <span @click="toggleOpen(chapitre.nom)">
                                    {{ chapitre.nom }}
                                    <span class="icon" :class="{ 'rotate-90': openState[chapitre.nom] }"></span>
                                </span>
                                <!-- Liste des compétences (sans flèche) -->
                                <transition name="slide">
                                    <ul v-if="openState[chapitre.nom]" class="competence">
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

/* Conteneur principal */
.menu {
    color: white;
    height: 100%;
    padding: 50px;
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
    color: black;
    padding: 10px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #616161; /* Ligne en dessous */
    transition: background-color 0.3s ease;
    width: 100%;
    font-size: 1.2em;
    font-weight: bold;
}

.chapitre-item > span,
.competence-item > span {
    cursor: pointer;
    color: black;
    padding: 10px;
    display: flex;
    align-items: center;
    border-radius: 5px;
    transition: background-color 0.3s ease;
    width: 100%;
    font-size: 1.2em;
}

.chapitre-item > span:hover,
.competence-item > span:hover {
    background-color: rgba(255, 255, 255, 0.5);
}

/* Sous-menus */
.chapitre, .competence {
    overflow: hidden;
    margin-left: 15px;
}

/* Icônes animées (uniquement matières et chapitres) */
.icon {
    width: 16px; /* Ajuste la taille selon ton image */
    height: 16px;
    background-image: url('../images/chevron.png'); /* Mets le bon chemin */
    background-size: contain; /* Ajuste l'image à la taille */
    background-repeat: no-repeat;
    display: inline-block;
    transition: transform 0.3s ease; /* Animation si besoin */
    transition: transform 0.3s ease-in-out;
    margin-left: auto;
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
