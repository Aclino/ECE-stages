import { createRouter, createWebHistory } from 'vue-router';
import DeroulantPage from '../views/DeroulantPage.vue';
import ExoPage from '../views/ExoPage.vue';
import ProfilPage from '../views/ProfilPage.vue';

const routes = [
  { path: '/', component: DeroulantPage },
  { path: '/exo', component: ExoPage },
  { path: '/profil', component: ProfilPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
