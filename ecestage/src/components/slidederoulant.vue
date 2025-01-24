<script setup>
import { ref, reactive, onMounted } from 'vue';

// Données dynamiques
const matieres = ref([]); // Liste des matières
const joins = ref([]);    // Relations matière-chapitres-compétences

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
    joins.value = data.joins;       // Stocker les relations
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
                        <span class="icon" :class="{ 'rotate-90': openState[matiere.nom] }">▶</span>
                        {{ matiere.nom }}
                    </span>
                    <!-- Liste des chapitres avec animation -->
                    <transition name="slide">
                        <ul v-if="openState[matiere.nom]" class="chapitre">
                            <li v-for="chapitre in joins.filter(j => j.matiere_nom === matiere.nom)" 
                                :key="chapitre.chapitre_nom" 
                                class="chapitre-item">
                                <span @click="toggleOpen(chapitre.chapitre_nom)">
                                    <span class="icon" :class="{ 'rotate-90': openState[chapitre.chapitre_nom] }">▶</span>
                                    {{ chapitre.chapitre_nom }}
                                </span>
                                <!-- Liste des compétences (sans flèche) -->
                                <transition name="slide">
                                    <ul v-if="openState[chapitre.chapitre_nom]" class="competence">
                                        <li v-for="competence in joins.filter(j => j.chapitre_nom === chapitre.chapitre_nom)" 
                                            :key="competence.competence_nom" 
                                            class="competence-item">
                                            <span>{{ competence.competence_nom }}</span>
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
    background: linear-gradient(135deg, #007a8c, #005f66);
    color: white;
    height: 100%;
    padding: 15px;
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
.menu-item > span,
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
