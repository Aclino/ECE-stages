<template>
    <div class="container">
      <h2>Gestion des Compétences</h2>
  
      <!-- Sélection de la matière -->
      <div>
        <label for="matiere">Sélectionner une matière :</label>
        <select v-model="selectedMatiere" @change="fetchChapitres">
          <option v-for="matiere in matieres" :key="matiere.id" :value="matiere.id">
            {{ matiere.nom }}
          </option>
        </select>
      </div>
  
      <!-- Sélection du chapitre -->
      <div v-if="selectedMatiere">
        <label for="chapitre">Sélectionner un chapitre :</label>
        <select v-model="selectedChapitre" @change="fetchCompetences">
          <option v-for="chapitre in chapitres" :key="chapitre.id" :value="chapitre.id">
            {{ chapitre.nom }}
          </option>
        </select>
      </div>
  
      <!-- Ajout d'une compétence -->
      <div v-if="selectedChapitre">
        <h3>Ajouter une compétence</h3>
        <input v-model="nouvelleCompetence.nom" placeholder="Nom de la compétence" />
        <input v-model="nouvelleCompetence.description" placeholder="Description" />
        <input v-model="nouvelleCompetence.ordre" type="number" placeholder="Ordre" />
        <select v-model.number="nouvelleCompetence.id_poids">
            <option v-for="poids in poidsOptions" :key="poids.id_poids" :value="poids.id_poids">
                {{ poids.nom }} ({{ poids.valeur }})
            </option>

        </select>
        <button @click="ajouterCompetence">Ajouter</button>
      </div>
  
      <!-- Liste des compétences -->
      <div v-if="competences.length">
        <h3>Compétences du chapitre sélectionné</h3>
        <ul>
            <li v-for="competence in competences" :key="competence.nom">
                {{ competence.nom }} - {{ competence.description }} (Poids: {{ competence.poids }})
                <button @click="supprimerCompetence(competence.nom)">Supprimer</button>
            </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        matieres: [],
        chapitres: [],
        competences: [],
        poidsOptions: [],
        selectedMatiere: null,
        selectedChapitre: null,
        nouvelleCompetence: {
          nom: "",
          description: "",
          ordre: "",
          id_poids: "",
        },
      };
    },
    methods: {
      async fetchMatieres() {
        try {
          const response = await fetch('http://localhost:3001/api/subjects', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          this.matieres = await response.json();
        } catch (error) {
          console.error('Erreur lors du chargement des matières:', error);
        }
      },
      async fetchChapitres() {
        if (!this.selectedMatiere) return;
        try {
          const response = await fetch(`http://localhost:3001/api/chapters?matiere=${this.selectedMatiere}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          this.chapitres = await response.json();
        } catch (error) {
          console.error('Erreur lors du chargement des chapitres:', error);
        }
      },
      async fetchCompetences() {
    if (!this.selectedChapitre) return;
    try {
        const response = await fetch(`http://localhost:3001/api/competences/${this.selectedChapitre}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        const data = await response.json();
        console.log("Toutes les compétences reçues du backend:", data);

        this.competences = data;
    } catch (error) {
        console.error('Erreur lors du chargement des compétences:', error);
    }
}

,
async fetchPoids() {
  try {
    const response = await fetch('http://localhost:3001/api/poids', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    this.poidsOptions = await response.json();
    console.log("Poids chargés:", this.poidsOptions); // Vérification
  } catch (error) {
    console.error('Erreur lors du chargement des poids:', error);
  }
}
,
async ajouterCompetence() {
  console.log("Nouvelle compétence à ajouter:", this.nouvelleCompetence);
  
  try {
    const response = await fetch('http://localhost:3001/api/competences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        ...this.nouvelleCompetence,
        id_chapitre: this.selectedChapitre
      })
    });
    if (response.ok) {
      this.fetchCompetences();
    } else {
      console.error("Erreur lors de l'ajout:", await response.text());
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout de la compétence:", error);
  }
}
,
async supprimerCompetence(nom) {
    try {
        const response = await fetch(`http://localhost:3001/api/competences`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ nom, id_chapitre: this.selectedChapitre })
        });

        if (response.ok) {
            this.fetchCompetences(); // Rafraîchir la liste
        } else {
            console.error("Erreur lors de la suppression:", await response.json());
        }
    } catch (error) {
        console.error("Erreur lors de la suppression de la compétence:", error);
    }
}
    },
    mounted() {
      this.fetchMatieres();
      this.fetchPoids();
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }
  h2, h3 {
    text-align: center;
  }
  input, select, button {
    display: block;
    width: 100%;
    margin: 10px 0;
    padding: 8px;
  }
  button {
    background-color: #28a745;
    color: white;
    border: none;
    cursor: pointer;
  }
  button:hover {
    background-color: #218838;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    background: white;
    margin: 5px 0;
    padding: 10px;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
  }
  li button {
    background-color: #dc3545;
  }
  li button:hover {
    background-color: #c82333;
  }
  </style>
  