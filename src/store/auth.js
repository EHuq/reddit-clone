import firebase from '../firebase';

const state = {
  user: {},
  isLoggedIn: false,
};

/* eslint no-shadow: ["error", { "allow": ["state"] }] */
/* eslint no-param-reassign: ["error", { "props": true,
  "ignorePropertyModificationsFor": ["state"] }] */

const mutations = {
  setUser(state, user) {
    if (user) {
      state.user = user;
      state.isLoggedIn = true;
    } else {
      state.user = {};
      state.isLoggedIn = false;
    }
  },
};

const actions = {
  async login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithPopup(provider);
  },
  async logout() {
    try {
      firebase.auth().signOut();
    } catch (error) {
      console.error(error);
    }
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
