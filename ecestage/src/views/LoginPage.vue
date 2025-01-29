<template><body>
  

 <!-- Vérification du token --
 <button @click="checkToken">Vérifier le token</button>

<-- Formulaire d'inscription --
<form id="registerForm" @submit="inscription">
  <h2>Inscription</h2>
  <input type="text" name="nom" placeholder="Nom" required />
  <input type="text" name="prenom" placeholder="Prénom" required /> <-- Nouveau champ --
  <input type="email" name="email" placeholder="Email" required />
  <input type="password" name="mot_de_passe" placeholder="Mot de passe" required />
  <button type="submit">S'inscrire</button>
</form>



<-- Messages -->


  <div class="container">
    <img src="../images/ECE_LOGO.png" alt="Logo ECE" class="logo">
    <h1>Connexion</h1>
    <form class="form loginForm" id="le-dev-me-soule" @submit="login">
      <label for="email">Adresse Mail</label>
      <input type="email" id="email" name="email" required>

      <label for="password">Mot de Passe</label>
      <input type="password" id="password" name="mot_de_passe" required>

      <button type="submit" class="btn-submit">Se Connecter</button>
      <p class="register-link">Tu n'as pas encore de compte ? <router-link to="/register"><a>Inscris-toi</a></router-link></p>
    </form>
    <p v-if="message" style="color: green;">{{ message }}</p>
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
  </div>
</body>
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
    router.push('/login'); // Redirection vers la page d'inscription
    return;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/utilisateur`, {
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
    router.push('/login'); // Redirection en cas d'erreur
  }
}


// Fonction d'inscription


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
       router.push('/'); // Page après connexion
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
<style scoped>
/* Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }
  
  .container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 400px;
  }
  
  header {
    text-align: center;
    margin-bottom: 20px;
    display: grid;
    grid-template-areas: "ece vide vide"
                          "ins ins ins";
  }
  
  .logo {
    max-width: 40%;
    text-align: right;
    margin:  0px 0px 0px 0px;
  }
  img{
    grid-area: ece;
    text-align: right;
    margin:  1000px 0px 0px 0px;
  }
  h1 {
    grid-area: ins;
    font-size: 1.5em;
    color: #2b579a;
    text-align: center;
  }
  
  .form label {
    display: block;
    font-weight: bold;
    margin-top: 15px;
    margin-bottom: 5px;
    font-size: 0.9em;
    color: #333;
  }
  
  .form input {
    width: 100%;
    padding: 10px;
    font-size: 0.9em;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .form input:focus {
    border-color: #2b579a;
    outline: none;
  }
  
  .btn-submit {
    display: block;
    width: 100%;
    padding: 10px;
    margin-top: 20px;
    background-color: #2b579a;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1em;
    cursor: pointer;
  }
  
  .btn-submit:hover {
    background-color: #244b84;
  }
  
  .login-link {
    text-align: center;
    margin-top: 15px;
    font-size: 0.85em;
  }
  
  .login-link a {
    color: #2b579a;
    text-decoration: none;
  }
  
  .login-link a:hover {
    text-decoration: underline;
  }
  /* Utilisation d'un fond avec des couleurs et motifs inspirés de l'ECE */
body {
  background-color: #001f3d; /* Bleu sombre (couleur générale de l'ECE) */

}


</style>