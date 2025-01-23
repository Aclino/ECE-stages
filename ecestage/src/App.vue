<script setup>
import { ref } from 'vue';
import deroulant from './components/deroulant.vue';
import slidederoulant from './components/slidederoulant.vue'
import exo from './components/exo.vue';
import exoSlide from './components/exoSlide.vue';
import headers from './components/headers.vue';
import footers from './components/footers.vue';
</script>

<template>

<headers/>

<section>
<div class="slide"><exoSlide/></div>
<div class="main"><exo/></div>
<!-- <div class="slide"><slidederoulant/></div>
<div class="main"><deroulant /> </div> -->

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
  flex: 0 0 80%;
  background-color: #eeeeee;
}
</style>
