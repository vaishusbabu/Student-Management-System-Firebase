import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDtO1h2EdzJ3iXBFA1dHMtrjO5P3cOWLKg",
    authDomain: "student-management-syste-66233.firebaseapp.com",
    databaseURL: "https://student-management-syste-66233-default-rtdb.firebaseio.com",
    projectId: "student-management-syste-66233",
    storageBucket: "student-management-syste-66233.appspot.com",
    messagingSenderId: "762062312197",
    appId: "1:762062312197:web:e2c5d50b9f4a6def159d6c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { app, auth, storage, db };
