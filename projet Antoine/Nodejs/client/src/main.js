import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import store from './store'
import Notifications from 'vue-notification';

Vue.config.productionTip = false;
Vue.use(Notifications);

new Vue({
  router,
  store,
  created () {
    const userString = localStorage.getItem('user');
    if (userString) {
      const userData = JSON.parse(userString);
      this.$store.commit('SET_USER_DATA', userData)
    }
    axios.interceptors.response.use(
        response => response,
        error => {
          if (error.response.status === 401) {
            this.$store.dispatch('logout');
          }
          else if (error.response.status === 403) {
              this.$router.push('/');
              this.$notify({
                  group: 'notifs',
                  type: 'error',
                  title: 'Accès interdit',
                  text: 'Vous n\'avez pas les droits suffisants pour accéder à cette page.'
              });
          }
          return Promise.reject(error);
        }
    )
  },
  render: h => h(App)
}).$mount('#app');
