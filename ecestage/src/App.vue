<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Déclaration des variables réactives
const errorMessage = ref(null); // Pour afficher les erreurs
const message = ref(null); // Pour afficher les messages de succès

// Utilisation de Vue Router
const router = useRouter();
async function fetchUserProfil() {
    try {
        const token = localStorage.getItem('token'); // Récupère le token JWT depuis le stockage local

        if (!token) {
            console.error('Token manquant');
            this.$router.push('/login'); // Redirige directement si aucun token
            return;
        }

        const response = await fetch('http://localhost:3000/api/checktoken', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Ajoute le token JWT dans les headers
            },
        });

        if (!response.ok) {
            // Si le statut est 401 ou 403, redirige vers la page de connexion
            if (response.status === 401 || response.status === 403) {
                console.error('Token invalide ou manquant. Redirection...');
                this.$router.push('/login'); // Redirige vers la page de connexion
            } else {
                console.error('Erreur lors de la récupération des données utilisateur');
            }
            return;
        }

        const data = await response.json();
        console.log('Utilisateur connecté :', data.utilisateur);
        // Traite les données utilisateur ici si nécessaire

    } catch (error) {
        console.error('Erreur réseau :', error);
        this.$router.push('/login'); // Redirige en cas d'erreur réseau
    }
}
fetchUserProfil();
</script>

<template>
  <div>
    <router-view></router-view>

   
  </div>
</template>

<style>


</style>
