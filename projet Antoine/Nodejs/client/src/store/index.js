import Vue from 'vue'
import axios from 'axios'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: null
    },
    mutations: {
        SET_USER_DATA(state, userData) {
            state.user = userData;
            localStorage.setItem('user', JSON.stringify(userData));
            axios.defaults.headers.common['authorization'] = `Bearer ${userData.token}`;
        },
      CLEAR_USER_DATA(state) {
        state.user = null;
        localStorage.removeItem('user');
        location.reload();
      }
    },
    actions: {
        register({commit}, credentials) {
            return axios
                .post('http://localhost:3000/api/users', credentials)
                .then(({data}) => {
                    commit('SET_USER_DATA', data)
                })
        },
        login({commit}, credentials) {
            return axios
                .post("http://localhost:3000/auth/login", credentials)
                .then(({data}) => {
                    commit('SET_USER_DATA', data);
                })
        },
        logout({commit}) {
            commit('CLEAR_USER_DATA');
        }
    },
    modules: {},
    getters: {
        loggedIn(state) {
            return !!state.user;
        }
    }
})
