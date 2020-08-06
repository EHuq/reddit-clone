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
    // this.postUpvote(post.id);
    /* eslint-enable */
    try {
      await posts.doc(post.id).set(post);
    } catch (error) {
      console.error(error);
    }
  },

  /* eslint-disable camelcase */
  async postUpvote(context, post_id) {
    const user_id = firebase.auth().currentUser.uid;
    const result = await posts.doc(post_id).get();
    const { votes, score } = result.data();
    if (votes && (score || score === 0)) {
      if (votes[user_id] === -1) {
        await posts.doc(`${post_id}`).update({
          [`votes.${user_id}`]: 1,
          score: firebase.firestore.FieldValue.increment(2),
        });
      } else if (votes[user_id] === 0 || !votes[user_id]) {
        await posts.doc(`${post_id}`).update({
          [`votes.${user_id}`]: 1,
          score: firebase.firestore.FieldValue.increment(1),
        });
      } else if (votes[user_id] === 1) {
        await posts.doc(`${post_id}`).update({
          [`votes.${user_id}`]: 0,
          score: firebase.firestore.FieldValue.increment(-1),
        });
      }
    } else {
      await posts.doc(`${post_id}`).update({
        [`votes.${user_id}`]: 1,
        score: firebase.firestore.FieldValue.increment(1),
      });
    }
  },
  async postDownvote(context, post_id) {
    const user_id = firebase.auth().currentUser.uid;
    const result = await posts.doc(post_id).get();
    const { votes, score } = result.data();
    if (votes && (score || score === 0)) {
      if (votes[user_id] === 1) {
        await posts.doc(`${post_id}`).update({
          [`votes.${user_id}`]: -1,
          score: firebase.firestore.FieldValue.increment(-2),
        });
      } else if (votes[user_id] === 0 || !votes[user_id]) {
        await posts.doc(`${post_id}`).update({
          [`votes.${user_id}`]: -1,
          score: firebase.firestore.FieldValue.increment(-1),
        });
      } else if (votes[user_id] === -1) {
        await posts.doc(`${post_id}`).update({
          [`votes.${user_id}`]: 0,
          score: firebase.firestore.FieldValue.increment(1),
        });
      }
    } else {
      await posts.doc(`${post_id}`).update({
        [`votes.${user_id}`]: -1,
        score: 0,
      });
    }
  },
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
};
