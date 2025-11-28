import { auth } from '../database/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from "expo-auth-session";
import { getAuth, signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';


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

/**
 * Verifica se o dispositivo suporta autenticação biométrica
 */
export const isBiometricAvailable = async () => {
  try {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return compatible && enrolled;
  } catch (error) {
    console.error("Erro ao verificar biometria:", error);
    return false;
  }
};

/**
 * Salva credenciais de forma segura no SecureStore
 */
export const saveBiometricCredentials = async (email, senha) => {
  try {
    await SecureStore.setItemAsync('email_biometria', email);
    await SecureStore.setItemAsync('senha_biometria', senha);
    await AsyncStorage.setItem('biometria_habilitada', 'true');
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar credenciais:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Recupera credenciais salvas no SecureStore
 */
export const getBiometricCredentials = async () => {
  try {
    const email = await SecureStore.getItemAsync('email_biometria');
    const senha = await SecureStore.getItemAsync('senha_biometria');
    return { email, senha };
  } catch (error) {
    console.error("Erro ao recuperar credenciais:", error);
    return null;
  }
};

/**
 * Login com biometria
 */
export const loginComBiometria = async () => {
  try {
    // Verifica se biometria está disponível
    const isBioAvailable = await isBiometricAvailable();
    if (!isBioAvailable) {
      return { success: false, message: "Biometria não está disponível neste dispositivo" };
    }

    // Tenta autenticar com biometria
    const result = await LocalAuthentication.authenticateAsync({
      disableDeviceFallback: false,
      reason: "Autentique-se com sua biometria para acessar o AgendaGlow",
    });

    if (result.success) {
      // Recupera as credenciais salvas
      const credentials = await getBiometricCredentials();
      
      if (!credentials || !credentials.email || !credentials.senha) {
        return { success: false, message: "Nenhuma credencial salva encontrada" };
      }

      // Faz login com as credenciais
      const user = await login(credentials.email, credentials.senha);
      return { success: true, user };
    } else {
      return { success: false, message: "Autenticação biométrica falhou" };
    }
  } catch (error) {
    console.error("Erro ao fazer login com biometria:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Remove credenciais biométricas (logout)
 */
export const removeBiometricCredentials = async () => {
  try {
    await SecureStore.deleteItemAsync('email_biometria');
    await SecureStore.deleteItemAsync('senha_biometria');
    await AsyncStorage.removeItem('biometria_habilitada');
    return { success: true };
  } catch (error) {
    console.error("Erro ao remover credenciais:", error);
    return { success: false };
  }
};