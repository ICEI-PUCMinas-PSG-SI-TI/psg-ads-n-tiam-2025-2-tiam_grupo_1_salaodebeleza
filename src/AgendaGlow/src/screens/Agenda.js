import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, 
  ActivityIndicator, Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { theme } from '../styles/theme';
import { listenAgendamentos, deleteAgendamento } from '../services/agendamentoService';
import { listenFuncionarios } from '../services/funcionarioService';
import { listenServicos } from '../services/servicoService';
import { Ionicons } from '@expo/vector-icons';

export default function Agenda() {
  const navigation = useNavigation();
  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamentosDoDia, setAgendamentosDoDia] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalViewVisible, setModalViewVisible] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);

  // Função para formatar data no formato pt-BR
  const formatarDataHoje = () => {
    const hoje = new Date();
    return hoje.toLocaleDateString('pt-BR');
  };

  // Função para obter informações do funcionário
  const getFuncionarioNome = (funcionarioId) => {
    const funcionario = funcionarios.find(f => f.id === funcionarioId);
    return funcionario ? funcionario.nome : 'Não informado';
  };

  // Função para obter informações do serviço
  const getServicoNome = (servicoId) => {
    const servico = servicos.find(s => s.id === servicoId);
    return servico ? servico.nome : 'Não informado';
  };

  // Função para obter nome do cliente (mock por enquanto)
  const getClienteNome = (clienteId) => {
    const mockClientes = {
      'maria': 'Maria Silva',
      'joao': 'João Oliveira',
    };
    return mockClientes[clienteId] || clienteId || 'Não informado';
  };

  useEffect(() => {
    const unsubscribeAgendamentos = listenAgendamentos((lista) => {
      setAgendamentos(lista);
      // Filtrar agendamentos do dia atual
      const dataHoje = formatarDataHoje();
      const agendamentosHoje = lista.filter(a => a.data === dataHoje);
      setAgendamentosDoDia(agendamentosHoje);
      setLoading(false);
    });

    const unsubscribeFuncionarios = listenFuncionarios((lista) => {
      setFuncionarios(lista);
    });

    const unsubscribeServicos = listenServicos((lista) => {
      setServicos(lista);
    });

    return () => {
      unsubscribeAgendamentos();
      unsubscribeFuncionarios();
      unsubscribeServicos();
    };
  }, []);

  const abrirModalView = (agendamento) => {
    setAgendamentoSelecionado(agendamento);
    setModalViewVisible(true);
  };

  const fecharModalView = () => {
    setAgendamentoSelecionado(null);
    setModalViewVisible(false);
  };

  // Função para excluir agendamento com confirmação
  const handleExcluir = async () => {
    if (!agendamentoSelecionado) return;

    Alert.alert(
      'Excluir agendamento',
      `Tem certeza que deseja excluir este agendamento?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const result = await deleteAgendamento(agendamentoSelecionado.id);

              if (result.success) {
                Alert.alert('Sucesso', 'Agendamento excluído com sucesso!');
                setAgendamentosDoDia((prev) =>
                  prev.filter((a) => a.id !== agendamentoSelecionado.id)
                );
                fecharModalView();
              } else {
                Alert.alert('Erro', result.message || 'Falha ao excluir agendamento.');
              }
            } catch (error) {
              Alert.alert('Erro', error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header userName="Usuario" />

      {/* Cabeçalho */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Agenda</Text>
        <Button title="Adicionar +" small onPress={() => navigation.navigate('AgendamentoCadastro')} />
      </View>

      {/* Data do dia */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>Hoje - {formatarDataHoje()}</Text>
      </View>

      {/* Lista */}
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.listContainer}>
          {agendamentosDoDia.length === 0 ? (
            <Text style={{ textAlign: 'center', color: theme.colors.textInput }}>
              Nenhum agendamento para hoje.
            </Text>
          ) : (
            agendamentosDoDia.map((a) => (
              <Card
                key={a.id}
                icon="calendar-outline"
                title={`${getClienteNome(a.cliente)} - ${a.horario || 'Sem horário'}`}
                subtitle={`${getServicoNome(a.servico)} · ${getFuncionarioNome(a.profissional)}`}
                onView={() => abrirModalView(a)}
              />
            ))
          )}
        </ScrollView>
      )}

      {/* MODAL DE VISUALIZAÇÃO */}
      <Modal
        visible={modalViewVisible}
        animationType="none"
        transparent={true}
        onRequestClose={fecharModalView}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalhes do Agendamento</Text>
              <TouchableOpacity onPress={fecharModalView}>
                <Ionicons name="close" size={26} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {agendamentoSelecionado && (
              <View style={styles.modalContent}>
                <Text style={styles.info}>
                  <Text style={styles.label}>Cliente:</Text> {getClienteNome(agendamentoSelecionado.cliente)}
                </Text>
                <Text style={styles.info}>
                  <Text style={styles.label}>Serviço:</Text> {getServicoNome(agendamentoSelecionado.servico)}
                </Text>
                <Text style={styles.info}>
                  <Text style={styles.label}>Profissional:</Text> {getFuncionarioNome(agendamentoSelecionado.profissional)}
                </Text>
                <Text style={styles.info}>
                  <Text style={styles.label}>Data:</Text> {agendamentoSelecionado.data}
                </Text>
                <Text style={styles.info}>
                  <Text style={styles.label}>Horário:</Text> {agendamentoSelecionado.horario || 'Não informado'}
                </Text>
                <Text style={styles.info}>
                  <Text style={styles.label}>Valor:</Text> {agendamentoSelecionado.valor ? `R$ ${agendamentoSelecionado.valor}` : 'Não informado'}
                </Text>
                {agendamentoSelecionado.observacoes && (
                  <Text style={styles.info}>
                    <Text style={styles.label}>Observações:</Text> {agendamentoSelecionado.observacoes}
                  </Text>
                )}

                {/* Botão de excluir dentro do modal */}
                <Button
                  title="Excluir Agendamento"
                  onPress={handleExcluir}
                  style={{
                    backgroundColor: theme.colors.primary || '#FF4C4C',
                    marginTop: 20,
                  }}
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.large,
    paddingVertical: theme.spacing.medium,
  },
  title: { fontSize: 20, fontWeight: '700', color: theme.colors.text },
  dateContainer: {
    paddingHorizontal: theme.spacing.large,
    paddingBottom: theme.spacing.small,
  },
  dateText: {
    fontSize: 14,
    color: theme.colors.textInput,
    fontWeight: '500',
  },
  listContainer: { paddingHorizontal: theme.spacing.large, paddingBottom: 100 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    padding: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  modalContent: { marginTop: 10 },
  info: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 8,
  },
  label: {
    fontWeight: '700',
    color: theme.colors.primary,
  },
});
