import { firestoreAction } from 'vuexfire';
import db from '../db';

const state = {
  subreddits: [],
};
/* eslint-disable */

const getters = {
  subredditById: (state) => {
    return state.subreddits.reduce((byId, subreddit) => {
      byId[subreddit.id] = subreddit;
      return byId;
    }, {});
  },
};
/* eslint-enable */
const actions = {
  init: firestoreAction(({ bindFirestoreRef }) => {
    bindFirestoreRef('subreddits', db.collection('subreddits'));
  }),
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
};
