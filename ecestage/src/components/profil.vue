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
            <h3>adresse email :</h3>
            <button @click="count=1">modifier mon mot de passe</button>
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
const nom = ref('Noah');
const prenom = ref('Nicola');
const promo = ref('ING3');
const count = ref(0)
const errors = ref({});

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

const handleSubmit = () => {
    if (validateForm()) {
        alert('Mot de passe modifié avec succès !');
        // Réinitialiser les champs
        currentPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';
        errors.value = {};
    }


return {
    currentPassword,
    newPassword,
    confirmPassword,
    errors,
    handleSubmit
};};

</script>
<style scoped>
.case{
    margin: 5vh;
    background-color: aliceblue;
    border-radius: 10px;
    height : 75vh;
    display:grid;
    grid-template-areas: "name name photo"
                         "email email email";
}
.name{
    grid-area: name;
    
    margin: 5vh;
    border-radius: 10px;
}
h1,h2,h3{
    height: 30%;
}
.photo{
    grid-area: photo;
   
    margin:5vh 5vh 5vh 0;
    border-radius: 10px;
}
img{
    width: 20%;
}
    

.email{grid-area: email;
    margin:5vh;
    border-radius: 10px;
    

}
</style>