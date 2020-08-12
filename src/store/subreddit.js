import { firestoreAction } from 'vuexfire';
import firebase from '../firebase';
import db from '../db';
import router from '../router';
import getTimeSince from '../utilities/getTimeSince';

const posts = db.collection('posts');

const getters = {
  subreddit: (state) => (state.subreddits[0] ? state.subreddits[0] : {}),
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
  initAll: firestoreAction(({ bindFirestoreRef }) => {
    bindFirestoreRef('posts', db.collection('posts'));
  }),
  /* eslint-disable camelcase */
  initPosts: firestoreAction(({ bindFirestoreRef }, subreddit_id) => {
    bindFirestoreRef('posts', posts.where('subreddit_id', '==', subreddit_id));
  }),
  async deletePost(context, post_id) {
    /* eslint-disable */
    db.collection('comments')
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(async function(doc) {
          // doc.data() is never undefined for query doc snapshots
          if (doc.data().post_id === post_id) {
            await db
              .collection('comments')
              .doc(doc.data().id)
              .delete();
          }
        });
      });
    const result = await posts.doc(post_id).get();
    const { subreddit_id } = result.data();
    const subreddits = await db
      .collection('subreddits')
      .doc(subreddit_id)
      .get();
    const { name } = subreddits.data();
    await posts.doc(post_id).delete();
    router.push({ path: `/r/${name}` });
  },
  /* eslint-enable */

  async createPost(context, post) {
    const result = posts.doc();

    /* eslint-disable */
    const uid = firebase.auth().currentUser.uid;

    post.id = result.id;
    post.subreddit_id = state.subreddits[0].id;
    post.user_id = uid;
    post.created_at = firebase.firestore.FieldValue.serverTimestamp();
    post.updated_at = firebase.firestore.FieldValue.serverTimestamp();
    // this.postUpvote(post.id);
    /* eslint-enable */

    try {
      const userInfo = await db
        .collection('users')
        .doc(uid)
        .get();
      const { lastAction, actionCounter } = userInfo.data();

      if (actionCounter < 4) {
        const timeSince = getTimeSince(lastAction);
        if (timeSince > 30) {
          await posts.doc(post.id).set(post);
          await posts.doc(`${post.id}`).update({
            [`votes.${firebase.auth().currentUser.uid}`]: 1,
            score: firebase.firestore.FieldValue.increment(1),
          });
          if (timeSince > 3600) {
            await db
              .collection('users')
              .doc(uid)
              .update({
                actionCounter: 1,
                lastAction: firebase.firestore.FieldValue.serverTimestamp(),
              });
          } else {
            await db
              .collection('users')
              .doc(uid)
              .update({
                actionCounter: firebase.firestore.FieldValue.increment(1),
                lastAction: firebase.firestore.FieldValue.serverTimestamp(),
              });
          }
        } else {
          alert("You're doing too many things too quickly!");
        }
      } else {
        alert("You're doing too many things too quickly!");
      }
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
