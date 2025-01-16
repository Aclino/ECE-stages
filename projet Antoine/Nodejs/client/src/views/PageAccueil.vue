<template>
    <div class="home">

        <h1>Schoodle  |<span class="rainbow-text"> 01001101101</span></h1>
        <div v-if="!loggedIn">
            Vous devez
            <router-link to="/inscription">créer un compte</router-link>
            ou vous
            <router-link to="/connexion">connecter</router-link>
            .
        </div>
    </div>
</template>

<script>
    import {authComputed} from '@/store/helpers'

    export default {
        name: 'PageAccueil',
        computed: {
            ...authComputed
        }
    }
</script>
