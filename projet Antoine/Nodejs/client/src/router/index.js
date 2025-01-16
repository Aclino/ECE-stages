import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/PageAccueil.vue'

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'accueil',
        component: Home
    },
    {
        path: '/connexion',
        name: 'connexion',
        component: () => import('../views/PageConnexion.vue')
    },
    {
        path: '/inscription',
        name: 'inscription',
        component: () => import('../views/PageInscription.vue')
    },
    {
        path: '/utilisateurs',
        name: 'utilisateurs',
        component: () => import('../views/PageUtilisateurs.vue'),
        meta: {
            requiresAuth: true
        }
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, from, next) => {
    const loggedIn = localStorage.getItem('user');
    if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
        next('/');
    } else {
        next();
    }
});

export default router
