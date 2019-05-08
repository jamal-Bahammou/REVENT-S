import firebase from 'firebase';
import 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: "AIzaSyCLghLnDfwYAoy-1UiZMGlg8BVYMWAVgQ8",
   authDomain: "revents-775b9.firebaseapp.com",
   databaseURL: "https://revents-775b9.firebaseio.com",
   projectId: "revents-775b9",
   storageBucket: "revents-775b9.appspot.com",
   messagingSenderId: "658907608715",
   // appId: "1:658907608715:web:a267dad7ebf97fc1"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

const settings = {
   timestampsInSnapshots: true
}

firestore.settings(settings);

export default firebase;