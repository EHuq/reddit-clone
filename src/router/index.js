import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Subreddits from '../views/Subreddits.vue';
import Subreddit from '../views/Subreddit.vue';
import Post from '../views/Post.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/r/all',
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
  {
    path: '/r/:name/:post_id',
    name: 'post',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Post,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
