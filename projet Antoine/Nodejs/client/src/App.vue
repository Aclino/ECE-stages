<template>
    <div id="app">
        <header>
            <nav>
                <ul>
                    <li>
                        <router-link to="/">
                            <img alt="Logo Antoine HTY" src="./assets/logo-antoine-hintzy.png" class="logo">
                        </router-link>
                    </li>
                    <li v-if="loggedIn">
                        <router-link to="/dashboard">Dashboard</router-link>
                    </li>
                    <li v-if="!loggedIn">
                        <router-link to="/inscription">Inscription</router-link>
                    </li>
                    <li v-if="!loggedIn">
                        <router-link to="/connexion">Connexion</router-link>
                    </li>
                    <li v-else>
                        <a @click="logout">Déconnexion</a>
                    </li>
                </ul>
            </nav>
        </header>
        <notifications class="notifs" group="notifs"/>
        <transition name="slide-fade" mode="out-in">
            <router-view/>
        </transition>
        <footer>
            <div class="container">
                &copy;2020 Antoine Hintzy. Tous droits réservés.
            </div>
        </footer>
    </div>
</template>

<script>
    import {authComputed} from './store/helpers';

    export default {
        computed: {
            ...authComputed
        },
        methods: {
            logout() {
                this.$store
                    .dispatch('logout')
                    .then(() => {
                        this.$router.push({name: 'dashboard'})
                    })
            }
        }
    }
</script>

<style lang="scss">
    @import './assets/scss/style.scss';

    header {
        background-color: #353535;
        box-shadow: rgba(0, 0, 0, 0.0980392) 0px 1px 2px 0px, rgba(0, 0, 0, 0.0980392) 0px 1px 4px 0px, rgba(0, 0, 0, 0.0980392) 0px 2px 8px 0px;

        nav {
            ul {
                display: flex;
                list-style-type: none;
                vertical-align: center;
                margin: 0;
                padding: 0;

                li {
                    padding: 5px 0;
                    margin: 0 10px;
                    vertical-align: center;
                    align-self: center;

                    .logo {
                        padding: 0.7em;
                        height: 1em;
                    }

                    a {
                        cursor: pointer;
                    }

                    &:not(:first-child) {
                        a {
                            text-decoration: none;
                            display: inline-block;
                            color: #fff;
                            transition-duration: .5s;
                            padding: 6px 15px;
                            border-radius: 15px;

                            &:hover {
                                background-color: rgba(255,255,255,.3);
                            }
                        }
                    }
                }
            }
        }
    }

    footer {
        padding: 60px 0;
        background-color: #212325;
    }

    .notifs {
        margin-top: 45px;
        margin-right: 5px;
    }

    /*** TRANSITIONS ***/
    .slide-fade-enter {
        opacity: 0;
        transform: translateY(2px);
    }

    .slide-fade-enter-active,
    .slide-fade-leave-active {
        transition: all 0.1s cubic-bezier(1, .09, .41, .83);
    }

    .slide-fade-leave-to {
        opacity: 0;
        transform: translateY(2px);
    }
</style>
