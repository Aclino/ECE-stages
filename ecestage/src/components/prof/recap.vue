<template>
    <h1>Promo : {{ promo }}</h1>
    <div>
      <p>L'URL actuelle est : {{ currentUrl }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { useRoute } from 'vue-router';
  
  const currentUrl = ref("");
  const promo = ref("");
  
  const route = useRoute();
  
  onMounted(() => {
    updatePromo();
  });
  
  // Fonction pour mettre à jour les valeurs
  function updatePromo() {
    currentUrl.value = route.fullPath;
    promo.value = decodeURIComponent(route.params.promo || '');
    console.log("Promo extraite :", promo.value);
  }
  
  // Watcher pour détecter les changements de route
  watch(() => route.params.promo, (newPromo) => {
    promo.value = decodeURIComponent(newPromo || '');
    currentUrl.value = route.fullPath;
    console.log("Changement de promo :", promo.value);
  });
  </script>
  
  <style scoped>
  /* Tu peux ajouter tes styles ici */
  </style>
  