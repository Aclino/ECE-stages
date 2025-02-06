<template>
  <div class="formexo">
    <h2>Créer une nouvelle question</h2>

    <!-- Existing subject, chapter, competence, and weight selectors remain the same -->
    
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

      <!-- QCM Specific Fields -->
      <div v-if="nouvelleQuestion.type == 1">
        <div v-for="(proposition, index) in nouvelleQuestion.propositions" :key="index" class="proposition-group">
          <input type="text" v-model="proposition.enonce" placeholder="Énoncé de la proposition" />
          <input type="text" v-model="proposition.explication" placeholder="Explication" />
          <label>
            <input type="checkbox" v-model="proposition.est_correcte" />
            Correcte
          </label>
          <button type="button" @click="supprimerProposition(index)">Supprimer</button>
        </div>
        <button type="button" @click="ajouterProposition">Ajouter une proposition</button>
      </div>

      <!-- Question Ouverte Specific Fields -->
      <div v-if="nouvelleQuestion.type == 2">
        <label>Réponse :</label>
        <input type="text" v-model="nouvelleQuestion.reponse.reponse" placeholder="Réponse" />
        <input type="text" v-model="nouvelleQuestion.reponse.explication" placeholder="Explication de la réponse" />
      </div>

      <button type="submit">Ajouter</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // ... previous data properties ...
      nouvelleQuestion: {
        nom: "Question",
        texte: "",
        type: "1",
        id_competence: null,
        id_poids: 1,
        propositions: [],
        reponse: {
          reponse: "",
          explication: ""
        }
      }
    };
  },
  methods: {
    // ... previous methods ...
    ajouterProposition() {
      this.nouvelleQuestion.propositions.push({
        enonce: "",
        explication: "",
        est_correcte: false
      });
    },
    async ajouterQuestion() {
      if (!this.nouvelleQuestion.id_competence) {
        alert("Veuillez sélectionner une compétence.");
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
            reponse: this.nouvelleQuestion.type === 2 ? this.nouvelleQuestion.reponse : null,
            id_competence: this.nouvelleQuestion.id_competence,
            id_poids: this.nouvelleQuestion.id_poids
          })
        });

        if (response.ok) {
          alert("Question ajoutée avec succès !");
          this.resetFormulaire();
        } else {
          const errorData = await response.json();
          alert("Erreur : " + errorData.error);
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert("Une erreur s'est produite.");
      }
    }
  }
};
</script>

<style scoped>
.proposition-group {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
</style>