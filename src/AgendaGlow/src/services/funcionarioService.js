import { auth, db } from '../database/firebase';
import { 
  collection, addDoc, query, where, onSnapshot, deleteDoc, doc
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';

const FUNCIONARIOS_COLLECTION = 'funcionarios';

/** Adiciona um novo funcionário */
export const addFuncionario = async (funcionario) => {
  try {
    const senhaPadrao = "agendaglow12345";
    
    // Cria o usuário no Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      funcionario.email,
      senhaPadrao
    );
    const user = userCredential.user;

    // Cria o documento na coleção "funcionarios" com o UID do usuário e status ativo
    await addDoc(collection(db, FUNCIONARIOS_COLLECTION), {
      ...funcionario,
      uid: user.uid,
      ativo: true,
      criadoEm: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao adicionar funcionário:', error);
    return { success: false, message: error.message };
  }
};

/** Escuta em tempo real apenas funcionários ativos */
export const listenFuncionarios = (callback) => {
  const q = query(collection(db, FUNCIONARIOS_COLLECTION), where('ativo', '==', true));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(lista);
    },
    (error) => console.error('Erro ao ouvir funcionários:', error)
  );

  return unsubscribe;
};

/** Exclui completamente um funcionário (Firestore + Authentication) */
export const deleteFuncionario = async (uid, docId) => {
  try {
    // 1️⃣ Chama a Cloud Function para remover da Authentication e do Firestore
    const functions = getFunctions();
    const deleteFuncionarioFn = httpsCallable(functions, 'deleteFuncionario');

    await deleteFuncionarioFn({ uid });

    // 2️⃣ (Opcional, mas recomendado) Remove o documento localmente do Firestore
    // caso a função na nuvem só apague do Auth e não do banco
    if (docId) {
      const ref = doc(db, FUNCIONARIOS_COLLECTION, docId);
      await deleteDoc(ref);
    }

    console.log('Funcionário excluído com sucesso.');
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir funcionário:', error);
    return { success: false, message: error.message };
  }
};
