<template><section class="slot">
<slot></slot></section>
</template>
<style scoped>
button {
    position: relative;
    overflow: hidden; /* Évite les débordements */
    background: linear-gradient(90deg, #a5b1ff, #1c02c4);
    border: none;
    color: white;
    text-align: right;
    border-radius: 10px;
    height: calc(50% - 5%);
    padding: 4px 7px;
    margin: 10px 0px 10px 10px;
    font-family: 'Montserrat', sans-serif;
    
    transition: background-color 0.45s ease-in-out;
    z-index: 1;
}

/* Pseudo-élément pour l'effet de transition */
button::after {
    content: "";
    position: absolute;
    inset: 0; /* Prend toute la place du bouton */
    background: linear-gradient(90deg,  #1c02c4, #a5b1ff);
    opacity: 0; /* Caché par défaut */
    transition: opacity 0.45s ease-in-out;
    z-index: -1; /* Passe derrière le texte */
}

/* Au survol, on affiche le nouveau dégradé */
button:hover::after {
    opacity: 1;
}

</style>