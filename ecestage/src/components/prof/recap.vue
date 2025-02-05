<template>
  <div>
    <!-- Affichage selon la promotion -->
    <div v-show="promotion">
      <div v-if="promo.length > 0">
        <h1>Promo : {{ promo }}</h1>
        <div v-if="matieres.length > 0">
          <h2>Matières associées :</h2>
          <ul>
            <li v-for="matiere in matieres" :key="matiere.id_matiere">
              {{ matiere.matiere_nom }}
            </li>
          </ul>
        </div>
        <div v-else>
          <p>Aucune matière associée à cette promotion.</p>
        </div>
      </div>
      <div v-else>
        <p>Veuillez sélectionner une promotion ou ajouter un cours</p>
      </div>
    </div>

    <!-- Affichages dynamiques -->
    <div v-show="matiere">
      <p>Affichage pour une matière</p>
      <formmatiere/>
    </div>
    <div v-show="exo">
      <p>Affichage pour un exercice</p>
    </div>
    <div v-show="chapitre">
      <p>Affichage pour un chapitre</p>
    </div>
    <div v-show="competence">
      <p>Affichage pour une compétence</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import formmatiere from './formmatiere.vue';
const route = useRoute();
const currentUrl = ref("");
const promo = ref("");
const matieres = ref([]);

const token = localStorage.getItem("token");

// Variables de visibilité
const exo = ref(false);
const chapitre = ref(false);
const competence = ref(false);
const matiere = ref(false);
const promotion = ref(true);

// Liste des sections avec leur état
const setupVisibility = ref([
  { name: "matiere", value: matiere },
  { name: "promo", value: promotion },
  { name: "exercice", value: exo },
  { name: "chapitre", value: chapitre },
  { name: "competence", value: competence }
]);

// 🔹 Met à jour l'affichage en fonction du dernier segment de l'URL
function afficheur(lastSegment) {
  console.log("🔍 Changement d'affichage pour :", lastSegment);

  // Désactive toutes les sections
  setupVisibility.value.forEach(item => item.value = false);

  // Active la bonne section
  const foundItem = setupVisibility.value.find(item => item.name === lastSegment);
  if (foundItem) {
    foundItem.value = true;
  }

  console.log(`✅ Section activée : ${lastSegment}`);
}

// 🔹 Extrait le dernier segment de l'URL
function extractLastSegment(url) {
  const match = url.match(/ajout\/([^\/]+)/);
  return match ? match[1] : "";
}

// 🔹 Met à jour la promo et récupère les matières associées
async function fetchMatieres() {
  if (!token) {
    console.error("❌ Token manquant, l'utilisateur doit être connecté.");
    return;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/prof/promo/${promo.value}/matieres`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.error) {
      console.error("❌ Erreur API :", data.error);
      matieres.value = [];
    } else {
      console.log("✅ Matières récupérées :", data);
      matieres.value = data;
    }
  } catch (error) {
    console.error("🚨 Erreur lors de la récupération des matières :", error);
  }
}

// 🔹 Surveille tout changement de route et met à jour l'affichage immédiatement
watch(() => route.fullPath, (newPath) => {
  console.log("🔍 Nouveau changement d'URL détecté :", newPath);

  let lastSegment = extractLastSegment(newPath);
  console.log('avant : ',lastSegment);afficheur(lastSegment);
  if(lastSegment==='promo'){
    lastSegment=route.fullPath.split('/').pop();
    promo.value=lastSegment;
  }
  console.log('après : ',lastSegment);
fetchMatieres();
  
  
});

// 🔹 Exécute les actions au chargement de la page
onMounted(() => {
  promo.value = decodeURIComponent(route.params.promo || '');
  console.log("📌 Promo initiale :", promo.value);

  fetchMatieres();
});
</script>

<style scoped>
h1 {
  font-size: 24px;
  margin-bottom: 10px;
}
h2 {
  font-size: 20px;
  margin-top: 20px;
}
ul {
  list-style-type: disc;
  padding-left: 20px;
}
li {
  margin: 5px 0;
}
</style>
