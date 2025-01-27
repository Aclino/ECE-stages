<script setup>
import { ref } from 'vue';
import headers from './components/headers.vue';
import footers from './components/footers.vue';
import profil from './components/profil.vue';
import { useRouter } from 'vue-router';


    
// Vérifier la présence et la validité du token
checkToken(()=>{
    const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local

    if (!token) {
        // Si le token est manquant, rediriger vers register.html
        useRouter().push('/');
        console.log('token manquant')
        return;
    }

    // Valider le token en effectuant une requête à une route protégée
    fetch('http://localhost:3000/api/utilisateur', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Inclure le token dans les en-têtes
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Token invalide ou expiré');
            }
        })
        .catch(() => {
            // Rediriger vers register.html en cas d'erreur
            useRouter().push('/');
        });
});
</script>

<template>

  <div>

    <router-view></router-view>

  </div>

</template>

<style>
section{
  display: flex;
  height: 85vh;
}
.slide{
  background-color: #dddddd;
  flex: 0 0 20%;
  height :85vh;
}
.main{

  flex: 0 0 80%;
  background-color: #eeeeee;
}
</style>
