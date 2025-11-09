import { auth } from '../database/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from "expo-auth-session";
import { getAuth, signInWithCredential, GoogleAuthProvider } from "firebase/auth";


/* Faz login com email e senha e salva localmente */
export const login = async (email, senha) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // salva localmente
    await AsyncStorage.setItem('user', JSON.stringify({
      uid: user.uid,
      email: user.email,
      token: user.accessToken
    }));

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Recupera o usuário salvo localmente
 */
export const getUser = async () => {
  const userData = await AsyncStorage.getItem('@user');
  return userData ? JSON.parse(userData) : null;
};

/**
 * Remove o usuário (logout)
 */
export const logout = async () => {
  await AsyncStorage.removeItem('user');
  await auth.signOut();
};

/**
 * Login com o Google 
 */
export async function loginComGoogleToken(idToken, accessToken) {
  try {
    // use a instância auth importada (não chame getAuth() novamente)
    const credential = GoogleAuthProvider.credential(idToken, accessToken); // idToken é suficiente
    const userCredential = await signInWithCredential(auth, credential);
    return userCredential.user;
  } catch (err) {
    throw err;
  }
}

/**Esqueci a senha */
export const forgotPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: "Link de redefinição enviado com sucesso!" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};