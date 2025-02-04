<script setup>
import { ref, reactive, onMounted, computed } from 'vue';

// Données dynamiques
const matieres = ref([]); // Liste des matières
const chapitres = ref([]);
const competences = ref([]);
const progression = ref({ total: 0, completed: 0 });

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

async function fetchProgression() {
    try {
        const token = localStorage.getItem('token'); // Supposons que le token est stocké dans localStorage
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/progression`, {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });
        const data = await response.json();
        progression.value = data;
    } catch (error) {
        console.error('Erreur lors de la récupération de la progression :', error);
    }
}


// Gestion des états ouverts/fermés
const openState = reactive({}); // État des menus

// Fonction pour gérer l'ouverture/fermeture
function toggleOpen(key) {
  openState[key] = !openState[key]; // Basculer l'état
  console.log('État mis à jour :', openState);
}
async function exo(mat,count) { 
    console.log(mat);
    try {
            const response = await fetch(`http://localhost:3001/api/exos/matiere?matiere=${encodeURIComponent(mat)}&count=${count}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        
    
        

        const data = await response.json();
        console.log("Réponse backend :", data);

        if (data.ids && data.ids.length > 0) {
            // Construire l'URL avec les IDs
            const urlWithIds = `http://localhost:5173/exo/${data.ids.join(',')}`;

            // Rediriger le navigateur vers cette URL
            window.location.href = urlWithIds;
        } else {
            console.error("Aucun ID reçu.");
        }
    } catch (error) {
        console.error('Erreur de génération de l\'exercice', error);
    }
}


// Appel des fonctions à l'initialisation
onMounted(() => {
  fetchAndDisplayData();
  fetchProgression();
});

// Calcul du pourcentage de progression
const progressionPercentage = computed(() => {
  return progression.value.total
    ? Math.round((progression.value.completed / progression.value.total) * 100)
    : 0;
});

</script>

<template>
    <nav class="menu">
        <div class="item">
            <ul>
                <!-- Liste des matières -->
                <li v-for="matiere in matieres" :key="matiere.nom" class="menu-item">
                    <span @click="toggleOpen(matiere.nom)">
                        {{ matiere.nom }}
                        <router-link to="/exo"><button  @click="exo(matiere.nom,1)">Exercice</button></router-link>
                        <span class="icon" :class="{ 'rotate-90':  openState[matiere.nom]}"></span>
                    </span>
                    <!-- Liste des chapitres avec animation -->
                    <transition name="slide">
                        <ul v-if="openState[matiere.nom]" class="chapitre">
                            <li v-for="chapitre in chapitres.filter(j => j.id_matiere === matiere.id_matiere)" 
                                :key="chapitre.id_matiere" 
                                class="chapitre-item">
                                <span @click="toggleOpen(chapitre.nom)">
                                    {{ chapitre.ordre }}. {{ chapitre.nom }}

                                     <!-- Barre de progression pour chapitre avec pourcentage -->
                                    <div class="progress-container">
                                        <div class="progress-bar">
                                            <div class="progress" :style="{ width: progressionPercentage + '%' }"></div>
                                        </div>
                                        <span class="percentage">{{ progressionPercentage }}%</span>
                                    </div>

                                    <router-link to="/exo"><button  @click="exo(chapitre.nom,2)">Exercice</button></router-link>
                                    <span class="icon" :class="{ 'rotate-90': openState[chapitre.nom] }"></span>
                                </span>
                                <!-- Liste des compétences (sans flèche) -->
                                <transition name="slide">
                                    <ul v-if="openState[chapitre.nom]" class="competence">
                                        <li v-for="competence in competences.filter(j => j.id_chapitre === chapitre.id_chapitre)" 
                                            :key="competence.id_chapitre" 
                                            class="competence-item">
                                            <span>
                                                {{ competence.nom }}
                                                <router-link to="/exo"><button  @click="exo(competence.nom,3)">Exercice</button></router-link>
                                            </span>
                                            
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
    font-size: 1.8em;
    font-weight: bold;
}

.chapitre-item > span {
    cursor: pointer;
    color: black;
    padding: 10px;
    margin-top: 8px;
    display: flex;
    align-items: center;
    border-radius: 5px;
    transition: background-color 0.3s ease;
    width: 100%;
    font-size: 1.6em;
    font-weight: normal;
}

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
    background-color: rgba(210, 210, 210, 0.6);
}

/* Sous-menus */
.competence {
    overflow: hidden;
    margin-left: 15px;
}

/* Icônes animées */
.icon {
    width: 16px;
    height: 16px;
    background-image: url('../../images/chevron.png');
    background-size: contain;
    background-repeat: no-repeat;
    display: inline-block;
    transition: transform 0.3s ease;
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
button {
    position: relative;
    overflow: hidden; /* Évite les débordements */
    background: linear-gradient(90deg, #017179, #02b7c4);
    border: none;
    color: white;
    text-align: right;
    border-radius: 10px;
    height: calc(50% - 5%);
    padding: 4px 7px;
    margin: 10px 0px 10px 10px;
    font-family: 'Montserrat', sans-serif;
    
    transition: background-color 0.45s ease-in-out;
    z-index: 1;
}

/* Pseudo-élément pour l'effet de transition */
button::after {
    content: "";
    position: absolute;
    inset: 0; /* Prend toute la place du bouton */
    background: linear-gradient(90deg, #02b7b8, #017189);
    opacity: 0; /* Caché par défaut */
    transition: opacity 0.45s ease-in-out;
    z-index: -1; /* Passe derrière le texte */
}

/* Au survol, on affiche le nouveau dégradé */
button:hover::after {
    opacity: 1;
}

/* Pour la barre de progression */
.progress-container {
    display: flex;
    align-items: center;
    gap: 8px; /* Espace entre la barre et le pourcentage */
    margin-left: 10px;
}

.progress-bar {
    width: 100px;
    height: 10px;
    background-color: #e0e0e0;
    border-radius: 5px;
    overflow: hidden;
    display: inline-block;
}

.progress {
    height: 100%;
    background-color: #4caf50;
    transition: width 0.4s ease-in-out;
}

.percentage {
    font-size: 0.9em;
    font-weight: bold;
    color: #4caf50;
}


/* Empêche que le texte soit affecté par l'animation */


</style>
