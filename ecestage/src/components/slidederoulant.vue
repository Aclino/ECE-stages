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
    <ul>
      <!-- Liste des matières -->
      <li v-for="matiere in matieres" :key="matiere.nom" class="menu-item">
        <span @click="toggleOpen(matiere.nom)">
          {{ matiere.nom }}
          <!-- Icone avec rotation dynamique -->
          <span class="icon" :class="{ 'rotate-45': openState[matiere.nom] }">▶</span>
        </span>
        <!-- Liste des chapitres pour chaque matière -->
        <ul v-if="openState[matiere.nom]" class="chapitre">
          <li
            v-for="chapitre in joins.filter(j => j.matiere_nom === matiere.nom)"
            :key="chapitre.chapitre_nom"
            class="chapitre-item"
          >
            <span @click="toggleOpen(chapitre.chapitre_nom)">
              {{ chapitre.chapitre_nom }}
              <span class="icon" :class="{ 'rotate-45': openState[chapitre.chapitre_nom] }">▶</span>
            </span>
            <!-- Liste des compétences pour chaque chapitre -->
            <ul v-if="openState[chapitre.chapitre_nom]" class="competence">
              <li
                v-for="competence in joins.filter(j => j.chapitre_nom === chapitre.chapitre_nom)"
                :key="competence.competence_nom"
                class="competence-item"
              >
                <span @click="toggleOpen(competence.competence_nom)">
                  {{ competence.competence_nom }}
                  <span class="icon" :class="{ 'rotate-45': openState[competence.competence_nom] }">▶</span>
                </span>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.menu {
  font-size: 18px;
  margin: 0;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.menu-item > span {
  cursor: pointer;
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  display: inline-block;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.menu-item > span:hover {
  background-color: #0056b3;
}

.chapitre-item > span,
.competence-item > span {
  cursor: pointer;
  background-color: #e3e3e3;
  color: black;
  padding: 8px 15px;
  display: inline-block;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.chapitre-item > span:hover,
.competence-item > span:hover {
  background-color: #c3c3c3;
}

.competence,
.chapitre {
  display: block;
  margin-top: 10px;
  padding-left: 20px;
}

.icon {
  display: inline-block; /* Nécessaire pour que transform fonctionne */
  transform: rotate(0deg);
  transition: transform 0.3s ease-in-out;
}

.rotate-45 {
  transform: rotate(90deg);
}
</style>