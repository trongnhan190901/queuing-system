import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

firebase.initializeApp({
    apiKey: 'AIzaSyDOs8fHnzl6bE5P6Kv7lNt7Q7A6w52v2WA',
    authDomain: 'react-redux-8a3de.firebaseapp.com',
    projectId: 'react-redux-8a3de',
    storageBucket: 'react-redux-8a3de.appspot.com',
    messagingSenderId: '203196896407',
    appId: '1:203196896407:web:72503cdf39ed8f1ec385d2',
});

export const db = firebase.firestore();
