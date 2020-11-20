import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const load = path => () => import(`@/pages/${path}`).then(data => data.default);
const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: load('home/Index.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: load('about/Index.vue'),
    },
    {
      path: '*',
      name: '404',
      meta: {
        layout: 'Error',
      },
      component: load('404.vue'),
    },
  ],
});
router.beforeEach((to, from, next) => {
  next();
});

export default router;
