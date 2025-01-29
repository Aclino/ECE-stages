<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: Arial, sans-serif;
    /*background-color: #f5f5f5;*/
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
    text-align: center;
    grid-area: ins;
    font-size: 1.5em;
    color: #2b579a;
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
<template>
  <body>
    <div class="container">
      <img src="../images/ECE_LOGO.png" alt="Logo ECE" class="logo">
      <h1>Inscription</h1>
      <form class="form" @submit.prevent="inscription">
        <label for="email">Adresse Mail</label>
        <input type="email" v-model="email" required>

        <label for="nom">Nom</label>
        <input type="text" v-model="nom" required>

        <label for="prenom">Prénom(s)</label>
        <input type="text" v-model="prenom" required>

        <label for="mot_de_passe">Mot de Passe</label>
        <input type="password" v-model="mot_de_passe" required>

        <button type="submit" class="btn-submit">Soumettre</button>
        <p class="login-link">Tu as déjà un compte ? <router-link to="/login">Connecte-toi</router-link></p>
      </form>
    </div>
  </body>
</template>

<script>
export default {
  data() {
    return {
      nom: "",
      prenom: "",
      email: "",
      mot_de_passe: "",
      errorMessage: "",
    };
  },
  methods: {
    async inscription() {
      try {
        const response = await fetch("http://localhost:3001/api/utilisateur", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nom: this.nom,
            prenom: this.prenom,
            email: this.email,
            mot_de_passe: this.mot_de_passe,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          this.errorMessage = result.error;
        } else {
          alert("Utilisateur créé avec succès !");
        }
      } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
      }
    },
  },
};
</script>

