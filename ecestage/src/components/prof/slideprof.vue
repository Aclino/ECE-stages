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
          {{ promo.nom }} <!-- Affichage des données -->
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
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/prof/promo`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
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
</style>
