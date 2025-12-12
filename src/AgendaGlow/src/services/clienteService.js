import { db } from '../database/firebase';
import { 
  collection, getDoc, addDoc, query, where, onSnapshot, deleteDoc, 
  doc, updateDoc, getDocs, serverTimestamp, setDoc 
} from 'firebase/firestore';

const CLIENTES_COLLECTION = 'clientes';

export const addCliente = async (cliente) => {
  try {
    const colRef = collection(db, CLIENTES_COLLECTION);
    const docRef = doc(colRef);

    await setDoc(docRef, {
      ...cliente,
      cid: docRef.id,
      ativo: true,
      criadoEm: serverTimestamp(),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Erro ao adicionar cliente:', error);
    return { success: false, message: error.message };
  }
};

export const listenClientes = (callback) => {
  const q = query(collection(db, CLIENTES_COLLECTION), where('ativo', '==', true));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(lista);
    },
    (error) => console.error('Erro ao ouvir clientes:', error)
  );

  return unsubscribe;
};

export const getClienteById = async (cid) => {
  try {
    const q = query(collection(db, CLIENTES_COLLECTION), where('cid', '==', cid));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const docData = snap.docs[0];
      return { success: true, data: { id: docData.id, ...docData.data() } };
    } else {
      return { success: false, message: 'Cliente não encontrado.' };
    }
  } catch (error) {
    console.error('Erro ao buscar cliente por cid:', error);
    return { success: false, message: error.message };
  }
};

export const updateCliente = async (cid, dados) => {
  try {
    const q = query(collection(db, CLIENTES_COLLECTION), where('cid', '==', cid));
    const snap = await getDocs(q);

    if (snap.empty) {
      throw new Error('Cliente não encontrado para atualização.');
    }

    const ref = doc(db, CLIENTES_COLLECTION, snap.docs[0].id);

    await updateDoc(ref, {
      ...dados,
      atualizadoEm: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    return { success: false, message: error.message };
  }
};

export const deleteCliente = async (cid) => {
  try {
    if (!cid) throw new Error('CID é obrigatório para exclusão.');

    const q = query(collection(db, CLIENTES_COLLECTION), where('cid', '==', cid));
    const snap = await getDocs(q);

    if (snap.empty) {
      throw new Error(`Cliente com cid "${cid}" não encontrado.`);
    }

    const ref = doc(db, CLIENTES_COLLECTION, snap.docs[0].id);

    await updateDoc(ref, {
      ativo: false,
      removidoEm: serverTimestamp(),
    });

    console.log(`Cliente com cid=${cid} marcado como inativo.`);
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir cliente (soft):', error);
    return { success: false, message: error.message };
  }
};

export const telefoneExiste = async (telefone) => {
  try {
    const q = query(
      collection(db, CLIENTES_COLLECTION),
      where("telefone", "==", telefone),
      where("ativo", "==", true)
    );

    const snap = await getDocs(q);

    if (snap.empty) return false;

    return true;
  } catch (error) {
    console.error("Erro ao verificar telefone:", error);
    return false;
  }
};