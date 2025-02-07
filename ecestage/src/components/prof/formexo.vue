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
    <div >
      <label for="chapitre">Chapitre :</label>
      <select v-model="selectedChapitre" @change="chargerCompetences" v-if="selectedMatiere">
        <option v-for="chapitre in chapitres" :key="chapitre.id" :value="chapitre.id">
          {{ chapitre.nom }}
        </option>
      </select>
      <p v-else>Veuillez choisir une matière</p>
    </div>

    <!-- Sélection des compétences -->
    <div >
      <label for="competence">Compétence :</label>
      <select v-model="nouvelleQuestion.id_competence" @change="chargerPoids" required v-if="selectedChapitre">
  <option value="">Choisissez une compétence</option>
  <option v-for="competence in competences" :key="competence.id_competence" :value="Number(competence.id_competence)">
    {{ competence.nom }}
  </option>
</select>
<p v-else>Veuillez choisir un chapitre</p>
    </div>

    <!-- Formulaire de création de question (visible seulement si une compétence est sélectionnée) -->
    <form  @submit.prevent="ajouterQuestion" >

      <div>
  <label for="question">Nom de la question :</label>
  <textarea v-model="nouvelleQuestion.nom" 
            ref="nom" 
            @input="ajusterTaille('nom')"
            rows="1"
            class="editable" required></textarea>
</div>

      <div>
  <label for="question">Question :</label>
  <textarea v-model="nouvelleQuestion.texte" 
            ref="texte" 
            @input="ajusterTaille('texte')"
            rows="1"
            class="editable" required></textarea>
</div>
      <div class="typepoids">
      <div>
  <label>Type de question :</label>
  <div>
    <input 
      type="radio" 
      id="qcm" 
      value="1" 
      v-model="nouvelleQuestion.type"
    />
    <label for="qcm">QCM</label>
  </div>
  
  <div>
    <input 
      type="radio" 
      id="ouverte" 
      value="2" 
      v-model="nouvelleQuestion.type"
    />
    <label for="ouverte">Question ouverte</label>
  </div>
</div>

      <div class="poids">
  <label>Poids :</label>
  <div v-for="poid in poids" :key="poid.id_poids">
    <input 
      type="radio" 
      :value="Number(poid.id_poids)" 
      v-model="nouvelleQuestion.id_poids"
    />
    {{ poid.nom }}
  </div>
</div>
</div>

      <div v-if="nouvelleQuestion.type == 1">
  <h3>Propositions</h3>
  <div class="prop" v-for="(proposition, index) in nouvelleQuestion.propositions" :key="index">
    <div class="organisation">
      <input type="text" v-model="proposition.enonce" placeholder="Enoncé" />
    <label> proposition correcte :</label>
    <input type="checkbox" v-model="proposition.est_correcte" />
    </div>
    <div class="orga">
     <input type="text" v-model="proposition.explication" placeholder="Explication" />
    <button @click="supprimerProposition(index)">Supprimer</button> 
    </div>
    
  </div>
  <button @click="ajouterProposition">Ajouter une proposition</button>
</div>

<div v-else>
  <label>Réponse :</label>
  <textarea v-model="nouvelleQuestion.reponse.reponse"
            ref="reponse"
            @input="ajusterTaille"
            rows="1"
            class="editable"></textarea>
            <label>explication :</label>
  <textarea v-model="nouvelleQuestion.reponse.explication"
            ref="explication"
            @input="ajusterTaille"
            rows="1"
            class="editable"></textarea>
</div>


      <button @click="ajouterProposition">Ajouter la question</button>
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
      poids:[],
      selectedMatiere: null,
      selectedChapitre: null,
      nouvelleQuestion: {
        nom:"",
        texte: "",
        type: "",
        id_competence: "",
        id_poids:"",
        propositions: [
          
      ],
        reponse: []
      },
      token: localStorage.getItem('token') || ""
    };
  }
,
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
        this.competences = [];
        const response = await fetch(`http://localhost:3001/api/competences/${this.selectedChapitre}`, {
          headers: { 'Authorization': `Bearer ${this.token}` }
        });
        this.competences = await response.json();
        console.log("Compétences chargées :", this.competences);
      } catch (error) {
        console.error('Erreur lors du chargement des compétences:', error);
      }
    },
    async chargerPoids(){
      try {
        this.poids=[];
        const reponse=await fetch(`http://localhost:3001/api/poids`,{
          method:'GET',
          headers: { 'Authorization': `Bearer ${this.token}` }
        });
        this.poids =await reponse.json();

        console.log("pois :",this.poids)
      } catch (error) {
        console.error('Erreur lors du chargement des poids:', error);
      }
    },
    async ajouterQuestion() {
  console.log("Valeur actuelle de id_competence :", this.nouvelleQuestion.id_competence);

  if (!this.nouvelleQuestion.id_competence || isNaN(this.nouvelleQuestion.id_competence)) {
    alert("Veuillez sélectionner une compétence avant d'ajouter la question.");
    return;
  }

  try {
    const payload = {
      nom:this.nouvelleQuestion.nom,
      texte: this.nouvelleQuestion.texte,
      type: this.nouvelleQuestion.type,
      id_competence: Number(this.nouvelleQuestion.id_competence), // Convertir en nombre
      id_poids:Number(this.nouvelleQuestion.id_poids),
      propositions: this.nouvelleQuestion.propositions,
      reponse: this.nouvelleQuestion.reponse
    };

    console.log("Données envoyées :", payload);

    await fetch('http://localhost:3001/api/questions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify(payload)
    });

    // Réinitialisation sans toucher à id_competence
    this.nouvelleQuestion = {
      ...this.nouvelleQuestion, 
      texte: "",
      type: "1",
      propositions: [],
      reponse: ""
    };

  } catch (error) {
    console.error("Erreur lors de l'ajout de la question:", error);
  }
}

,
ajouterProposition() {
  this.nouvelleQuestion.propositions.push({
    enonce: "",
    est_correcte: false,
    explication: ""
  });
},
ajouterReponse(){
  this.nouvelleQuestion.reponse.push({
    reponse:"",
    explication:""
  })
}
,
    supprimerProposition(index) {
      this.nouvelleQuestion.propositions.splice(index, 1);
    },
    
  ajusterTaille(refName) {
    this.$nextTick(() => {
      const textarea = this.$refs[refName];
      textarea.style.height = "auto"; // Réinitialise la hauteur
      textarea.style.height = textarea.scrollHeight + "px"; // Ajuste la hauteur
    });
  }

},
  mounted() {
    this.chargerMatieres();
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
.typepoids,.organisation,.orga{
  display : flex;
  flex-direction: row;

}
.prop{
  display:flex;
  flex-direction:column;
}
.poids{
 margin-left: 10px;
}
.formexo { 
     margin: 5vh;
     margin-left: 50vh;
     background-color: aliceblue;
     border-radius: 10px;
     height: 75vh;
     
 }
 .editable {
  width: 100%;
  min-height: 30px;
  max-height: 300px; /* Facultatif : limite la hauteur */
  overflow-y: hidden;
  resize: none;
  padding: 5px;
  border: 1px solid #ccc;
}


</style>
