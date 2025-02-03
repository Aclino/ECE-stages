import { createRouter, createWebHistory } from 'vue-router';
import DeroulantPage from '../views/DeroulantPage.vue';
import ExoPage from '../views/ExoPage.vue';
import ProfilPage from '../views/ProfilPage.vue';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import ajoutPage from '../views/ProfajoutPage.vue';
const routes = [
  { path: '/', component: DeroulantPage ,meta: { requiresAuth: true }},
  { path: '/exo/:ids', component: ExoPage ,meta: { requiresAuth: true }},
  { path: '/profil', component: ProfilPage,meta: { requiresAuth: true } },
  {path : '/login',component : LoginPage},
  {path : '/register',component : RegisterPage},
  {path: '/ajout',component : ajoutPage}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth && !token) {
      console.warn('Accès interdit. Redirection vers /login.');
      next('/login'); // Redirige vers la page de connexion si le token est manquant
  } else {
      next(); // Continue la navigation
  }
});
export default router;
