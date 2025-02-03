<template>
    <div>
        <Headers />
            <section>
                <div class="slide"><DeroulantSlide /></div>
                <div class="main"><Deroulant /></div>
            </section>
        <Footers />
    </div>
</template>

<script>
    import Headers from '../components/headers.vue';
    import Deroulant from '../components/eleve/deroulant.vue';
    import DeroulantSlide from '../components/eleve/slidederoulant.vue';
    import Footers from '../components/footers.vue';
  
    export default {
        components: {
        Headers,
        Deroulant,
        DeroulantSlide,
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