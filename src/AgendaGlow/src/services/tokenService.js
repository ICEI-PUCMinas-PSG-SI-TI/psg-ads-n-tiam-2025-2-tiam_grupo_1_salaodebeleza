import * as Notifications from 'expo-notifications';
import { db } from '../database/firebase'; 
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

export async function registerForPushNotifications(funcionarioId) {
    try {
        // 1. VERIFICAR PERMISSÕES
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        
        if (finalStatus !== 'granted') {
            console.error('Falha ao obter token push: permissão negada ou usuário negou.');
            return; // Sai da função se a permissão não for concedida
        }

        // 2. OBTER O TOKEN
        const tokenData = await Notifications.getExpoPushTokenAsync();
        const token = tokenData.data;
        
        // ⬇️ LOG para cópia manual (para o seu teste)
        console.log('Expo Push Token obtido:', token);

        // 3. SALVAR O TOKEN NO FIRESTORE
        if (token && funcionarioId) {
            
            // ⬇️ ETAPA CRÍTICA: FAZER UMA QUERY PELO CAMPO 'uid'
            const funcionariosRef = collection(db, 'funcionarios');
            const q = query(funcionariosRef, where('uid', '==', funcionarioId));
            
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Encontrou o documento correto, independentemente do seu ID
                const docToUpdate = querySnapshot.docs[0];
                
                // ⬇️ Usar updateDoc no documento encontrado (melhor que setDoc para updates)
                await updateDoc(docToUpdate.ref, { 
                    expoPushToken: token,
                    tokenAtualizadoEm: new Date(),
                });
                console.log("Token salvo no documento original do Firestore:", docToUpdate.id);

            } else {
                console.error("ERRO: Documento do funcionário não encontrado com o campo uid:", funcionarioId);
            }
        }
        
        return token;
    } catch (error) {
        // ⬇️ TRATAMENTO CRÍTICO: Imprime o erro e NÃO trava a execução do app.
        console.error("ERRO CRÍTICO no registro do Push Token:", error);
        
        // Retorne ou não faça nada, mas NÃO permita que o erro quebre o app.
        return null; 
    }
}