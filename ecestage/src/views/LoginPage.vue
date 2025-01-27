<template>
 <!-- Vérification du token -->
 <button @click="checkToken">Vérifier le token</button>

<!-- Formulaire d'inscription -->
<form id="registerForm" @submit="inscription">
  <h2>Inscription</h2>
  <input type="text" name="nom" placeholder="Nom" required />
  <input type="text" name="prenom" placeholder="Prénom" required /> <!-- Nouveau champ -->
  <input type="email" name="email" placeholder="Email" required />
  <input type="password" name="mot_de_passe" placeholder="Mot de passe" required />
  <button type="submit">S'inscrire</button>
</form>

<!-- Formulaire de connexion -->
<form id="loginForm" @submit="login">
  <h2>Connexion</h2>
  <input type="email" name="email" placeholder="Email" required />
  <input type="password" name="mot_de_passe" placeholder="Mot de passe" required />
  <button type="submit">Se connecter</button>
</form>

<!-- Messages -->
<p v-if="message" style="color: green;">{{ message }}</p>
<p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Déclaration des variables réactives
const errorMessage = ref(null); // Pour afficher les erreurs
const message = ref(null); // Pour afficher les messages de succès

// Utilisation de Vue Router
const router = useRouter();

// Vérification du token
async function checkToken() {
  const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local

  if (!token) {
    console.log('Token manquant');
    router.push('/register'); // Redirection vers la page d'inscription
    return;
  }

  try {
    const response = await fetch('http://localhost:3001/api/utilisateur', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // Inclure le token dans les en-têtes
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Token invalide ou expiré');
    }

    // Récupérer les données JSON seulement si la réponse est OK
    const data = await response.json();
    console.log(data); // Affichez les données retournées par l'API
  } catch (error) {
    console.error(error.message);
    console.log('Redirection vers la page d\'inscription');
    router.push('/register'); // Redirection en cas d'erreur
  }
}


// Fonction d'inscription
async function inscription(event) {
  event.preventDefault(); // Empêcher le rechargement de la page
  const formData = new FormData(event.target); // Récupération des données du formulaire
  const data = {
    nom: formData.get('nom'),
    prenom: formData.get('prenom'), // Nouveau champ "prénom"
    email: formData.get('email'),
    mot_de_passe: formData.get('mot_de_passe'),
  };

  try {
    const response = await fetch('http://localhost:3001/api/utilisateur', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      errorMessage.value = result.error; // Afficher le message d'erreur
    } else {
      alert('Utilisateur créé avec succès !');
      router.push('/login'); // Redirection après succès
    }
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    errorMessage.value = 'Une erreur est survenue. Veuillez réessayer.';
  }
}

// Fonction de connexion
async function login(event) {
  event.preventDefault(); // Empêcher le rechargement de la page
  const formData = new FormData(event.target); // Récupération des données du formulaire
  const data = {
    email: formData.get('email'),
    mot_de_passe: formData.get('mot_de_passe'),
  };

  try {
    const response = await fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      // Stocker le token dans le stockage local
      localStorage.setItem('token', result.token);
      message.value = 'Connexion réussie ! Redirection en cours...';

      // Redirection après un délai
      setTimeout(() => {
        router.push('/acceuil'); // Page après connexion
      }, 2000);
    } else {
      errorMessage.value = result.error || 'Erreur inconnue.';
    }
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    errorMessage.value = 'Une erreur est survenue lors de la connexion.';
  }
}
</script>
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