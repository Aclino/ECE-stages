<template>
  <div>
    <h2>Ajouter un chapitre</h2>
    <form @submit.prevent="ajouterChapitre" class="space-y-4">
      <input 
        v-model="nouveauChapitre" 
        type="text" 
        placeholder="Nom du chapitre" 
        required
      />
      <textarea 
        v-model="description" 
        placeholder="Description du chapitre"
        class="w-full p-2 border rounded"
      ></textarea>

      <!-- Sélection des matières -->
      <div>
        <p>Sélectionner la matière :</p>
        <div v-for="matiere in matieres" :key="matiere.id" class="flex items-center space-x-2">
          <input 
            type="radio" 
            :id="`matiere-${matiere.id}`" 
            :value="matiere.id" 
            v-model="matiereSelectionnee" 
            class="form-radio h-4 w-4 text-blue-500"
          />
          <label :for="`matiere-${matiere.id}`">{{ matiere.nom }}</label>
        </div>
      </div>
      
      <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">Ajouter</button>
    </form>
    
    <!-- Affichage des chapitres -->
    <h3 class="text-lg font-semibold mt-6">Chapitres assignés</h3>
    <ul class="mt-2 space-y-4">
      <li v-for="(chapitre, index) in chapitres" :key="index" class="p-4 border rounded">
        <div class="flex justify-between items-center">
          <span class="font-bold">{{ chapitre.nom }}</span>
          <button @click="supprimerChapitre(chapitre.id)" class="text-red-500">Supprimer</button>
        </div>
        <!--p class="text-gray-600">{{ chapitre.description }}</p-->
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';


const nouveauChapitre = ref('');
const description = ref('');
const matiereSelectionnee = ref(null);
const matieres = ref([]);
const chapitres = ref([]);
const API_URL = 'http://localhost:3001/api';

// Récupérer les matières
const fetchMatieres = async () => {
  try {
    const response = await fetch(`${API_URL}/subjects`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Erreur de récupération des matières');
    matieres.value = await response.json();
  } catch (error) {
    console.error(error);
  }
};

// Récupérer les chapitres
const fetchChapitres = async () => {
  try {
    const response = await fetch(`${API_URL}/chapters`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) throw new Error('Erreur de récupération des chapitres');
    chapitres.value = await response.json();
  } catch (error) {
    console.error(error);
  }
};

// Ajouter un chapitre
const ajouterChapitre = async () => {
  if (!nouveauChapitre.value || !matiereSelectionnee.value) return;

  try {
    const response = await fetch(`${API_URL}/chapters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        nom: nouveauChapitre.value,
        description: description.value,
        id_matiere: matiereSelectionnee.value,
      }),
    });

    if (!response.ok) throw new Error('Erreur lors de l’ajout du chapitre');

    const newChapitre = await response.json();
    chapitres.value.push(newChapitre);
    nouveauChapitre.value = '';
    description.value = '';
  } catch (error) {
    console.error(error);
  }
};

// Supprimer un chapitre
const supprimerChapitre = async (id) => {
  try {
    const response = await fetch(`${API_URL}/chapters/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });

    if (!response.ok) throw new Error('Erreur lors de la suppression');

    chapitres.value = chapitres.value.filter(chapitre => chapitre.id !== id);
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchMatieres();
  fetchChapitres();
});
</script>
