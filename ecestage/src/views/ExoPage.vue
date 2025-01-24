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
    import ExoSlide from '../components/exoSlide.vue';
    import Exo from '../components/exo.vue';
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