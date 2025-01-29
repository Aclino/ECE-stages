import { createRouter, createWebHistory } from 'vue-router';
import DeroulantPage from '../views/DeroulantPage.vue';
import ExoPage from '../views/ExoPage.vue';
import ProfilPage from '../views/ProfilPage.vue';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
const routes = [
  { path: '/', component: DeroulantPage },
  { path: '/exo', component: ExoPage },
  { path: '/profil', component: ProfilPage },
  {path : '/login',component : LoginPage},
  {path : '/register',component : RegisterPage}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
