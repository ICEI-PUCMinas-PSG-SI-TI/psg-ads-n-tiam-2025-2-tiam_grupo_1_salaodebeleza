import { useNavigation } from '@react-navigation/native'; // 👈 importa o hook
import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, 
  ActivityIndicator, Alert 
} from 'react-native';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { theme } from '../styles/theme';
import { listenClientes, deleteCliente } from '../services/clienteService'; // ✅ import atualizado
import { Ionicons } from '@expo/vector-icons';

export default function Clientes() {
   const navigation = useNavigation();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalViewVisible, setModalViewVisible] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

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
    setClienteSelecionado(null);
    setModalViewVisible(false);
  };

  // ✅ Função para excluir cliente com confirmação
  const handleExcluir = async () => {
    if (!clienteSelecionado) return;

    Alert.alert(
      'Excluir cliente',
      `Tem certeza que deseja excluir ${clienteSelecionado.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const result = await deleteCliente(
                clienteSelecionado.sid,
                clienteSelecionado.id
              );

              if (result.success) {
                Alert.alert('Sucesso', 'Cliente excluído com sucesso!');
                setClientes((prev) =>
                  prev.filter((f) => f.id !== clienteSelecionado.id)
                );
                fecharModalView();
              } else {
                Alert.alert('Erro', result.message || 'Falha ao excluir serviço.');
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
        <Text style={styles.title}>Clientes</Text>
        <Button title="Adicionar" small onPress={() => navigation.navigate('ClienteCadastro')} />
      </View>

      {/* Lista */}
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.listContainer}>
          {clientes.length === 0 ? (
            <Text style={{ textAlign: 'center', color: theme.colors.textInput }}>
              Nenhum cliente cadastrado.
            </Text>
          ) : (
            clientes.map((s) => (
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
        animationType="none"
        transparent={true}
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

            {clienteSelecionado && (
              <View style={styles.modalContent}>
                <Text style={styles.info}><Text style={styles.label}>Nome:</Text> {clienteSelecionado.nome}</Text>
                <Text style={styles.info}><Text style={styles.label}>Descrição:</Text> {clienteSelecionado.descricao}</Text>
                <Text style={styles.info}><Text style={styles.label}>Observações:</Text> {clienteSelecionado.observacoes}</Text>

                {/* ✅ Botão de excluir dentro do modal */}
                <Button
                  title="Excluir Cliente"
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
