const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

/**
 * Exclui um funcionário completamente (Auth + Firestore)
 */
exports.deleteFuncionario = functions.https.onCall(async (data, context) => {
  // Só permite que usuários autenticados chamem
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Você precisa estar autenticado para excluir usuários."
    );
  }

  const { uid } = data;

  if (!uid) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "O UID do usuário é obrigatório."
    );
  }

  try {
    // Exclui o usuário do Authentication
    await admin.auth().deleteUser(uid);

    // Também tenta excluir do Firestore (coleção 'funcionarios')
    const funcionariosRef = admin.firestore().collection("funcionarios");
    const snapshot = await funcionariosRef.where("uid", "==", uid).get();

    for (const doc of snapshot.docs) {
      await doc.ref.delete();
    }

    console.log(`Funcionário ${uid} excluído com sucesso.`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir funcionário:", error);
    throw new functions.https.HttpsError("unknown", error.message);
  }
});