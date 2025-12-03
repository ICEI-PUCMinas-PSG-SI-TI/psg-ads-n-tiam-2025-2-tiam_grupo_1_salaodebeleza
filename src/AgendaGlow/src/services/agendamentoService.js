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

// --- NOVA FUNÇÃO: Agendamentos Próximos ---
/**
 * Busca todos os ativos mais proximos da data e horario atual.
 * Criado em 27/11/25 para tela Home.
 */
export const listenProximosAgendamentosAdmin = (callback) => {
  const q = query(
    collection(db, AGENDAMENTOS_COLLECTION),
    where('ativo', '==', true)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const lista = snapshot.docs
        .map((doc) => {
          const item = { id: doc.id, ...doc.data() };

          // --- converter data "29/11/2025" ---
          if (!item.data) return { ...item, timestamp: null };
          const [dia, mes, ano] = item.data.split('/').map(Number);

          // --- converter hora "12:30" ---
          const [h, m] = item.horario
            ? item.horario.split(':').map(Number)
            : [23, 59];

          // --- criar date completa ---
          const dt = new Date(ano, mes - 1, dia, h, m, 0);

          return {
            ...item,
            timestamp: dt.getTime(),
            parsedDate: dt
          };
        })

        // pegar somente os de hoje
        .filter((item) => {
          if (!item.timestamp) return false;

          const d = new Date(item.timestamp);
          d.setHours(0, 0, 0, 0);

          return d.getTime() === today.getTime();
        })

        // ordenar por horário
        .sort((a, b) => a.timestamp - b.timestamp)

        // limitar 4
        .slice(0, 4);

      callback(lista);
    },
    (error) => console.error("Erro ao ouvir próximos agendamentos:", error)
  );
};


export const listenProximosAgendamentosPorProfissional = (
  profissionalId,
  email,
  callback
) => {
  if (!profissionalId && !email) {
    console.warn('listenProximosAgendamentosPorProfissional: nenhum identificador fornecido');
    return () => {};
  }

  const q = query(
    collection(db, AGENDAMENTOS_COLLECTION),
    where('ativo', '==', true) // filtragem por profissional será feita no cliente para suportar diferentes formatos
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const lista = snapshot.docs
        .map((doc) => {
          const item = { id: doc.id, ...doc.data() };

          if (!item.data) return { ...item, timestamp: null };

          const [dia, mes, ano] = item.data.split('/').map(Number);

          const [h, m] = item.horario
            ? item.horario.split(':').map(Number)
            : [23, 59];

          const dt = new Date(ano, mes - 1, dia, h, m, 0);

          return {
            ...item,
            timestamp: dt.getTime(),
            parsedDate: dt,
            __profMatch: (
              (Array.isArray(item.profissionais) && item.profissionais.includes(profissionalId)) ||
              (item.profissional && item.profissional === profissionalId) ||
              (email && item.email && item.email === email)
            )
          };
        })

        .filter((item) => {
          // por hoje
          if (!item.timestamp) return false;
          const d = new Date(item.timestamp);
          d.setHours(0, 0, 0, 0);
          if (d.getTime() !== today.getTime()) return false;

          // filtrar por profissional (compatibilidade com campos antigos)
          if (profissionalId || email) {
            return !!item.__profMatch;
          }
          return true;
        })

        .sort((a, b) => a.timestamp - b.timestamp)

        .slice(0, 4);

      callback(lista);
    },
    (error) =>
      console.error("Erro ao ouvir agendamentos do profissional:", error)
  );
};

// Listener por data (ex.: hoje) — retorna todos os agendamentos ativos cuja data bate
export const listenAgendamentosPorData = (dataStr, callback) => {
  if (!dataStr) {
    console.warn('listenAgendamentosPorData: dataStr inválido');
    return () => {};
  }

  const q = query(
    collection(db, AGENDAMENTOS_COLLECTION),
    where('ativo', '==', true),
    where('data', '==', dataStr)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(lista);
    },
    (error) => console.error('Erro ao ouvir agendamentos por data:', error)
  );
};
