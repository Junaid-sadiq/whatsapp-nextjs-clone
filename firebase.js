import firebase from 'firebase';

const firebaseConfig = {
    apiKey: 'AIzaSyAKYNHbQDU902MzKgocooCLc9VeNRMeklE',
    authDomain: 'whatzappppp.firebaseapp.com',
    projectId: 'whatzappppp',
    storageBucket: 'whatzappppp.appspot.com',
    messagingSenderId: '144193270947',
    appId: '1:144193270947:web:1202482eabfeb02f72bb16',
    measurementId: 'G-K8EZM1DWN8',
};

const app = !firebase.apps.length
    ? firebase.initializeApp(firebaseConfig)
    : firebase.app();

const db = app.firestore();

const auth = app.auth();

const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
