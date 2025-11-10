import { db } from '../database/firebase';
import { 
  collection, doc, setDoc, query, where, onSnapshot, updateDoc, getDoc
} from 'firebase/firestore';

const CLIENTES_COLLECTION = 'clientes';

// 🔹 FUNÇÃO DE EXCLUSÃO 
export const deleteCliente = async (id) => {
  try {
    console.log( id);
    const clienteRef = doc(db, "clientes", id);

    await updateDoc(clienteRef, {
      ativo: false,
      atualizadoEm: new Date(),
    });

    console.log("✅ Cliente marcado como inativo:", id);
    return { success: true };
  } catch (error) {
    console.error("❌ Erro na exclusão lógica:", error);
    return { success: false, message: error.message };
  }
};

// adicionar cliente
export const addCliente = async (cliente) => {
  try {
    const colRef = collection(db, CLIENTES_COLLECTION);
    const docRef = doc(colRef);
    await setDoc(docRef, {
      ...cliente,
      cid: docRef.id,
      ativo: true,
      criadoEm: new Date(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const listenClientes = (callback) => {
  const q = query(collection(db, CLIENTES_COLLECTION), where('ativo', '==', true));
  return onSnapshot(q, (snapshot) => {
    const lista = snapshot.docs.map((doc) => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    callback(lista);
  });
};

export const getClienteById = async (id) => {
  try {
    const ref = doc(db, CLIENTES_COLLECTION, id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return { success: true, data: { id: snap.id, ...snap.data() } };
    }
    return { success: false, message: 'Cliente não encontrado' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateCliente = async (clienteId, dadosAtualizados) => {
  try {
    const ref = doc(db, CLIENTES_COLLECTION, clienteId);
    await updateDoc(ref, {
      ...dadosAtualizados,
      atualizadoEm: new Date(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};