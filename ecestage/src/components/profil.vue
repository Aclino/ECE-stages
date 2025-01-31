<template>
    <div class="case">
         <div class="name"> 
             <h1>Nom : {{ nom }}</h1>
             <h1>Prénom : {{ prenom }}</h1>
             <h2>Promo : {{ promo }}</h2>
         </div>
 
         <div class="photo">
             <img src="../images/Icone-profil.png" alt="Profil" class="profile-icon" id="profileIcon">
         </div>
 
         <div class="email">
             <h3>Adresse email :<br>
             <p>{{ email }}</p></h3>
             <button @click="count = !count">Modifier mon mot de passe</button>
             
             <div class="password-form" v-show="count">
                 <form @submit.prevent="handleSubmit">
                     <h2>Modifier le mot de passe</h2>
                     
                     <div class="form-group">
                         <label for="currentPassword">Mot de passe actuel</label>
                         <input type="password" id="currentPassword" v-model="currentPassword" required>
                         <div class="error" v-if="errors.currentPassword">{{ errors.currentPassword }}</div>
                     </div>
 
                     <div class="form-group">
                         <label for="newPassword">Nouveau mot de passe</label>
                         <input type="password" id="newPassword" v-model="newPassword" minlength="8" required>
                         <div class="error" v-if="errors.newPassword">{{ errors.newPassword }}</div>
                     </div>
 
                     <div class="form-group">
                         <label for="confirmPassword">Confirmer le nouveau mot de passe</label>
                         <input type="password" id="confirmPassword" v-model="confirmPassword" required>
                         <div class="error" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</div>
                     </div>
 
                     <button type="submit">Enregistrer</button>
                 </form>
             </div>
         </div> 
     </div>
 </template>
 
 <script setup>
 import { ref, onMounted } from 'vue';
 
 const nom = ref('');
 const prenom = ref('');
 const promo = ref('');
 const email = ref('');
 const count = ref(false);  // Utilisation de booléen au lieu d'un nombre
 const errors = ref({});
 
 const currentPassword = ref('');
 const newPassword = ref('');
 const confirmPassword = ref('');
 
 // ✅ Fonction pour récupérer les infos utilisateur
 async function fetchUtilisateur() {
    try {
        const token = localStorage.getItem('token');
        console.log("Token récupéré depuis localStorage:", token);

        if (!token) throw new Error('Token non disponible');

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/utilisateur`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const text = await response.text();
        console.log("Réponse brute reçue:", text); // 🔍 Debug pour voir si c'est du JSON ou du HTML

        const data = JSON.parse(text); 
        nom.value = data.nom;
        prenom.value = data.prenom;
        email.value = data.email;
        promo.value = data.promo ;
    } catch (error) {
        console.error("Erreur lors du fetch utilisateur:", error);
        errors.value.message = 'Erreur lors du chargement des données utilisateur';
    }
}

 
 // ✅ Validation du formulaire
 const validateForm = () => {
     const errorMessages = {};
 
     if (currentPassword.value.length < 8) {
         errorMessages.currentPassword = 'Le mot de passe actuel est trop court.';
     }
 
     if (newPassword.value.length < 8) {
         errorMessages.newPassword = 'Le nouveau mot de passe doit contenir au moins 8 caractères.';
     }
 
     if (newPassword.value !== confirmPassword.value) {
         errorMessages.confirmPassword = 'Les mots de passe ne correspondent pas.';
     }
 
     errors.value = errorMessages;
     return Object.keys(errorMessages).length === 0;
 };
 
 // ✅ Envoi du mot de passe au backend
 const handleSubmit = async () => {
     if (!validateForm()) return;
 
     try {
         const token = localStorage.getItem('token');
         if (!token) throw new Error('Token non disponible');
 
         const response = await fetch('/api/utilisateur/modifier-mdp', {
             method: 'POST',
             headers: {
                 'Authorization': `Bearer ${token}`,
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify({
                 currentPassword: currentPassword.value,
                 newPassword: newPassword.value
             })
         });
 
         if (!response.ok) throw new Error('Échec de la mise à jour du mot de passe');
 
         alert('Mot de passe modifié avec succès !');
         count.value = false;
         currentPassword.value = '';
         newPassword.value = '';
         confirmPassword.value = '';
         errors.value = {};
     } catch (error) {
         console.error(error);
         errors.value.message = 'Erreur lors de la modification du mot de passe';
     }
 };
 
 onMounted(fetchUtilisateur);
 </script>
 
 <style scoped>
 .case { 
     margin: 5vh;
     margin-left: 50vh;
     background-color: aliceblue;
     border-radius: 10px;
     height: 75vh;
     display: grid;
     grid-template-areas: 
         "name name photo"
         "email email email";
 }
 
 .name {
     grid-area: name;
     height: 10vh;
     margin: 5vh;
     border-radius: 10px;
 }
 
 h1, h2, h3 {
     height: 5vh;
 }
 
 .photo {
     grid-area: photo;
     margin: 5vh 5vh 5vh 0;
     border-radius: 10px;
 }
 
 img {
     width: 20%;
 }
 
 .email {
     height: 50vh;
     display: grid;
     grid-area: email;
     margin: 5vh;
     border-radius: 10px;
     grid-template-areas: 
         "ad form"
         "bout form";
 }
 
 .email h3 {
     grid-area: ad;
 }
 
 .email button {
     grid-area: bout;
     height: max-content;
     width: max-content;
 }
 
 .password-form {
     grid-area: form;
 }
 
 .form-group {
     display: flex;
     flex-direction: column;
     padding-bottom: 2vh;
 }
 
 .form-group input {
     width: 50%;
 }
 
 .error {
     color: red;
     font-size: 0.9em;
 }
 </style>
 