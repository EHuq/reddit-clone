import { firestoreAction } from 'vuexfire';
import firebase from '../firebase';
import db from '../db';

const comments = db.collection('comments');

const getters = {
  post: (state) => (state.posts[0] ? state.posts[0] : {}),
};

const state = {
  subreddits: [],
  posts: [],
  comments: [],
};

const actions = {
  initSubreddit: firestoreAction(({ bindFirestoreRef }, name) => {
    bindFirestoreRef('subreddits', db.collection('subreddits').where('name', '==', name));
  }),
  /* eslint-disable camelcase */
  initPost: firestoreAction(({ bindFirestoreRef }, post_id) => {
    bindFirestoreRef('posts', db.collection('posts').where('id', '==', post_id));
  }),
  initComments: firestoreAction(({ bindFirestoreRef }, post_id) => {
    bindFirestoreRef('comments', db.collection('comments').where('post_id', '==', post_id));
  }),
  async createComment(context, comment) {
    const result = comments.doc();
    /* eslint-disable */
    comment.id = result.id;
    comment.subreddit_id = state.subreddits[0].id;
    comment.post_id = state.posts[0].id;
    comment.user_id = firebase.auth().currentUser.uid;
    comment.created_at = firebase.firestore.FieldValue.serverTimestamp();
    comment.updated_at = firebase.firestore.FieldValue.serverTimestamp();
    /* eslint-enable */
    try {
      await comments.doc(comment.id).set(comment);
    } catch (error) {
      console.error(error);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
};
