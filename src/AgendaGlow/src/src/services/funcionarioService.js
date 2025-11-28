import { auth, db } from '../database/firebase';
import { 
  collection, addDoc, query, where, onSnapshot, deleteDoc, doc,
  getDocs, updateDoc, serverTimestamp
} from 'firebase/firestore';
import { 
    createUserWithEmailAndPassword, 
    EmailAuthProvider, 
    reauthenticateWithCredential, 
    updatePassword,
    updateEmail
} from 'firebase/auth'; 

const FUNCIONARIOS_COLLECTION = 'funcionarios';

// Função para adicionar um novo funcionário/gestor 
export const addFuncionario = async (funcionario) => {
  try {
    const senhaPadrao = "agendaglow12345";
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      funcionario.email,
      senhaPadrao
    );
    const user = userCredential.user;
    await addDoc(collection(db, FUNCIONARIOS_COLLECTION), {
      ...funcionario,
      uid: user.uid,
      ativo: true,
      criadoEm: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error('Erro ao adicionar profissional:', error);
    if (error.code === 'auth/email-already-in-use') {
      return { success: false, message: 'Este e-mail já está em uso por outra conta.' };
    }
    if (error.code === 'auth/invalid-email') {
      return { success: false, message: 'O e-mail fornecido é inválido.' };
    }
    return { success: false, message: error.message };
  }
};

// Função para ouvir todos os funcionários ativos em tempo real
export const listenFuncionarios = (callback) => {
  const q = query(collection(db, FUNCIONARIOS_COLLECTION), where('ativo', '==', true));
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(lista);
    },
    (error) => console.error('Erro ao ouvir profissionais:', error)
  );
  return unsubscribe;
};

// Função para ouvir todos os funcionários por email
export const getFuncionarioByEmail = async (email) => {
  try {
    const q = query(collection(db, FUNCIONARIOS_COLLECTION), where("email", "==", email));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const docData = snap.docs[0];
      return { success: true, data: { id: docData.id, ...docData.data() } };
    } else {
      return { success: false, message: 'Profissional não encontrado.' };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Função para buscar um funcionário pelo seu UID
export const getFuncionarioByUid = async (uid) => {
  try {
    const q = query(collection(db, FUNCIONARIOS_COLLECTION), where("uid", "==", uid));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const docData = snap.docs[0];
      return { success: true, data: { id: docData.id, ...docData.data() } };
    } else {
      return { success: false, message: 'Profissional não encontrado.' };
    }
  } catch (error) {
    console.error('Erro ao buscar profissional por UID:', error);
    return { success: false, message: error.message };
  }
};

// Função para excluir (exclusão lógica) um funcionário no banco
export const deleteFuncionario = async (uid) => {
  try {
    if (!uid) throw new Error('UID é obrigatório para exclusão.');

    const q = query(collection(db, FUNCIONARIOS_COLLECTION), where('uid', '==', uid));
    const snap = await getDocs(q);

    if (snap.empty) {
      throw new Error(`Profissional com UID "${uid}" não encontrado.`);
    }

    const ref = doc(db, FUNCIONARIOS_COLLECTION, snap.docs[0].id);

    await updateDoc(ref, {
      ativo: false,
      removidoEm: serverTimestamp(),
    });

    console.log(`Profissional (uid=${uid}) marcado como inativo.`);
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir profissional (soft delete):', error);
    return { success: false, message: error?.message ?? 'Erro desconhecido ao excluir profissional.' };
  }
};

// Função para atualizar os dados de um funcionário
export const updateFuncionarioComAuth = async (id, dados, senhaAtual = null) => {
  try {
    // Se for necessário reautenticar (usuário de senha)
    if (senhaAtual) {
      const user = auth.currentUser;
      const cred = EmailAuthProvider.credential(user.email, senhaAtual);
      await reauthenticateWithCredential(user, cred);

      // Atualiza e-mail no Firebase Auth, se foi alterado
      if (dados.email && dados.email !== user.email) {
        await updateEmail(user, dados.email);
      }
    }

    // Atualiza os dados no Firestore
    const ref = doc(db, FUNCIONARIOS_COLLECTION, id);
    await updateDoc(ref, dados);

    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar dados do profissional:', error);
    return { success: false, message: error.message };
  }
};

/** Atualiza a senha do funcionário autenticado */
export const updateFuncionarioPassword = async (senhaAtual, novaSenha) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado.');

    const cred = EmailAuthProvider.credential(user.email, senhaAtual);
    await reauthenticateWithCredential(user, cred);
    await updatePassword(user, novaSenha);

    return { success: true };
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    return { success: false, message: error.message };
  }
};

/* export const updateFuncionario = async (id, dados) => {
  try {
    const ref = doc(db, FUNCIONARIOS_COLLECTION, id);
    await updateDoc(ref, dados);
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar profissional:', error);
    return { success: false, message: error.message };
  }
}; */

/* export const getFuncionarioByEmail = async (email) => {
  try {
    //console.log('Email na service: ', email)
    const q = query(
      collection(db, FUNCIONARIOS_COLLECTION),
      where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return { success: false, message: "Profissional não encontrado." };
    }
    const funcionario = querySnapshot.docs[0];
    return {
      success: true,
      data: { id: funcionario.id, ...funcionario.data() },
    };
  } catch (error) {
    console.error("Erro ao buscar profissional por e-mail:", error);
    return { success: false, message: error.message };
  }
}; */