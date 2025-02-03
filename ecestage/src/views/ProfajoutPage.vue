<template>
  
    <Headers/>
    <section>
        <Ajoutslide class="slide"/>
        <Recap class="main"></Recap>
    </section>
    <Footers/>

</template>
<script>
    import Headers from '../components/headers.vue';
    import Ajoutslide from '../components/prof/slideprof.vue';
    import Recap from '../components/prof/recap.vue';
    import Footers from '../components/footers.vue';
  
    export default {
        components: {
        Headers,
        Ajoutslide,
        Recap,
        Footers
        }
    };
    
</script>
<style scoped>
section{
  display: flex;
  height: 85vh;
}
.slide{
  background-color: #fafafa;
  border-radius: 20px;
  flex: 0 0 20%;
  height :85vh;
}
.main{

  flex: 0 0 80%;
  background-color: #fafafa;
}
</style>