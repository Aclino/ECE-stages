<script setup>
import { ref } from 'vue';
import deroulant from './components/deroulant.vue';
import headers from './components/headers.vue';
import footers from './components/footers.vue';
import slidederoulant from './components/slidederoulant.vue'
// Références réactives
const count = ref(0);
const showComponent = ref(false); // Contrôle l'affichage du composant

// Fonction pour incrémenter le compteur
const increment = () => {
  count.value++;
  if (count.value > 10) {
    showComponent.value = true; // Affiche le composant lorsque le compteur dépasse 10
  }
};
</script>

<template>
<headers/>
<section>
<div class="slide"><slidederoulant/></div>
<div class="main"><deroulant /> </div>
 
</section>


<footers/>
  

</template>

<style>
section{
  display: flex;
  width: 100%;
}
.slide{
  background-color: #dddddd;
flex: 0 0 20%;
}
.main{
  min-height: 100%;
  margin: 1.5%;
  flex: 0 0 80%;
  background-color: #eeeeee;
}

</style>
