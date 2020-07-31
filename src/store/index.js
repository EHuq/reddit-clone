import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations } from 'vuexfire';

import auth from './auth';
import subreddits from './subreddits';
import subreddit from './subreddit';
import users from './users';
import post from './post';

Vue.use(Vuex);

export default new Vuex.Store({
  mutations: vuexfireMutations,
  modules: {
    auth,
    users,
    subreddits,
    subreddit,
    post,
  },
});
