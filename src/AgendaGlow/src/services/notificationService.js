import * as Notifications from 'expo-notifications';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'; 
import { db } from '../database/firebase'; // Supondo que você exporta 'db' aqui

// --- CONFIGURAÇÃO INICIAL (Obrigatória) ---
// Mantenha o handler para notificaçoes recebidas enquanto o app está aberto
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

/**
 * 📧 NOVO: Envia a notificação PUSH para a lista de profissionais envolvidos.
 * * @param {string[]} profissionalIds IDs dos documentos dos funcionários envolvidos.
 * @param {string} serviceTitle O título do serviço agendado.
 * @param {string} dataHoraStr A data e hora do agendamento (Ex: "10/12/2025 às 14:30").
 */
export async function sendAppointmentPush(profissionalIds, serviceTitle, dataHoraStr) {
    const tokens = [];
    console.log("Buscando os tokens");
    // 1. Buscar os tokens push dos profissionais envolvidos
    const q = query(collection(db, 'funcionarios'), where('id', 'in', profissionalIds));
    // NOTA: Se o ID do documento (func.id) for o mesmo do campo 'id' dentro do doc, 
    // a query é complexa. A maneira mais simples é buscar um por um ou usar uma coleção 'tokens'.
    
    // Simplificando: Buscar cada token individualmente (ou ajustar a query se o 'id' do doc for o uid)
    for (const id of profissionalIds) {
        const docRef = doc(db, 'funcionarios', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().expoPushToken) {
            tokens.push(docSnap.data().expoPushToken);
        }
    }
    
    if (tokens.length === 0) {
        console.warn("Nenhum token push encontrado para os profissionais selecionados.");
        return;
    }
    
    console.log("Criando as mensagens");
    // 2. Criar a mensagem Push para cada token
    const messages = tokens.map(token => ({
        to: token,
        sound: 'default',
        title: '🔔 Novo Horário Agendado',
        body: `Você tem um serviço de "${serviceTitle}" agendado para ${dataHoraStr}.`,
        data: { 
            type: 'new_appointment',
            service: serviceTitle,
            time: dataHoraStr
        },
    }));
    
    console.log("Enviando a notificação");
    // 3. Enviar a notificação via API do Expo (Lote)
    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(messages),
    });

    console.log(`Push Notifications enviadas para ${tokens.length} funcionários.`);
}