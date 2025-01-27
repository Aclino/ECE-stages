<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Déclaration des variables réactives
const errorMessage = ref(null); // Pour afficher les erreurs
const message = ref(null); // Pour afficher les messages de succès

// Utilisation de Vue Router
const router = useRouter();

</script>

<template>
  <div>
    <router-view></router-view>

   
  </div>
</template>

<style>
/* Styles */
form {
  margin-bottom: 2rem;
}
h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
button {
  margin-top: 1rem;
}
</style>
