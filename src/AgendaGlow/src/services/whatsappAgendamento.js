// src/AgendaGlow/src/services/whatsappAgendamento.js
import { Linking, Alert } from 'react-native';

export function enviarWhatsappAgendamento({ nome, telefone, data, horario, servicos }) {
  if (!telefone) {
    Alert.alert('Atenção', 'O cliente está sem telefone cadastrado.');
    return;
  }

  // remove tudo que não é número
  const telefoneLimpo = telefone.replace(/\D/g, '');

  // garante DDI do Brasil (55)
  const numeroComDDI = telefoneLimpo.startsWith('55')
    ? telefoneLimpo
    : `55${telefoneLimpo}`;

  const listaServicos = Array.isArray(servicos)
    ? servicos.join(', ')
    : servicos || '';

  const mensagem = `Olá ${nome}! 👋

Seu agendamento no salão Maysa Rodrigues foi realizado com sucesso.

📅 Data: ${data}
⏰ Horário: ${horario}
💅 Serviços: ${listaServicos}

Qualquer dúvida é só responder por aqui.
Agradecemos pela preferência! 😊`;

  const url = `https://wa.me/${numeroComDDI}?text=${encodeURIComponent(mensagem)}`;

  Linking.openURL(url).catch(() => {
    Alert.alert('Erro', 'Não foi possível abrir o WhatsApp neste dispositivo.');
  });
}
