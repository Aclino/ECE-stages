<template>
  
    <Headers/>
    <section>
        <Ajoutslide class="slide"/>
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
  flex-wrap: wrap;
  height: 85h;
}
.slide{
  background-color: #fafafa;
  flex: 0 0 20%;
  height :85vh;
  word-break:break-word;
}
.main{
  flex: 0 0 80%;
  background-color: #fafafa;
}
</style>