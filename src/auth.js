import firebase from './firebase';
import store from './store';
import db from './db';

firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    if (user.user) {
      /* eslint-disable */
      user = user.user;
      /* eslint-enable */
    }
    const userInfo = await db.collection('users').doc(user.uid);

    if (!userInfo) {
      const setUser = {
        id: user.uid,
        name: user.displayName,
        image: user.photoURL,
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        actionCounter: 0,
        lastAction: firebase.firestore.FieldValue.serverTimestamp(),
      };
      db.collection('users')
        .doc(setUser.id)
        .set(setUser);
      store.commit('auth/setUser', setUser);
    }
    const userLogin = {
      id: user.uid,
      name: user.displayName,
      image: user.photoURL,
    };
    store.commit('auth/setUser', userLogin);
  } else {
    store.commit('auth/setUser', null);
  }
});
