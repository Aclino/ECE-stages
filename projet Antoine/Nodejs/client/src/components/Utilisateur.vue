<template>
    <tr>
        <td><input type="text" v-model="formUser.firstname" :disabled="!edition"></td>
        <td>{{formUser.lastname}}</td>
        <td><span v-if="formUser.admin" class="tag">admin</span></td>
        <td>
            <button @click="edit" v-if="!edition">modifier</button>
            <span v-else>
                <button @click="edit">annuler</button>
                <button @click="remove">supprimer</button>
                <button @click="updateUser">sauvegarder</button>
            </span>
        </td>
    </tr>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'Utilisateur',
        props: {
            user: Object,
            indice: Number
        },
        data() {
            return {
                edition: false,
                formUser: null
            }
        },
        created() {
            this.formUser = JSON.parse(JSON.stringify(this.user));
        },
        methods: {
            edit() {
                this.edition = !this.edition;
                if (!this.edition) {
                    this.formUser = JSON.parse(JSON.stringify(this.user));
                }
            },
            remove() {
                axios
                    .delete('http://localhost:3000/api/users/'+this.user._id)
                    .then(() => {
                        this.$emit('deleted', this.indice);
                    });
            },
            updateUser() {
                this.edition = !this.edition;
            }
        }
    }
</script>

<style scoped>

    input {
        border: solid 1px #cdcdcd;
        background-color: inherit;
        color: inherit;
        font-weight: inherit;
        font-size: 1em;
        padding: 4px;
        margin: 3px;
    }

    input:disabled {
        border: none;
        background-color: inherit;
        color: inherit;
        font-weight: inherit;
        font-size: 1em;
        padding: 4px;
        margin: 4px;
    }
</style>
