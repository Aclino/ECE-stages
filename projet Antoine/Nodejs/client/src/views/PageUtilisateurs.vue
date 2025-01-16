<template>
    <div>
        <h1>Utilisateurs</h1>
        <div v-if="isLoading">
            Chargement en cours...
        </div>
        <table v-else>
            <thead>
            <tr>
                <th>Prénom</th>
                <th>Nom</th>
                <th>Roles</th>
            </tr>
            </thead>
            <tbody>
            <Utilisateur v-for="(user,indice) in users" :key="user._id" :user="user" :indice="indice" v-on:deleted="userDeleted"/>
            </tbody>
        </table>
    </div>
</template>

<script>
    import axios from 'axios';
    import Utilisateur from "../components/Utilisateur";

    export default {
        data() {
            return {
                isLoading: true,
                users: []
            }
        },
        components: {
            Utilisateur
        },
        created() {
            axios
                .get('http://localhost:3000/api/users')
                .then(({data}) => {
                    this.users = data;
                    this.isLoading = false;
                })
        },
        methods: {
            userDeleted(user) {
                console.log(user);
            }
        }
    }
</script>
