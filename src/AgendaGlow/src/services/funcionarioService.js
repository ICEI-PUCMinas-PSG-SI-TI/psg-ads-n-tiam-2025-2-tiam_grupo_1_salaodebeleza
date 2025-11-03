// src/services/funcionarioService.js
import { db } from '../database/firebase';
import { 
  collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot 
} from 'firebase/firestore';

const FUNCIONARIOS_COLLECTION = 'funcionarios';

/** Adiciona um novo funcionário */
export const addFuncionario = async (funcionario) => {
  try {
    await addDoc(collection(db, FUNCIONARIOS_COLLECTION), funcionario);
    return { success: true };
  } catch (error) {
    console.error('Erro ao adicionar funcionário:', error);
    return { success: false, message: error.message };
  }
};

/** Retorna todos os funcionários (escuta em tempo real) */
export const listenFuncionarios = (callback) => {
  const unsubscribe = onSnapshot(
    collection(db, FUNCIONARIOS_COLLECTION),
    (snapshot) => {
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(lista);
    },
    (error) => console.error('Erro ao ouvir funcionários:', error)
  );
  return unsubscribe;
};

/** Atualiza um funcionário */
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

/** Remove um funcionário */
export const deleteFuncionario = async (id) => {
  try {
    const ref = doc(db, FUNCIONARIOS_COLLECTION, id);
    await deleteDoc(ref);
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir funcionário:', error);
    return { success: false, message: error.message };
  }
};
