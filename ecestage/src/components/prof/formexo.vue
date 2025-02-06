<template>
  <div class="formexo">
    <h2>Créer une nouvelle question</h2>

    <!-- Sélection de la matière -->
    <div>
      <label for="matiere">Matière :</label>
      <select v-model="selectedMatiere" @change="chargerChapitres">
        <option v-for="matiere in matieres" :key="matiere.id" :value="matiere.id">
          {{ matiere.nom }}
        </option>
      </select>
    </div>

    <!-- Sélection du chapitre -->
    <div v-if="selectedMatiere">
      <label for="chapitre">Chapitre :</label>
      <select v-model="selectedChapitre" @change="chargerCompetences">
        <option v-for="chapitre in chapitres" :key="chapitre.id" :value="chapitre.id">
          {{ chapitre.nom }}
        </option>
      </select>
    </div>

    <!-- Sélection des compétences -->
    <div v-if="selectedChapitre">
      <label for="competence">Compétence :</label>
      <select v-model="nouvelleQuestion.id_competence">
        <option value="" disabled>Choisissez une compétence</option>
        <option 
          v-for="competence in competences" 
          :key="competence.id_competence" 
          :value="competence.id_competence"
        >
          {{ competence.nom }}
        </option>
      </select>
    </div>

    <!-- Sélection du poids -->
    <div>
      <label for="poids">Poids :</label>
      <select v-model="nouvelleQuestion.id_poids">
        <option 
          v-for="poids in poidsList" 
          :key="poids.id_poids" 
          :value="poids.id_poids"
        >
          {{ poids.nom }} ({{ poids.valeur }})
        </option>
      </select>
    </div>

    <!-- Formulaire de création de question -->
    <form @submit.prevent="ajouterQuestion">
      <div>
        <label for="question">Question :</label>
        <input type="text" v-model="nouvelleQuestion.texte" required />
      </div>

      <div>
        <label for="type">Type de question :</label>
        <select v-model="nouvelleQuestion.type">
          <option value="1">QCM</option>
          <option value="2">Question ouverte</option>
        </select>
      </div>

      <div v-if="nouvelleQuestion.type == 1">
        <label>Propositions :</label>
        <div v-for="(proposition, index) in nouvelleQuestion.propositions" :key="index">
          <input type="text" v-model="nouvelleQuestion.propositions[index]" />
          <button type="button" @click="supprimerProposition(index)">Supprimer</button>
        </div>
        <button type="button" @click="ajouterProposition">Ajouter une proposition</button>
      </div>

      <div v-if="nouvelleQuestion.type == 2">
        <label for="reponse">Réponse :</label>
        <input type="text" v-model="nouvelleQuestion.reponse" />
      </div>

      <button type="submit">Ajouter</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      matieres: [],
      chapitres: [],
      competences: [],
      poidsList: [],
      selectedMatiere: null,
      selectedChapitre: null,
      nouvelleQuestion: {
        nom: "Question", // Ajout du nom par défaut
        texte: "",
        type: "1",
        id_competence: null,
        id_poids: 1, // Valeur par défaut
        propositions: [],
        reponse: ""
      },
      token: localStorage.getItem('token') || ""
    };
  },
  methods: {
    async chargerMatieres() {
      try {
        const response = await fetch('http://localhost:3001/api/subjects', {
          headers: { 'Authorization': `Bearer ${this.token}` }
        });
        this.matieres = await response.json();
      } catch (error) {
        console.error('Erreur lors du chargement des matières:', error);
      }
    },
    async chargerChapitres() {
      try {
        this.selectedChapitre = null;
        this.competences = [];
        const response = await fetch(`http://localhost:3001/api/chapters?matiere=${this.selectedMatiere}`, {
          headers: { 'Authorization': `Bearer ${this.token}` }
        });
        this.chapitres = await response.json();
      } catch (error) {
        console.error('Erreur lors du chargement des chapitres:', error);
      }
    },
    async chargerCompetences() {
      try {
        const response = await fetch(`http://localhost:3001/api/competences/${this.selectedChapitre}`, {
          headers: { 'Authorization': `Bearer ${this.token}` }
        });
        this.competences = await response.json();
      } catch (error) {
        console.error('Erreur lors du chargement des compétences:', error);
      }
    },
    async chargerPoids() {
      try {
        const response = await fetch('http://localhost:3001/api/poids', {
          headers: { 'Authorization': `Bearer ${this.token}` }
        });
        this.poidsList = await response.json();
      } catch (error) {
        console.error('Erreur lors du chargement des poids:', error);
      }
    },
    async ajouterQuestion() {
      if (!this.nouvelleQuestion.id_competence) {
        alert("Veuillez sélectionner une compétence avant d'ajouter la question.");
        return;
      }

      try {
        const response = await fetch('http://localhost:3001/api/questions', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({
            nom: this.nouvelleQuestion.nom,
            texte: this.nouvelleQuestion.texte,
            type: this.nouvelleQuestion.type,
            propositions: this.nouvelleQuestion.propositions,
            reponse: this.nouvelleQuestion.reponse,
            id_competence: this.nouvelleQuestion.id_competence,
            id_poids: this.nouvelleQuestion.id_poids
          })
        });

        if (response.ok) {
          alert("Question ajoutée avec succès !");
          this.resetFormulaire();
        } else {
          const errorData = await response.json();
          alert("Erreur lors de l'ajout de la question : " + errorData.error);
        }
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la question:', error);
        alert("Une erreur s'est produite lors de l'ajout de la question.");
      }
    },
    resetFormulaire() {
      this.nouvelleQuestion = {
        nom: "Question",
        texte: "",
        type: "1",
        id_competence: null,
        id_poids: 1,
        propositions: [],
        reponse: ""
      };
      this.selectedMatiere = null;
      this.selectedChapitre = null;
      this.competences = [];
    },
    ajouterProposition() {
      this.nouvelleQuestion.propositions.push("");
    },
    supprimerProposition(index) {
      this.nouvelleQuestion.propositions.splice(index, 1);
    }
  },
  mounted() {
    this.chargerMatieres();
    this.chargerPoids();
  }
};
</script>

<style scoped>
.formexo {
  max-width: 500px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
button {
  margin-top: 10px;
}
</style>