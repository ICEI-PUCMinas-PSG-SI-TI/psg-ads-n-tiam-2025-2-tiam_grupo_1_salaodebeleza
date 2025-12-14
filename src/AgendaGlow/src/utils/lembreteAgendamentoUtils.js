import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';
import { Alert } from 'react-native';
import { collection, onSnapshot, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../database/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// 🔔 CONFIGURAÇÃO OBRIGATÓRIA
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// 👉 PERMISSÃO
async function pedirPermissao() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    await Notifications.requestPermissionsAsync();
  }
}

export async function iniciarLembretesWhatsApp() {
  await pedirPermissao();

  console.log('📱 Listener de notificação ativo');

  // ✅ LISTENER DE CLIQUE NA NOTIFICAÇÃO (ESSENCIAL)
  const responseListener =
    Notifications.addNotificationResponseReceivedListener((response) => {
      const dados = response.notification.request.content.data;

      if (dados?.tipo !== 'whatsapp') return;

      Alert.alert(
        'Enviar lembrete?',
        `Enviar WhatsApp para ${dados.nomeCliente}?`,
        [
          { text: 'Não', style: 'cancel' },
          {
            text: 'Sim',
            onPress: () => {
              const msg = `Olá ${dados.nomeCliente}! 😊 Lembrando do seu agendamento em ${dados.data} às ${dados.horario}.`;
              const url = `https://wa.me/55${dados.telefone}?text=${encodeURIComponent(msg)}`;
              Linking.openURL(url);
            },
          },
        ]
      );
    });

  // 🔐 AGUARDA LOGIN
  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.log('⛔ Usuário não autenticado');
      return;
    }

    console.log('✅ Usuário autenticado — lendo agendamentos');

    const ref = collection(db, 'agendamentos');

    onSnapshot(ref, async (snapshot) => {
      const agora = new Date();
      const hoje = new Date().toLocaleDateString('pt-BR');

      for (const snap of snapshot.docs) {
        const ag = snap.data();
        const agId = snap.id;

        if (ag.ultimoAlertaWhatsApp === hoje) continue;
        if (!ag.data || !ag.horario || !ag.cliente) continue;

        // ⬇️ BUSCA CLIENTE PELO ID (SEM ALTERAR MODELAGEM)
        const clienteRef = doc(db, 'clientes', ag.cliente);
        const clienteSnap = await getDoc(clienteRef);

        if (!clienteSnap.exists()) continue;

        const cliente = clienteSnap.data();
        if (!cliente.telefone) continue;

        const [d, m, a] = ag.data.split('/');
        const [h, min] = ag.horario.split(':');

        const dataAg = new Date(a, m - 1, d, h, min);
        const diff = dataAg - agora;

        const tresHoras = 3 * 60 * 60 * 1000;
        const margem = 5 * 60 * 1000;

        if (diff > tresHoras - margem && diff <= tresHoras + margem) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: '📱 Lembrete WhatsApp',
              body: `Cliente: ${cliente.nome}\nToque para enviar`,
              data: {
                tipo: 'whatsapp',
                telefone: cliente.telefone,
                nomeCliente: cliente.nome,
                data: ag.data,
                horario: ag.horario,
              },
            },
            trigger: null,
          });

          await updateDoc(doc(db, 'agendamentos', agId), {
            ultimoAlertaWhatsApp: hoje,
          });

          console.log('🔔 Notificação enviada:', cliente.nome);
        }
      }
    });
  });

  // 🧹 CLEANUP
  return () => {
    responseListener.remove();
    unsubscribeAuth && unsubscribeAuth();
  };
}

