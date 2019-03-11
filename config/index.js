
import firebase from 'firebase'
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyD1hFY4tPN0ZY5TqHmi_GuU_zatxvOgtM4",
    authDomain: "familytracker-app.firebaseapp.com",
    databaseURL: "https://familytracker-app.firebaseio.com",
    projectId: "familytracker-app",
    storageBucket: "familytracker-app.appspot.com",
    messagingSenderId: "302303590241"
  };
  firebase.initializeApp(config);

export default firebase;



