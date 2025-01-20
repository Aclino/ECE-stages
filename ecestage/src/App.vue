<script setup>
import { ref } from 'vue';
import deroulant from './components/deroulant.vue';
import headers from './components/headers.vue';

// Références réactives
const count = ref(0);
const showComponent = ref(false); // Contrôle l'affichage du composant

// Fonction pour incrémenter le compteur
const increment = () => {
  count.value++;
  if (count.value > 10) {
    showComponent.value = true; // Affiche le composant lorsque le compteur dépasse 10
  }
};
</script>

<template>
<headers/>
<deroulant />
<component :is="footer"/>
  

</template>

<style>
</style>
