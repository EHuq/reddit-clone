import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyDT5Et1MmXoY44bk4HevQ7KIbquo3HXCRo',
  authDomain: 'redditclone-2a807.firebaseapp.com',
  databaseURL: 'https://redditclone-2a807.firebaseio.com',
  projectId: 'redditclone-2a807',
  storageBucket: 'redditclone-2a807.appspot.com',
  messagingSenderId: '860963014397',
  appId: '1:860963014397:web:1cf53c4ff2039dd4c62094',
  measurementId: 'G-G2M7QNH49R',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;
