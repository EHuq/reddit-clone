import { firestoreAction } from 'vuexfire';
// import firebase from '../firebase';
import db from '../db';

const getters = {
  post: (state) => (state.posts[0] ? state.posts[0] : {}),
};

const state = {
  subreddits: [],
  posts: [],
};

const actions = {
  initSubreddit: firestoreAction(({ bindFirestoreRef }, name) => {
    bindFirestoreRef('subreddits', db.collection('subreddits').where('name', '==', name));
  }),
  /* eslint-disable camelcase */
  initPost: firestoreAction(({ bindFirestoreRef }, post_id) => {
    bindFirestoreRef('posts', db.collection('posts').where('id', '==', post_id));
  }),
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
};
