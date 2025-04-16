import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDm5wUU2XzsinmrQUnyuUz1FufeXNj383c",
  authDomain: "cassino-dangerdesign.firebaseapp.com",
  projectId: "cassino-dangerdesign",
  storageBucket: "cassino-dangerdesign.appspot.com",
  messagingSenderId: "380530609482",
  appId: "1:380530609482:web:5a6e1dd9ae1d21863ac5b3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };