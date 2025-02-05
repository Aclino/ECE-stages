<template>
  <StyledContainer>
    <section class="a">
      <p>Ajouter :</p>
      <StyledBoutton>
        <button @click="changerAjout('matiere')">Une matière</button>
      </StyledBoutton>
      <StyledBoutton>
        <button @click="changerAjout('chapitre')">Un chapitre</button>
      </StyledBoutton>
      <StyledBoutton>
        <button @click="changerAjout('competence')">Une compétence</button>
      </StyledBoutton>
      <StyledBoutton>
        <button @click="changerAjout('exercice')">Un exercice</button>
      </StyledBoutton>
      
      <h1>Promo :</h1>
      <ul>
        <li v-for="promo in promos" :key="promo.nom">
          <!-- Le lien vers la promo reste le même -->
          <router-link :to="`/ajout/promo/${promo.nom}`">{{ promo.nom }}</router-link>
        </li>
      </ul>
    </section>
  </StyledContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StyledContainer from '../styleslide.vue';
import StyledBoutton from '../stylebouton.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const promos = ref([]);

// Fonction de récupération des promos (tel que tu l'avais)
async function fetchPromos() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("❌ Token manquant, l'utilisateur n'est pas connecté.");
      return;
    }

    console.log("📡 Récupération des promotions...");

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/prof/promo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur serveur: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Réponse API reçue :", data);

    if (Array.isArray(data) && typeof data[0] === "string") {
      promos.value = data.map(nom => ({ nom })); 
    } else {
      promos.value = data;
    }

    console.log("📊 Promotions stockées :", promos.value);
  } catch (error) {
    console.error("🚨 Erreur lors de la récupération des promos :", error);
  }
}

onMounted(fetchPromos);


// Fonction appelée au clic sur un bouton pour modifier la route
function changerAjout(valeur) {
  // Redirige vers /ajout/valeur
  router.push(`/ajout/${valeur}`);
}
</script>

<style scoped>
.a {
  display: flex;
  flex-direction: column;
}
h1 {
  margin-top: 5px;
  border-bottom: 1px solid #616161;
}
li a{
  margin-top: 5px;
  list-style: none;
  text-decoration: none;
  color: inherit;
}
</style>
