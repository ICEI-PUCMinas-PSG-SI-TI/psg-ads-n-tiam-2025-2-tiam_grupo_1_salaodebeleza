import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { theme } from '../styles/theme';
import { listenServicos, deleteServico } from '../services/servicoService';
import { Ionicons } from '@expo/vector-icons';

export default function Servicos({ navigation }) {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalViewVisible, setModalViewVisible] = useState(false);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);

  useEffect(() => {
    const unsubscribe = listenServicos((lista) => {
      setServicos(lista);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const abrirModalView = (servico) => {
    setServicoSelecionado(servico);
    setModalViewVisible(true);
  };

  const fecharModalView = () => {
    setServicoSelecionado(null);
    setModalViewVisible(false);
  };

  const abrirModalConfirmacao = () => {
    // Fecha o modal de detalhes antes de abrir o de confirmação
    setModalViewVisible(false);
    setModalConfirmVisible(true);
  };

  const handleEditar = () => {
    if (servicoSelecionado) {
      fecharModalView();
      navigation.navigate('ServicosCadastro', { id: servicoSelecionado.sid });
    }
  };

  const handleExcluir = async () => {
    if (!servicoSelecionado) return;
    try {
      setLoading(true);
      setModalConfirmVisible(false);

      const result = await deleteServico(servicoSelecionado.sid, servicoSelecionado.id);
      if (result.success) {
        setServicos(prev => prev.filter(s => s.id !== servicoSelecionado.id));
      } else {
        console.error('Falha ao excluir serviço:', result.message);
      }
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header userName="Usuario" />

      <View style={styles.headerRow}>
        <Text style={styles.title}>Serviços</Text>
        <Button title="Adicionar +" small onPress={() => navigation.navigate('ServicosCadastro')} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.listContainer}>
          {servicos.length === 0 ? (
            <Text style={{ textAlign: 'center', color: theme.colors.textInput }}>
              Nenhum serviço cadastrado.
            </Text>
          ) : (
            servicos.map((s) => (
              <Card
                key={s.id}
                title={s.nome}
                subtitle={s.descricao}
                onView={() => abrirModalView(s)}
              />
            ))
          )}
        </ScrollView>
      )}

      {/* MODAL DE VISUALIZAÇÃO */}
      <Modal
        visible={modalViewVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={fecharModalView}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalhes do Serviço</Text>
              <TouchableOpacity onPress={fecharModalView}>
                <Ionicons name="close" size={26} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {servicoSelecionado && (
              <View style={styles.modalContent}>
                <Text style={styles.info}><Text style={styles.label}>Nome:</Text> {servicoSelecionado.nome}</Text>
                <Text style={styles.info}><Text style={styles.label}>Descrição:</Text> {servicoSelecionado.descricao}</Text>
                <Text style={styles.info}><Text style={styles.label}>Observações:</Text> {servicoSelecionado.observacoes}</Text>
                <Button
                  title="Editar Serviço"
                  onPress={handleEditar}
                  style={{
                    backgroundColor: theme.colors.primary,
                    marginTop: 20,
                  }}
                />
                <Button
                  title="Excluir Serviço"
                  onPress={abrirModalConfirmacao}
                  style={{
                    backgroundColor: theme.colors.primary,
                    marginTop: 20,
                  }}
                />
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* MODAL DE CONFIRMAÇÃO */}
      <Modal
        visible={modalConfirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalConfirmVisible(false)}
      >
        <View style={styles.modalOverlayConfirm}>
          <View style={styles.modalConfirmContainer}>
            <Text style={styles.modalConfirmTitle}>Confirmar exclusão</Text>
            <Text style={styles.modalConfirmText}>
              Tem certeza de que deseja excluir este serviço?
            </Text>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.cancel }]}
                onPress={() => setModalConfirmVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleExcluir}
              >
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
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
  listContainer: { paddingHorizontal: theme.spacing.large, paddingBottom: 100 },

  // Fundo modal padrão
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  // Fundo modal de confirmação mais claro
  modalOverlayConfirm: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)', // 👈 mais suave
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

  // Modal de confirmação
  modalConfirmContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    width: '100%',
    maxWidth: 340,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
  },
  modalConfirmTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 10,
  },
  modalConfirmText: {
    fontSize: 15,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: theme.colors.white,
    fontWeight: '700',
  },
});
