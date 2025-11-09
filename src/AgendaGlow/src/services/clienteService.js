import { db } from '../database/firebase';
import { 
  collection, doc, setDoc, query, where, onSnapshot, updateDoc, getDocs,getDoc 
} from 'firebase/firestore';

const CLIENTES_COLLECTION = 'clientes';

/** Adiciona um novo cliente */
export const addCliente = async (cliente) => {
  try {
    console.log('🟢 Salvando cliente...', cliente);

    const colRef = collection(db, CLIENTES_COLLECTION);
    const docRef = doc(colRef);

    await setDoc(docRef, {
      ...cliente,
      cid: docRef.id,
      ativo: true,
      criadoEm: new Date(),
    });

    console.log('✅ Cliente criado com ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('❌ Erro ao adicionar cliente:', error);
    return { success: false, message: error.message };
  }
};

/** Escuta em tempo real apenas clientes ativos */
export const listenClientes = (callback) => {
  const q = query(collection(db, CLIENTES_COLLECTION), where('ativo', '==', true));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        cid: doc.id,
        ...doc.data() 
      }));
      console.log('📡 Atualização de clientes recebida:', lista.length);
      callback(lista);
    },
    (error) => console.error('Erro ao ouvir clientes:', error)
  );

  return unsubscribe;
};

/**  Exclui cliente (marca como inativo) */
export const deleteCliente = async (id) => {
  try {
    console.log("🚨 Exclusão lógica iniciada para ID:", id);
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

/** Atualiza um cliente existente */
export const updateCliente = async (cid, dadosAtualizados) => {
  try {
    if (!cid) throw new Error('O campo "cid" é obrigatório.');

    console.log('🔄 Atualizando cliente:', { cid, dadosAtualizados });

    // Buscar o documento pelo cid
    const q = query(collection(db, CLIENTES_COLLECTION), where('cid', '==', cid));
    const snap = await getDocs(q);

    if (snap.empty) {
      throw new Error('Cliente não encontrado');
    }

    const targetDocId = snap.docs[0].id;
    const ref = doc(db, CLIENTES_COLLECTION, targetDocId);

    await updateDoc(ref, {
      ...dadosAtualizados,
      atualizadoEm: new Date(),
    });

   
  } catch (error) {
    console.error('❌ Erro ao atualizar cliente:', error);
    return { success: false, message: error.message };
  }
};

/**  Busca um cliente pelo ID */
export const getClienteById = async (id) => {
  try {
    console.log('🔍 Buscando cliente por ID:', id);
    
    const ref = doc(db, CLIENTES_COLLECTION, id);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const cliente = {
        id: snap.id,
        ...snap.data()
      };
      console.log('✅ Cliente encontrado:', cliente);
      return { success: true, data: cliente };
    } else {
      console.log('❌ Cliente não encontrado');
      return { success: false, message: 'Cliente não encontrado' };
    }
  } catch (error) {
    console.error('❌ Erro ao buscar cliente:', error);
    return { success: false, message: error.message };
  }
};