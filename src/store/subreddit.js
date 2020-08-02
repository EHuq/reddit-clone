import { firestoreAction } from 'vuexfire';
import firebase from '../firebase';
import db from '../db';

const posts = db.collection('posts');

const getters = {
  subreddit: (state) => (state.subreddits[0] ? state.subreddits[0] : {}),
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
  initPosts: firestoreAction(({ bindFirestoreRef }, subreddit_id) => {
    bindFirestoreRef('posts', posts.where('subreddit_id', '==', subreddit_id));
  }),
  async deletePost(context, post_id) {
    await posts.doc(post_id).delete();
  },

  async createPost(context, post) {
    const result = posts.doc();

    /* eslint-disable */
    post.id = result.id;
    post.subreddit_id = state.subreddits[0].id;
    post.user_id = firebase.auth().currentUser.uid;
    post.created_at = firebase.firestore.FieldValue.serverTimestamp();
    post.updated_at = firebase.firestore.FieldValue.serverTimestamp();
    /* eslint-enable */
    try {
      await posts.doc(post.id).set(post);
    } catch (error) {
      console.error(error);
    }
  },
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
};
