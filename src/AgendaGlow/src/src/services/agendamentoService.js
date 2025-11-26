import { db } from '../database/firebase';
import { 
  collection, addDoc, query, where, onSnapshot, deleteDoc, doc, getDocs, updateDoc 
} from 'firebase/firestore';

const AGENDAMENTOS_COLLECTION = 'agendamentos';

// --- Funções CRUD Originais ---

export const addAgendamento = async (agendamento) => {
  try {
    const colRef = collection(db, AGENDAMENTOS_COLLECTION);
    const docRef = doc(colRef); // Gera ID manualmente antes de salvar

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
    const ref = doc(db, AGENDAMENTOS_COLLECTION, id);
    await deleteDoc(ref);
    console.log('Agendamento excluído com sucesso.');
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

// --- NOVA FUNÇÃO: Relatórios ---
/**
 * Busca todos os ativos para processar status (passado/concluído) no front.
 */
export const listenRelatorios = (callback) => {
  const q = query(
    collection(db, AGENDAMENTOS_COLLECTION),
    where('ativo', '==', true) 
  );

  return onSnapshot(q, (snapshot) => {
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(lista);
  }, (error) => console.error('Erro ao ouvir relatórios:', error));
};