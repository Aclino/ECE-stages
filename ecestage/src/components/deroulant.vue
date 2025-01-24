<template>
    <section class="infos">
        <div class="tree">
            <div class="tree-item">
                <span class="folder-icon">📚</span> <h1>{{ matiere }}</h1>
            </div>

            <div class="tree-children">
                <div class="tree-item">
                    <span class="folder-icon">📁</span> <h2>{{ chapitre }}</h2>
                </div>

                <div class="tree-children">
                    <div class="tree-item" v-for="(comp, index) in competences" :key="index">
                        <span class="file-icon">📄</span> <h3>{{ comp }}</h3>
                    </div>
                </div>
            </div>

            <!-- Barre de progression -->
            <div class="progress-container">
                <p>Progression</p>
                <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: progression + '%' }"></div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';

const progression = ref(60); // Exemple : 60% de progression

// Simule plusieurs compétences
const competences = ref([
    "Comprendre les fractions",
    "Appliquer le théorème de Pythagore",
    "Résoudre des équations"
]);
</script>

<style scoped>
/* RESET */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.infos {
    background: #2c3e50; /* Fond sombre type explorateur */
    color: white;
    height: 85vh; /* Occuper toute la hauteur de l'écran */
    width: 280px; /* Largeur fixe */
    padding: 15px;
    font-family: 'Arial', sans-serif;
    box-shadow: 4px 0px 10px rgba(0, 0, 0, 0.2);
    overflow-y: auto; /* Permet de scroller si beaucoup d'infos */
}

/* Arborescence */
.tree {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.tree-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    border-radius: 5px;
    transition: background 0.3s;
}

.tree-item:hover {
    background: rgba(255, 255, 255, 0.1);
}

/* Indentation */
.tree-children {
    margin-left: 20px;
}

/* Icônes */
.folder-icon {
    font-size: 1.2em;
}

.file-icon {
    font-size: 1em;
}

/* Titres stylisés */
h1 {
    font-size: 1.5em;
    font-weight: bold;
}

h2 {
    font-size: 1.2em;
}

h3 {
    font-size: 1em;
}

/* Barre de progression */
.progress-container {
    margin-top: auto;
    text-align: center;
    padding-top: 20px;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 5px;
    overflow: hidden;
    margin-top: 5px;
}

.progress-fill {
    height: 100%;
    background: #4CAF50;
    width: 50%;
    transition: width 0.5s ease-in-out;
    border-radius: 5px;
}
</style>
