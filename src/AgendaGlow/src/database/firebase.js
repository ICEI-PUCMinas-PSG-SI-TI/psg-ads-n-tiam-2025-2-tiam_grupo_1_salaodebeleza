import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

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

let auth;

if (Platform.OS !== 'web') {
    // ⭐️ AMBIENTE MOBILE (REACT NATIVE)
    // Inicializa a autenticação usando a persistência AsyncStorage
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
    
} else {
    // ⭐️ AMBIENTE WEB (BROWSER)
    // A persistência padrão (browserLocalPersistence ou browserSessionPersistence)
    // é automaticamente usada se não for especificada,
    // mas para evitar que o código que importa 'getReactNativePersistence' quebre,
    // garantimos que 'initializeAuth' seja chamado de forma segura.
    
    // Você pode usar initializeAuth sem o argumento de persistência
    // Ou usar getAuth, se for o caso
    auth = getAuth(app); // Use getAuth para web, que é mais comum
}

export { db, auth };