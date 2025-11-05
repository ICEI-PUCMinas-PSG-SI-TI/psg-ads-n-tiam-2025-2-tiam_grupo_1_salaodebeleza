const functions = require("firebase-functions");
const admin = require("firebase-admin");
// 1. ADICIONAR O PACOTE 'cors'
const cors = require("cors")({ origin: true }); // Permite CORS

admin.initializeApp();

/**
 * Exclui um funcionário completamente (Auth + Firestore)
 */

// 2. A SUA FUNÇÃO ANTIGA (onCall) FOI SUBSTITUÍDA
// exports.deleteFuncionario = functions.https.onCall(async (data, context) => { ... });

// 3. A NOSSA FUNÇÃO NOVA (onRequest, que suporta CORS)
exports.deleteFuncionario = functions.https.onRequest((req, res) => {
  // 4. Envolvemos a nossa lógica com o 'cors'
  cors(req, res, async () => {
    // 5. Verificamos a autenticação (substitui o 'context.auth')
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      console.error("Não autorizado. Sem token.");
      res.status(403).send("Não autorizado.");
      return;
    }

    // 6. Pegamos os dados (substitui o 'data.uid')
    // A nossa app (funcionarioService) vai enviar como { data: { uid } }
    const { uid } = req.body.data;
    const idToken = req.headers.authorization.split('Bearer ')[1];

    try {
      // 7. Verificamos se o token é válido (segurança extra)
      await admin.auth().verifyIdToken(idToken);
      
      // 8. O RESTO DA SUA LÓGICA ORIGINAL
      if (!uid) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "O UID do usuário é obrigatório."
        );
      }

      await admin.auth().deleteUser(uid);
      const funcionariosRef = admin.firestore().collection("funcionarios");
      const snapshot = await funcionariosRef.where("uid", "==", uid).get();

      for (const doc of snapshot.docs) {
        await doc.ref.delete();
      }

      console.log(`Funcionário ${uid} excluído com sucesso.`);
      // 9. Devolvemos uma resposta de sucesso
      res.status(200).send({ data: { success: true } });

    } catch (error) {
      console.error("Erro ao excluir funcionário:", error);
      // 10. Devolvemos uma resposta de erro
      res.status(500).send({ error: error.message });
    }
  });
});