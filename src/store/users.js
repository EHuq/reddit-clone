import { firestoreAction } from 'vuexfire';
import db from '../db';

const state = {
  users: [],
};
/* eslint-disable */
const getters = {
  usersById: (state) => {
    return state.users.reduce((byId, user) => {
      byId[user.id] = user;
      return byId;
    }, {});
  },
};
/* eslint-disable */
const actions = {
  init: firestoreAction(({ bindFirestoreRef }) => {
    bindFirestoreRef('users', db.collection('users'));
  }),
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
};
