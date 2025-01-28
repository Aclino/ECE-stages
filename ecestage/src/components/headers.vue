<template>
    <header>
        <div class="home-button">
            <router-link to="/">
                <img src="../images/home-icon.png" alt="Accueil" class="home-icon">
            </router-link>
        </div>
        <div class="logo">
            <router-link to="/exo">
                <img src="../images/ECE_LOGO.png" alt="Logo ECE">
            </router-link>
        </div>
        
        <div 
            class="profile"
            @mouseover="showDropdown"
            @mouseleave="hideDropdown"
        >
            <router-link to="/profil">
                <img src="../images/Icone-profil.png" alt="Profil" class="profile-icon" id="profileIcon">
            </router-link>
            <div v-show="isDropdownVisible" class="dropdown" id="dropdownMenu">
                <router-link to="/profil">Profil</router-link>
                <a @click="ladeco" href="">Déconnection</a>
            </div>            
        </div>
    </header>
</template>

<script setup>

function ladeco(){
localStorage.removeItem('token');
}
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
    /* background: linear-gradient(180deg, #b6b6b6, #e9e9e9);; */
    background-color: #f0f6f7;
    border-radius: 20px 20px 20px 20px;
    margin: 10px;
    padding: 5px 20px;
    height: calc(10vh - 20px);
}

/* Logo */
.logo {
    text-align: center;
}

.logo a {
    display: block;
    width: 30%;
    margin: 0 auto;
}

.logo img {
    display: block;
    width: 100%;
}

.home-button {
    margin-right: 10px;
}

.home-icon {
    width: 40px;
    height: auto;
    cursor: pointer;
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
    background-color: #00828b;
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
    font-family: 'Montserrat', sans-serif;
}

.dropdown a:hover {
    background-color: #006f79;
}
</style>
