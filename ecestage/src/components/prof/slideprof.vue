<template>
  <StyledContainer>
    <section class="a">
      <p>Ajouter :</p>
      <StyledBoutton>
        <BouttonExo />
      </StyledBoutton>
      <StyledBoutton>
        <Bouttonmatiere />
      </StyledBoutton>
      <StyledBoutton>
        <Bouttoncompetence />
      </StyledBoutton>
      <h1>Promo :</h1>
      <ul>
        <li v-for="promo in promos" :key="promo.id">
          <router-link :to="`/ajout/${promo.nom}`">{{ promo.nom }}</router-link> <!-- Affichage des données -->
        </li>
      </ul>
    </section>
  </StyledContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StyledContainer from '../styleslide.vue';
import BouttonExo from '../prof/ajoutexo.vue';
import Bouttonmatiere from '../prof/ajoutmatiere.vue';
import Bouttoncompetence from '../prof/ajoutcompetence.vue';
import StyledBoutton from '../stylebouton.vue';

const promos = ref([]);

async function fetchPromos() {
  try {
    console.log(localStorage.getItem('token'));

    const token = localStorage.getItem('token'); // Récupère le token stocké
    if (!token) {
      throw new Error("Token manquant, l'utilisateur n'est peut-être pas connecté.");
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/prof/promo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Ajout du token pour l'authentification
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur serveur: ${response.status}`);
    }

    promos.value = await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des promos :", error);
  }
}

// Charger les promos au montage du composant
onMounted(fetchPromos);
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
  list-style:none;
  text-decoration: none;
  color: inherit;
}
</style>
