<template>
    <div>
        <Headers />
            <section>
                <Profil />
            </section>
        <Footers />
    </div>
</template>

<script>
    import Headers from '../components/headers.vue';
    import Profil from '../components/profil.vue';
    import Footers from '../components/footers.vue';
  
    export default {
        components: {
        Headers,
        Profil,
        Footers
        }
    };
</script>

<style>
section{
  display: flex;
  height: 85vh;
  align-items: center;
}

</style>