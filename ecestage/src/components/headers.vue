<template>
    <header>
        <div class="home-button">
            <a href="accueil.html">
                <img src="" alt="Accueil" class="home-icon">
            </a>
        </div>
        <div class="logo">
            <img src="../../" alt="Logo ECE">
        </div>
        
        <div class="profile">
            <img src="../../images/Icone-profill.png" alt="Profil" class="profile-icon" id="profileIcon">
            <div class="dropdown" id="dropdownMenu">
                <a >Profil</a>
                <a >Sécurité</a>
                <a >Accueil</a>
                <a >Progression</a>
            </div>            
        </div>
    </header>
</template>
<script>
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
    width: 200px;
    height: 150px;
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
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    display: none;
}

.dropdown a {
    display: block;
    padding: 10px;
    text-decoration: none;
    color: #333;
}

.dropdown a:hover {
    background-color: #f0f0f0;
}



</style>