<template>
    <div class="">
      <h2 class="">Ajouter une Matière</h2>
      <form @submit.prevent="ajouterMatiere" class="space-y-4">
        <input 
          v-model="nouvelleMatiere" 
          type="text" 
          placeholder="Nom de la matière" 
          class="w-full p-2 border rounded"
          required
        />
        
        <!-- Sélection des promotions avec des checkboxes -->
        <div class="">
          <p class="">Sélectionner les promotions :</p>
          <div v-for="promo in promotions" :key="promo.id_promotion" class="flex items-center space-x-2">
            <input 
              type="checkbox" 
              :id="`promo-${promo.id_promotion}`" 
              :value="promo.id_promotion" 
              v-model="promotionsSelectionnees" 
              class="form-checkbox h-4 w-4 text-blue-500"
            />
            <label :for="`promo-${promo.id_promotion}`">{{ promo.nom }}</label>
          </div>
        </div>
        
        <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">Ajouter</button>
      </form>
      
      <!-- Affichage des matières avec les promotions associées -->
      <h3 class="text-lg font-semibold mt-6">Matières assignées</h3>
      <ul class="mt-2 space-y-4">
        <li v-for="(matiere, index) in matieresAttribuees" :key="index" class="p-4 border rounded">
          <div class="flex justify-between items-center">
            <span class="font-bold">{{ matiere.nom }}</span>
            <button @click="supprimerMatiere(matiere.id)" class="text-red-500">Supprimer</button>
          </div>
          <ul id="promo" class="ml-4 mt-2 list-disc">
            <li v-for="promo in matiere.promotions" :key="promo.id_promotion">
              {{ promo.nom }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
</template>
  
<script setup>
  import { ref, onMounted } from 'vue';
  
  // Données réactives
  const nouvelleMatiere = ref('');
  const promotionsSelectionnees = ref([]);  // Stocker plusieurs promotions sélectionnées
  const promotions = ref([]);
  const matieresAttribuees = ref([]);  // Stocke les matières avec leurs promotions
  
  // Récupérer les promotions depuis l'API
  const obtenirPromotions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/promotions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        promotions.value = await response.json();
      } else {
        console.error('Erreur lors de la récupération des promotions');
      }
    } catch (err) {
      console.error('Erreur API:', err);
    }
  };
  
  // Regrouper les matières et les promotions associées
  const obtenirMatieres = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/subjects`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
  
        // Regrouper les matières par nom avec leurs promotions
        const groupedMatieres = data.reduce((acc, matiere) => {
          let existingMatiere = acc.find(m => m.nom === matiere.nom);
          if (existingMatiere) {
            existingMatiere.promotions.push({
              id_promotion: matiere.id_promotion,
              nom: obtenirNomPromo(matiere.id_promotion)
            });
          } else {
            acc.push({
              id: matiere.id,
              nom: matiere.nom,
              promotions: [{
                id_promotion: matiere.id_promotion,
                nom: obtenirNomPromo(matiere.id_promotion)
              }]
            });
          }
          return acc;
        }, []);
  
        matieresAttribuees.value = groupedMatieres;
      } else {
        console.error('Erreur lors de la récupération des matières assignées');
      }
    } catch (err) {
      console.error('Erreur API:', err);
    }
  };
  
  // Obtenir le nom de la promotion à partir de son ID
  const obtenirNomPromo = (id_promotion) => {
    const promo = promotions.value.find(p => p.id_promotion === id_promotion);
    return promo ? promo.nom : 'Promotion inconnue';
  };
  
  // Ajouter une matière à plusieurs promotions
  const ajouterMatiere = async () => {
    if (nouvelleMatiere.value && promotionsSelectionnees.value.length > 0) {
      try {
        // Ajouter la matière une seule fois et récupérer son ID
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/subjects`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            nom: nouvelleMatiere.value,
            id_promotion: promotionsSelectionnees.value[0],  // Créer la matière avec la première promo
          }),
        });
  
        if (response.ok) {
          const addedSubject = await response.json();
  
          // Assigner la matière aux autres promotions
          const assignPromises = promotionsSelectionnees.value.slice(1).map(async (promoId) => {
            await fetch(`${import.meta.env.VITE_API_URL}/api/subjects`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
              body: JSON.stringify({
                nom: addedSubject.nom,
                id_promotion: promoId,
              }),
            });
          });
  
          await Promise.all(assignPromises);
  
          // Mettre à jour l'affichage avec regroupement des promotions
          const existingMatiere = matieresAttribuees.value.find(m => m.nom === addedSubject.nom);
          if (existingMatiere) {
            promotionsSelectionnees.value.forEach(promoId => {
              if (!existingMatiere.promotions.some(p => p.id_promotion === promoId)) {
                existingMatiere.promotions.push({
                  id_promotion: promoId,
                  nom: obtenirNomPromo(promoId)
                });
              }
            });
          } else {
            matieresAttribuees.value.push({
              id: addedSubject.id,
              nom: addedSubject.nom,
              promotions: promotionsSelectionnees.value.map(promoId => ({
                id_promotion: promoId,
                nom: obtenirNomPromo(promoId)
              }))
            });
          }
  
          // Réinitialiser le formulaire
          nouvelleMatiere.value = '';
          promotionsSelectionnees.value = [];
        } else {
          console.error("Erreur lors de l'ajout de la matière");
        }
      } catch (err) {
        console.error('Erreur API:', err);
      }
    }
  };
  
  // Supprimer une matière
  const supprimerMatiere = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/subjects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        matieresAttribuees.value = matieresAttribuees.value.filter(matiere => matiere.id !== id);
      } else {
        console.error('Erreur lors de la suppression de la matière');
      }
    } catch (err) {
      console.error('Erreur API:', err);
    }
  };
  
  // Charger les promotions et matières au montage
  onMounted(() => {
    obtenirPromotions();
    obtenirMatieres();
  });
</script>
  
<style scoped>
  div {
    background: rgba(0, 255, 0, 0.1);
  }
  #promo{
    display:flex;
    flex-direction: row;
  }
  #promo li{
    margin-left: 5px;
    list-style: none;
    text-decoration: none;
    color: inherit;
  }
</style>
  