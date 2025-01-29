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

</style>
