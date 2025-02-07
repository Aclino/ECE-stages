import { createRouter, createWebHistory } from 'vue-router';
import DeroulantPage from '../views/DeroulantPage.vue';
import ExoPage from '../views/ExoPage.vue';
import ProfilPage from '../views/ProfilPage.vue';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import ajoutPage from '../views/ProfajoutPage.vue';
import ProfajoutPage from '../views/ProfajoutPage.vue';
import {isTokenExpired} from '../../fonctionjs.js/fonctionjs';
const routes = [
  { path: '/', component: DeroulantPage, meta: { requiresAuth: true } },
  { path: '/exo/:ids', component: ExoPage, meta: { requiresAuth: true } },
  { path: '/profil', component: ProfilPage, meta: { requiresAuth: true } },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/ajout', component: ProfajoutPage },
  { path: '/ajout/promo/:promo', component: ProfajoutPage },
  { path: '/ajout/matiere', component: ProfajoutPage},
  { path: '/ajout/exercice', component: ProfajoutPage},
  { path: '/ajout/competence', component: ProfajoutPage},
  { path: '/ajout/chapitre', component: ProfajoutPage},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (token && isTokenExpired(token)) {
    console.warn('Token expiré, suppression et redirection vers /login.');
    localStorage.removeItem('token'); // Supprime le token expiré
    next('/login');
    return;
  }

  if (to.path === '/login' && token) {
    console.warn('Utilisateur déjà connecté, redirection vers la page d\'accueil');
    next('/');
    return;
  }

  if (to.meta.requiresAuth && !token) {
    console.warn('Accès interdit. Redirection vers /login.');
    next('/login');
  } else {
    next();
  }
});



export default router;
