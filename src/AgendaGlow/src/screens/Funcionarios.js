import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, 
  ActivityIndicator, Alert 
} from 'react-native';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { theme } from '../styles/theme';
import { listenFuncionarios, deleteFuncionario } from '../services/funcionarioService'; // ✅ import atualizado
import { Ionicons } from '@expo/vector-icons';

export default function Funcionarios({ navigation }) {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalViewVisible, setModalViewVisible] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);

  useEffect(() => {
    const unsubscribe = listenFuncionarios((lista) => {
      setFuncionarios(lista);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const abrirModalView = (funcionario) => {
    setFuncionarioSelecionado(funcionario);
    setModalViewVisible(true);
  };

  const fecharModalView = () => {
    setFuncionarioSelecionado(null);
    setModalViewVisible(false);
  };

  // ✅ Função para excluir funcionário com confirmação
  const handleExcluir = async () => {
    if (!funcionarioSelecionado) return;

    Alert.alert(
      'Excluir funcionário',
      `Tem certeza que deseja excluir ${funcionarioSelecionado.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const result = await deleteFuncionario(
                funcionarioSelecionado.uid,
                funcionarioSelecionado.id
              );

              if (result.success) {
                Alert.alert('Sucesso', 'Funcionário excluído com sucesso!');
                setFuncionarios((prev) =>
                  prev.filter((f) => f.id !== funcionarioSelecionado.id)
                );
                fecharModalView();
              } else {
                Alert.alert('Erro', result.message || 'Falha ao excluir funcionário.');
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
        <Text style={styles.title}>Equipe</Text>
        <Button title="Adicionar +" small onPress={() => navigation.navigate('FuncionarioCadastro')} />
      </View>

      {/* Lista */}
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.listContainer}>
          {funcionarios.length === 0 ? (
            <Text style={{ textAlign: 'center', color: theme.colors.textInput }}>
              Nenhum funcionário cadastrado.
            </Text>
          ) : (
            funcionarios.map((f) => (
              <Card
                key={f.id}
                title={f.nome}
                subtitle={f.cargo}
                onView={() => abrirModalView(f)}
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
              <Text style={styles.modalTitle}>Detalhes do Funcionário</Text>
              <TouchableOpacity onPress={fecharModalView}>
                <Ionicons name="close" size={26} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {funcionarioSelecionado && (
              <View style={styles.modalContent}>
                <Text style={styles.info}><Text style={styles.label}>Nome:</Text> {funcionarioSelecionado.nome}</Text>
                <Text style={styles.info}><Text style={styles.label}>Cargo:</Text> {funcionarioSelecionado.cargo}</Text>
                <Text style={styles.info}><Text style={styles.label}>Telefone:</Text> {funcionarioSelecionado.telefone}</Text>
                <Text style={styles.info}><Text style={styles.label}>E-mail:</Text> {funcionarioSelecionado.email}</Text>

                {/* ✅ Botão de excluir dentro do modal */}
                <Button
                  title="Excluir Funcionário"
                  onPress={handleExcluir}
                  style={{
                    backgroundColor: theme.colors.primary || '#FF4C4C',
                    marginTop: 20,
                  }}
                />
                {/* Botão para abrir tela de edição */}
                <Button
                  title="Editar Funcionário"
                  onPress={() => {
                    fecharModalView();
                    navigation.navigate('FuncionarioEditar', { funcionario: funcionarioSelecionado });
                  }}
                  style={{
                    marginTop: 12,
                    backgroundColor: theme.colors.secondary || '#4C8CFF',
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
