<script setup>
import { ref } from 'vue';
import headers from './components/headers.vue';
import footers from './components/footers.vue';
import profil from './components/profil.vue'
</script>

<template>

  <div>

    <router-view></router-view>

  </div>

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
