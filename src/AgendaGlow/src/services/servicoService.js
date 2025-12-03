import { db } from '../database/firebase';
import { 
  collection, getDoc, doc, setDoc, query, where, onSnapshot, updateDoc, getDocs 
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

const SERVICOS_COLLECTION = 'servicos';

/** 🔹 Adiciona um novo serviço */
export const addServicos = async (servico) => {
  try {
    console.log('🟢 Salvando serviço...', servico);

    const colRef = collection(db, SERVICOS_COLLECTION);
    const docRef = doc(colRef); // cria referência com ID gerado automaticamente

    await setDoc(docRef, {
      ...servico,
      sid: docRef.id,
      ativo: true,
      criadoEm: new Date(),
    });

    console.log('✅ Serviço criado com ID:', docRef.id);
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao adicionar serviço:', error);
    return { success: false, message: error.message };
  }
};

/** 🔹 Altera um serviço existente */
export async function updateServico(id, novosDados) {
  console.log('🛠️ Iniciando atualização de serviço...', { id, novosDados });
  try {
    if (!id) throw new Error('ID do serviço é obrigatório.');
    if (!novosDados || Object.keys(novosDados).length === 0)
      throw new Error('Nenhum dado fornecido para atualização.');

    const docRef = doc(db, 'servicos', id);

    // Verifica se o documento existe
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      throw new Error('Serviço não encontrado.');
    }

    await updateDoc(docRef, {
      ...novosDados,
      atualizadoEm: new Date(),
    });

    console.log(`✅ Serviço ${id} atualizado com sucesso.`);
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao atualizar serviço:', error);
    return { success: false, message: error.message };
  }
}

/** 🔹 Busca apenas o serviço informado */
export async function getServicoById(id) {
  console.log('🔍 Buscando serviço por ID:', id);
  try {
    if (!id) throw new Error('ID do serviço é obrigatório.');

    const docRef = doc(db, 'servicos', id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      console.warn('⚠️ Serviço não encontrado no Firestore.');
      return { success: false, message: 'Serviço não encontrado.' };
    }

    const data = { id: snapshot.id, ...snapshot.data() };
    console.log('✅ Serviço encontrado:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erro ao buscar serviço:', error);
    return { success: false, message: error.message };
  }
}

/** 🔹 Escuta em tempo real apenas serviços ativos */
export const listenServicos = (callback) => {
  const q = query(collection(db, SERVICOS_COLLECTION), where('ativo', '==', true));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      //console.log('📡 Atualização de serviços recebida:', lista.length);
      callback(lista);
    },
    (error) => console.error('Erro ao ouvir serviços:', error)
  );

  return unsubscribe;
};

export const deleteServico = async (sid, docId = null) => {
  try {
    if (!sid) throw new Error('O campo "sid" é obrigatório.');

    console.log('🗑️ Iniciando exclusão do serviço:', { sid, docId });

    // 🔸 Passo 1 - localizar documento pelo sid
    let targetDocId = docId;
    if (!targetDocId) {
      console.log('🔍 Buscando documento com sid =', sid);
      const q = query(collection(db, SERVICOS_COLLECTION), where('sid', '==', sid));
      const snap = await getDocs(q);

      console.log('📁 Resultado da busca por sid:', snap.docs.map((d) => ({
        id: d.id,
        data: d.data(),
      })));

      if (!snap.empty) {
        targetDocId = snap.docs[0].id;
      } else {
        console.warn('⚠️ Nenhum documento encontrado com esse sid. Usando fallback.');
        targetDocId = sid;
      }
    }

    console.log('📍 Documento alvo para exclusão:', targetDocId);

    // 🔸 Passo 2 - tentar atualizar o campo ativo
    const ref = doc(db, SERVICOS_COLLECTION, targetDocId);
    await updateDoc(ref, { ativo: false });

    console.log(`✅ Serviço ${sid} marcado como inativo com sucesso.`);
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao excluir serviço:', error);
    return { success: false, message: error.message };
  }
};

