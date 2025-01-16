<template>
    <div class="container padtopbot">
        <form @submit.prevent="register" class="grid">
            <label for="firstname">
                Prénom :
            </label>
            <input type="text" v-model="firstname" id="firstname">
            <label for="lastname">
                Nom :
            </label>
            <input type="text" v-model="lastname" id="lastname">
            <label for="email">
                E-mail :
            </label>
            <input type="text" v-model="email" id="email">
            <label for="password">
                Mot de passe :
            </label>
            <input type="password" v-model="password" id="password">
            <div>
                <input type="submit" value="Connexion"> |
                <router-link to="/connexion">J'ai déjà un compte</router-link>
            </div>

        </form>
    </div>
</template>

<script>
    export default {
        name: 'PageInscription',
        data: () => {
            return {
                firstname: '',
                lastname: '',
                email: '',
                password: ''
            };
        },
        methods: {
            register() {
                this.$store
                    .dispatch('register', {
                        firstname: this.firstname,
                        lastname: this.lastname,
                        email: this.email,
                        password: this.password
                    })
                    .then(() => {
                        this.$router.push({name: 'dashboard'})
                    })
                    .catch(err => {
                    this.$notify({
                        group: 'notifs',
                        type: 'error',
                        title: 'Erreur',
                        text: err.response.data.errors.join(' ')
                    });
                })
            }
        }
    };
</script>

<style scoped>

</style>
