<template>
  <h1>le tuto dè {{ firstName.toUpperCase() }}</h1>
  <p :class ="{active: count <5}" >Compteur : {{ count }} </p>
  <div v-show="count>5">ça fait 5 secondes</div>
  <button v-on:click="incrément">r</button>
  <hr>
  <hr>
  <button @click="trie">Réorganiser</button>
  <form action="" v-on:click.preventDefault="ajout">
    <input type="text" placeholder="Nouveau film" v-model='movienam'>
    <button >ajouter film</button>{{ movienam }}
  </form>
  <ul>
    <li v-for="movies in movie">{{ movies }} <button @click="deleteMovie(movies)">suppr</button></li>
  </ul>
  <ul>
    <li> {{ person.first }} </li>
    <li>{{ person.last }}</li>
    <li>{{ person.age }} <button @click.prevent="changerage">changer age</button></li>
  </ul>
</template>
<script setup>
import {ref} from 'vue'
const person= ref({
      first: 'oscar',
      last:'nicola',
      age:10000
})
const changerage =()=>{
  person.value.age = Math.round(Math.random()*100)
}
const count = ref(0)
const firstName ='Demo'
const movie= ref([
  'Matrix','lilo','ismaël'
])
const incrément = ()=>{
  count.value=0
}
const deleteMovie=(movies)=>{
  movie.value=movie.value.filter(m => m != movies)
}
const movienam = ref('')
setInterval(() => {
  count.value++
}, 1000);
const trie =()=>{
  movie.value.sort((a,b)=>a>b?-1:1)
}
const ajout =()=>{
  movie.value.push(movienam.value)
  movienam.value=''
}
</script>
<style>
h1 {
  color: red;
}
</style>