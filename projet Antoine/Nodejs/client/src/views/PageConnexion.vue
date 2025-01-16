<template>
    <div class="container padtopbot">
        <form @submit.prevent="login" class="grid">
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
                    <router-link to="/inscription">Je n'ai pas encore de compte</router-link>
                </div>
        </form>
    </div>
</template>

<script>
    export default {
        name: 'PageConnexion',
        data: () => {
            return {
                email: '',
                password: ''
            };
        },
        methods: {
            login() {
                this.$store
                    .dispatch('login', {
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
                    });
            }
        }
    };
</script>
