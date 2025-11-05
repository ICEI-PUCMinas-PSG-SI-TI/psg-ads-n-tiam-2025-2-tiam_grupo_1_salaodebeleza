
import { auth, db } from '../database/firebase';
import { 
  collection, addDoc, query, where, onSnapshot, deleteDoc, doc, updateDoc, getDocs
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

const CLIENTES_COLLECTION = 'cliente';

/** Adiciona um novo cliente */
export const addClientes = async (cliente) => {
  try {
    // 1️⃣ Cria o documento sem o SID
    const docRef = await addDoc(collection(db, CLIENTES_COLLECTION), {
      ...cliente,
      ativo: true,
      criadoEm: new Date(),
    });

    // 2️⃣ Atualiza o documento com o SID = ID gerado
    await updateDoc(docRef, { sid: docRef.id });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Erro ao adicionar cliente:', error);
    return { success: false, message: error.message };
  }
};

/** Escuta em tempo real apenas clientes ativos */
export const listenClientes = (callback) => {
  const q = query(collection(db, CLIENTES_COLLECTION), where('ativo', '==', true));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(lista);
    },
    (error) => console.error('Erro ao ouvir serviços:', error)
  );

  return unsubscribe;
};

/**
 * Exclui um cliente (Firestore + Cloud Function opcional)
 * @param {string} sid - ID único do cliente (igual ao docRef.id)
 * @param {string} [docId] - ID do documento (opcional)
 */
export const deleteCliente = async (sid, docId = null) => {
  try {
    if (!sid) throw new Error('O campo "sid" é obrigatório.');

    // 1️⃣ Tenta chamar a Cloud Function (se existir)
    try {
      const functions = getFunctions(undefined, 'southamerica-east1'); // ajuste região se necessário
      const deleteClienteFn = httpsCallable(functions, 'deleteCliente');
      await deleteClienteFn({ sid });
      console.log('Cloud Function deleteServico executada com sucesso:', sid);
    } catch (fnErr) {
      console.warn('Cloud Function deleteServico não foi executada (seguindo sem ela):', fnErr.message);
    }

    // 2️⃣ Localiza o documento (caso docId não tenha sido passado)
    let targetDocId = docId;

    if (!targetDocId) {
      // Busca por campo sid no Firestore
      const q = query(collection(db, CLIENTES_COLLECTION), where('sid', '==', sid));
      const snap = await getDocs(q);
      if (!snap.empty) {
        targetDocId = snap.docs[0].id;
      } else {
        // fallback: tenta usar sid como docId
        targetDocId = sid;
      }
    }

    // 3️⃣ Remove o documento
    const ref = doc(db, CLIENTES_COLLECTION, targetDocId);
    await deleteDoc(ref);

    console.log(`Cliente ${sid} removido com sucesso do Firestore.`);
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    return { success: false, message: error.message };
  }
};
