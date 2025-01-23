<script setup>
import { ref } from 'vue';
import deroulant from './components/deroulant.vue';
import slidederoulant from './components/slidederoulant.vue'
import exo from './components/exo.vue';
import exoSlide from './components/exoSlide.vue';
import headers from './components/headers.vue';
import footers from './components/footers.vue';
import profil from './components/profil.vue'
</script>

<template>

<headers/>

<section>
<div class="slide"><exoSlide/></div>
<div class="main"><profil/></div>


</section>

<footers/>

</template>

<style>
section{
  display: flex;
  height: 85vh;
}
.slide{
  background-color: #dddddd;
  flex: 0 0 20%;
  height :85vh;
}
.main{

  flex: 0 0 80%;
  background-color: #eeeeee;
}
</style>
