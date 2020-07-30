import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Subreddits from '../views/Subreddits.vue';
import Subreddit from '../views/Subreddit.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/subreddits',
    name: 'subreddits',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Subreddits,
  },
  {
    path: '/r/:name',
    name: 'subreddit',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Subreddit,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
