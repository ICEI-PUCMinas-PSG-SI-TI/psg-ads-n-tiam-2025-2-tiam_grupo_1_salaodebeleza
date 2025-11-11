import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { theme } from '../styles/theme';
import { listenClientes, deleteCliente } from '../services/clienteService';

export default function Clientes() {
  const navigation = useNavigation();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalViewVisible, setModalViewVisible] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  // Modais genéricos (mensagem e confirmação)
  const [modalMensagem, setModalMensagem] = useState('');
  const [modalMensagemVisible, setModalMensagemVisible] = useState(false);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);

  const abrirModalMensagem = (msg) => {
    setModalMensagem(msg);
    setModalMensagemVisible(true);
  };
  const fecharModalMensagem = () => setModalMensagemVisible(false);

  useEffect(() => {
    const unsubscribe = listenClientes((lista) => {
      setClientes(lista);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const abrirModalView = (cliente) => {
    setClienteSelecionado(cliente);
    setModalViewVisible(true);
  };

  const fecharModalView = () => {
    setModalViewVisible(false);
  };

  const handleExcluir = async () => {
    if (!clienteSelecionado?.cid) {
      abrirModalMensagem('ID do cliente não encontrado.');
      return;
    }

    fecharModalView();

    setTimeout(() => {
      setModalConfirmVisible(true);
    }, 100);
  };

  const confirmarExclusao = async () => {
    setModalConfirmVisible(false);
    setExcluindo(true);

    try {
      const result = await deleteCliente(clienteSelecionado.cid);

      if (result.success) {
        setClientes((prev) => prev.filter((c) => c.cid !== clienteSelecionado.cid));
        setClienteSelecionado(null);
        abrirModalMensagem('Cliente excluído com sucesso.');
      } else {
        abrirModalMensagem(result.message || 'Falha ao excluir cliente.');
      }
    } catch (error) {
      abrirModalMensagem(error.message || 'Erro inesperado ao excluir cliente.');
    } finally {
      setExcluindo(false);
    }
  };

  const handleEditar = () => {
    if (clienteSelecionado) {
      fecharModalView();
      navigation.navigate('ClienteCadastro', { id: clienteSelecionado.cid });
    }
  };

  return (
    <View style={styles.container}>
      <Header userName="Usuário" />

      <View style={styles.headerRow}>
        <Text style={styles.title}>Clientes</Text>
        <Button
          title="Adicionar +"
          small
          onPress={() => navigation.navigate('ClienteCadastro')}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.listContainer}>
          {clientes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum cliente cadastrado.</Text>
            </View>
          ) : (
            clientes.map((c) => (
              <Card
                key={c.id}
                title={c.nome}
                subtitle={c.telefone || c.email || ''}
                onView={() => abrirModalView(c)}
              />
            ))
          )}
        </ScrollView>
      )}

      {/* MODAL DE DETALHES */}
      <Modal
        visible={modalViewVisible}
        transparent
        animationType="fade"
        onRequestClose={fecharModalView}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalhes do Cliente</Text>
              <TouchableOpacity onPress={fecharModalView}>
                <Ionicons name="close" size={26} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {clienteSelecionado ? (
              <View style={styles.modalContent}>
                <View style={styles.infoContainer}>
                  <Text style={styles.label}>Nome:</Text>
                  <Text style={styles.value}>{clienteSelecionado.nome || '-'}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.label}>Telefone:</Text>
                  <Text style={styles.value}>{clienteSelecionado.telefone || '-'}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.label}>E-mail:</Text>
                  <Text style={styles.value}>{clienteSelecionado.email || '-'}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.label}>Observações:</Text>
                  <Text style={styles.value}>{clienteSelecionado.observacoes || '-'}</Text>
                </View>

                <View style={styles.modalActions}>
                  <Button title="Editar dados do Cliente" onPress={handleEditar} style={styles.editButton} />
                  <Button
                    title={excluindo ? "Excluindo..." : "Excluir Cliente"}
                    onPress={handleExcluir}
                    disabled={excluindo}
                    style={[
                      styles.primary,
                      { marginTop: 0 },
                      excluindo && styles.disabledButton,
                    ]}
                  />
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </Modal>

      {/* --- MODAL DE CONFIRMAÇÃO */}
      <Modal
        visible={modalConfirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalConfirmVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
            <Text style={{ color: theme.colors.text, fontSize: 14, marginBottom: 16 }}>
              Tem certeza que deseja excluir {clienteSelecionado?.nome}? Essa ação é irreversível.
            </Text>

            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={() => setModalConfirmVisible(false)}
                style={{ marginRight: 8, backgroundColor: theme.colors.cancel }}
              />
              <Button
                title="Confirmar"
                onPress={confirmarExclusao}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL DE MENSAGEM */}
      <Modal visible={modalMensagemVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>{modalMensagem}</Text>
            <Button title="OK" onPress={fecharModalMensagem} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

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
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textInput,
    fontSize: 16,
  },
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
  modalTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
  modalContent: { marginTop: 10 },
  infoContainer: { marginBottom: 12 },
  label: { fontWeight: '700', color: theme.colors.primary, fontSize: 14 },
  value: { fontSize: 16, color: theme.colors.text, lineHeight: 20 },
  modalActions: { marginTop: 20, gap: 10 },
  editButton: { backgroundColor: theme.colors.primary },
  deleteButton: { backgroundColor: '#FF4C4C' },
  disabledButton: { backgroundColor: '#ccc' },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.medium,
  },
});
