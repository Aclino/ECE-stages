<template>
    <header>
        <div class="home-button">
            <a href="accueil.html">
                <img src="../images/home-icon.png" alt="Accueil" class="home-icon">
            </a>
        </div>
        <div class="logo">
            <img src="../images/ECE_LOGO.png" alt="Logo ECE">
        </div>
        
        <div 
            class="profile"
            @mouseover="showDropdown"
            @mouseleave="hideDropdown"
        >
            <img src="../images/Icone-profil.png" alt="Profil" class="profile-icon" id="profileIcon">
            <div v-show="isDropdownVisible" class="dropdown" id="dropdownMenu">
               <a href="#">Profil</a>
               <a href="#">Sécurité</a>
            <a href="#">Accueil</a>
              <a href="#">Progression</a>
            </div>            
        </div>
    </header>
</template>

<script setup>

import { ref } from 'vue';

const isDropdownVisible = ref(false);

function showDropdown() {
    isDropdownVisible.value = true;
}

function hideDropdown() {
    isDropdownVisible.value = false;
}
</script>

<style>
/* Réinitialisation des marges et paddings */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* En-tête */
header {
    place-self: top;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f0f0f0;
    padding: 5px 20px;
}

/* Logo */
.logo {
    display: flex;
    align-items: center;
}

.home-button {
    margin-right: 10px; /* Espacement entre le bouton et le logo */
}

.home-icon {
    width: 40px;
    height: auto;
    cursor: pointer;
}

.logo img {
    width: 85%;
    padding: 10px;
}

/* Icône de profil */
.profile {
    position: relative;
}

.profile-icon {
    width: 40px;
    height: auto;
    cursor: pointer;
}

/* Menu déroulant */
.dropdown {
    position: absolute;
    top: 40px;
    right: 0;
    background-color: #007bff;
    color: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.dropdown a {
    display: block;
    padding: 10px;
    text-decoration: none;
    color:white;
    transition: background-color 0.5s ease;
}

.dropdown a:hover {
    background-color: #0056b3;
}
</style>
