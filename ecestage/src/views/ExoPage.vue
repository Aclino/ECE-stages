<template>
    <div>
        <Headers />
            <section>
                <div class="slide"><ExoSlide /></div>
                <div class="main"><Exo /> </div>
            </section>
        <Footers />
    </div>
</template>

<script>
    import Headers from '../components/headers.vue';
    import ExoSlide from '../components/eleve/exoSlide.vue';
    import Exo from '../components/eleve/exo.vue';
    import Footers from '../components/footers.vue';
  
    export default {
        components: {
        Headers,
        Exo,
        ExoSlide,
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
  flex: 0 0 20%;
  height :85vh;
}
.main{
  flex: 0 0 80%;
  background-color: #fafafa;
}
</style>