import { auth, db } from '../database/firebase';
import { 
  collection, addDoc, query, where, onSnapshot, deleteDoc, doc,
  getDocs, updateDoc 
} from 'firebase/firestore';
import { 
    createUserWithEmailAndPassword, 
    EmailAuthProvider, 
    reauthenticateWithCredential, 
    updatePassword,
    updateEmail // <-- 1. IMPORTAÇÃO ADICIONADA
} from 'firebase/auth'; 
import { getFunctions, httpsCallable } from 'firebase/functions';

const FUNCIONARIOS_COLLECTION = 'funcionarios';

/** Adiciona um novo funcionário (CÓDIGO BASE) */
export const addFuncionario = async (funcionario) => {
  try {
    const senhaPadrao = "agendaglow12345";
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      funcionario.email,
      senhaPadrao
    );
    const user = userCredential.user;
    await addDoc(collection(db, FUNCIONARIOS_COLLECTION), {
      ...funcionario,
      uid: user.uid,
      ativo: true,
      criadoEm: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error('Erro ao adicionar funcionário:', error);
    if (error.code === 'auth/email-already-in-use') {
      return { success: false, message: 'Este e-mail já está em uso por outra conta.' };
    }
    if (error.code === 'auth/invalid-email') {
      return { success: false, message: 'O e-mail fornecido é inválido.' };
    }
    return { success: false, message: error.message };
  }
};

/** Escuta em tempo real (CÓDIGO BASE) */
export const listenFuncionarios = (callback) => {
  const q = query(collection(db, FUNCIONARIOS_COLLECTION), where('ativo', '==', true));
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(lista);
    },
    (error) => console.error('Erro ao ouvir funcionários:', error)
  );
  return unsubscribe;
};

/** Exclui um funcionário (Corrigido para o 'functions/index.js' com CORS) */
export const deleteFuncionario = async (uid, docId) => {
  try {
    const functions = getFunctions();
    const deleteFuncionarioFn = httpsCallable(functions, 'deleteFuncionario');
    const result = await deleteFuncionarioFn({ uid });    if (docId) {
      const ref = doc(db, FUNCIONARIOS_COLLECTION, docId);
      await deleteDoc(ref);
    }

    console.log('Funcionário excluído com sucesso.');
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir funcionário:', error);
    return { success: false, message: error.message };
  }
};

/** Busca os dados de um funcionário no Firestore usando o UID (RESOLUÇÃO 3) */
export const getFuncionarioByUid = async (uid) => {
  try {
    const q = query(
      collection(db, FUNCIONARIOS_COLLECTION),
      where("uid", "==", uid)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return { success: false, message: 'Dados do funcionário não encontrados no Firestore.' };
    }
    const docEncontrado = querySnapshot.docs[0];
    return { success: true, data: { id: docEncontrado.id, ...docEncontrado.data() } };
  } catch (error) {
    console.error('Erro ao buscar funcionário por UID:', error);
    return { success: false, message: error.message };
  }
};

/** Atualiza um funcionário no Firestore (Usado pelo 'handleEditar' antigo) */
export const updateFuncionario = async (id, dados) => {
  try {
    const ref = doc(db, FUNCIONARIOS_COLLECTION, id);
    await updateDoc(ref, dados);
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar funcionário:', error);
    return { success: false, message: error.message };
  }
};

export const getFuncionarioByEmail = async (email) => {
  try {
    //console.log('Email na service: ', email)
    const q = query(
      collection(db, FUNCIONARIOS_COLLECTION),
      where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return { success: false, message: "Funcionário não encontrado." };
    }
    const funcionario = querySnapshot.docs[0];
    return {
      success: true,
      data: { id: funcionario.id, ...funcionario.data() },
    };
  } catch (error) {
    console.error("Erro ao buscar funcionário por e-mail:", error);
    return { success: false, message: error.message };
  }
};