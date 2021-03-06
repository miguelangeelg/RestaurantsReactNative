
import firebase from 'firebase/app';
import 'firebase/firestore';
  // Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCNxyyd_uY0zAxLhWO5LKAW3odUQ1_1JRA",
    authDomain: "restaurantsreactnative.firebaseapp.com",
    projectId: "restaurantsreactnative",
    storageBucket: "restaurantsreactnative.appspot.com",
    messagingSenderId: "223274095417",
    appId: "1:223274095417:web:d15243d18f3ddc42164ee8"
  };
  
  export const firebaseApp =  firebase.initializeApp(firebaseConfig);