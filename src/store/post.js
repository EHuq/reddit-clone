import { firestoreAction } from 'vuexfire';
import firebase from '../firebase';
import db from '../db';
import getTimeSince from '../utilities/getTimeSince';

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
    const uid = firebase.auth().currentUser.uid;

    comment.id = result.id;
    comment.subreddit_id = state.subreddits[0].id;
    comment.post_id = state.posts[0].id;
    comment.user_id = uid;
    comment.created_at = firebase.firestore.FieldValue.serverTimestamp();
    comment.updated_at = firebase.firestore.FieldValue.serverTimestamp();
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
          await comments.doc(comment.id).set(comment);
          await comments.doc(comment.id).update({
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
  async deleteComment(context, comment_id) {
    await comments.doc(comment_id).delete();
  },
  async commentUpvote(context, comment_id) {
    const user_id = firebase.auth().currentUser.uid;

    const result = await comments.doc(comment_id).get();
    const { votes, score } = result.data();
    if (votes && (score || score === 0)) {
      if (votes[user_id] === -1) {
        await comments.doc(`${comment_id}`).update({
          [`votes.${user_id}`]: 1,
          score: firebase.firestore.FieldValue.increment(2),
        });
      } else if (votes[user_id] === 0 || !votes[user_id]) {
        await comments.doc(`${comment_id}`).update({
          [`votes.${user_id}`]: 1,
          score: firebase.firestore.FieldValue.increment(1),
        });
      } else if (votes[user_id] === 1) {
        await comments.doc(`${comment_id}`).update({
          [`votes.${user_id}`]: 0,
          score: firebase.firestore.FieldValue.increment(-1),
        });
      }
    } else {
      await comments.doc(`${comment_id}`).update({
        [`votes.${user_id}`]: 1,
        score: firebase.firestore.FieldValue.increment(1),
      });
    }
  },
  async commentDownvote(context, comment_id) {
    const user_id = firebase.auth().currentUser.uid;
    const result = await comments.doc(comment_id).get();
    const { votes, score } = result.data();
    if (votes && (score || score === 0)) {
      if (votes[user_id] === 1) {
        await comments.doc(`${comment_id}`).update({
          [`votes.${user_id}`]: -1,
          score: firebase.firestore.FieldValue.increment(-2),
        });
      } else if (votes[user_id] === 0 || !votes[user_id]) {
        await comments.doc(`${comment_id}`).update({
          [`votes.${user_id}`]: -1,
          score: firebase.firestore.FieldValue.increment(-1),
        });
      } else if (votes[user_id] === -1) {
        await comments.doc(`${comment_id}`).update({
          [`votes.${user_id}`]: 0,
          score: firebase.firestore.FieldValue.increment(1),
        });
      }
    } else {
      await comments.doc(`${comment_id}`).update({
        [`votes.${user_id}`]: -1,
        score: firebase.firestore.FieldValue.increment(-1),
      });
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
};
