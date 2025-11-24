import { db } from '../database/firebase';
import {
  collection, addDoc, query, where, onSnapshot, deleteDoc, doc, getDocs, updateDoc
} from 'firebase/firestore';

const AGENDAMENTOS_COLLECTION = 'agendamentos';

export const addAgendamento = async (agendamento) => {
  try {
    const colRef = collection(db, AGENDAMENTOS_COLLECTION);
    const docRef = doc(colRef);

    await addDoc(collection(db, AGENDAMENTOS_COLLECTION), {
      ...agendamento,
      uid: docRef.id,
      ativo: true,
      criadoEm: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error('Erro ao adicionar agendamento:', error);
    return { success: false, message: error.message };
  }
};

export const listenAgendamentos = (callback) => {
  const q = query(collection(db, AGENDAMENTOS_COLLECTION), where('ativo', '==', true));
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(lista);
    },
    (error) => console.error('Erro ao ouvir agendamentos:', error)
  );
  return unsubscribe;
};

export const deleteAgendamento = async (id) => {
  try {
    // Fazer delete lógico: marcar o agendamento como inativo
    const ref = doc(db, AGENDAMENTOS_COLLECTION, id);
    await updateDoc(ref, { ativo: false, atualizadoEm: new Date() });
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir agendamento:', error);
    return { success: false, message: error.message };
  }
};

export const getAgendamentos = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, AGENDAMENTOS_COLLECTION));
    const lista = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { success: true, data: lista };
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    return { success: false, message: error.message };
  }
};

export const updateAgendamento = async (id, dados) => {
  try {
    const ref = doc(db, AGENDAMENTOS_COLLECTION, id);
    await updateDoc(ref, dados);
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    return { success: false, message: error.message };
  }
};
