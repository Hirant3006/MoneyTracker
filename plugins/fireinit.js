// global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/database'

// var config = {
//   apiKey: "AIzaSyBRUBUK14hNQei7OLdkYNL-as3bGXUwB6I",
//   authDomain: "testfirebase-2554c.firebaseapp.com",
//   databaseURL: "https://testfirebase-2554c.firebaseio.com",
//   projectId: "testfirebase-2554c",
//   storageBucket: "testfirebase-2554c.appspot.com",
//   messagingSenderId: "949679611333"
// }

var config = {
  apiKey: "AIzaSyCy7ADGnEzgC3KJsm_gTQ2bH7myE8wj0lk",
  authDomain: "ilovemoney-b93f2.firebaseapp.com",
  databaseURL: "https://ilovemoney-b93f2.firebaseio.com",
  projectId: "ilovemoney-b93f2",
  storageBucket: "ilovemoney-b93f2.appspot.com",
  messagingSenderId: "268623389158"
};

if (!firebase.apps.length) firebase.initializeApp(config)

export const GoogleProvider = new firebase.auth.GoogleAuthProvider()
export const auth = firebase.auth()
export const DB = firebase.database()
export default firebase
