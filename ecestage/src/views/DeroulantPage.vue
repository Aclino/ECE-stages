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
    import Deroulant from '../components/deroulant.vue';
    import DeroulantSlide from '../components/slidederoulant.vue';
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
  background-color: #dddddd;
  flex: 0 0 20%;
  height :85vh;
}
.main{

  flex: 0 0 80%;
  background-color: #eeeeee;
}
</style>