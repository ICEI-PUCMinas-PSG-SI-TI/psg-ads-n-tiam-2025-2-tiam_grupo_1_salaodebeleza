import { db } from '../database/firebase';
import { 
  collection, addDoc, query, where, onSnapshot, deleteDoc, doc, updateDoc, getDocs, serverTimestamp
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

const CLIENTES_COLLECTION = 'clientes';

// 🔹 FUNÇÃO DE EXCLUSÃO 
/* export const deleteCliente = async (id) => {
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
}; */

// adicionar cliente
export const addCliente = async (cliente) => {
  try {
    const colRef = collection(db, CLIENTES_COLLECTION);
    const docRef = doc(colRef);
    await setDoc(docRef, {
      ...cliente,
      cid: docRef.id,
      ativo: true,
      criadoEm: serverTimestamp(), // mais consistente que new Date()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
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

/**
 * Exclusão lógica: marca o cliente como inativo (ativo = false)
 * @param {string} sid - identificador lógico do cliente (campo sid)
 * @param {string} [docId] - id do documento Firestore (opcional)
 */
export const deleteCliente = async (sid, docId = null) => {
  try {
    // Se docId foi fornecido, use direto (mais confiável)
    let targetDocId = docId;
    if (!targetDocId) {
      if (!sid) throw new Error('É necessário fornecer docId ou sid para excluir o cliente.');
      // procurar pelo campo sid no documento
      const q = query(collection(db, CLIENTES_COLLECTION), where('sid', '==', sid));
      const snap = await getDocs(q);
      if (!snap.empty) {
        targetDocId = snap.docs[0].id;
      } else {
        throw new Error(`Cliente com sid "${sid}" não encontrado.`);
      }
    }

    const ref = doc(db, CLIENTES_COLLECTION, targetDocId);

    // atualiza documento para exclusão lógica
    await updateDoc(ref, {
      ativo: false,
      removidoEm: serverTimestamp(),
    });

    console.log(`Cliente (docId=${targetDocId}) marcado como inativo.`);
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir cliente (soft):', error);
    return { success: false, message: error?.message ?? 'Erro desconhecido ao excluir cliente.' };
  }
};

/**
 * Exclusão física (hard delete) — use com cuidado
 * @param {string} docId - id do documento no Firestore
 */
export const hardDeleteCliente = async (docId) => {
  try {
    if (!docId) throw new Error('docId é obrigatório para exclusão física.');
    const ref = doc(db, CLIENTES_COLLECTION, docId);
    await deleteDoc(ref);
    console.log(`Documento ${docId} removido permanentemente.`);
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir cliente (hard):', error);
    return { success: false, message: error.message };
  }
};