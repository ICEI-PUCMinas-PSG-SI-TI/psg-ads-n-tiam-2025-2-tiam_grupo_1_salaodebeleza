import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'; 
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8zPCNMEjbOIq4VvoiP7pZCLwgh-DO3Fk",
  authDomain: "agendaglow-690e2.firebaseapp.com",
  projectId: "agendaglow-690e2",
  storageBucket: "agendaglow-690e2.firebasestorage.app",
  messagingSenderId: "118140119077",
  appId: "1:118140119077:web:c1aad158edd2b62684b7cc",
  measurementId: "G-HFR9HEEPB8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { db, auth };