import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { theme } from '../styles/theme';
import { listenFuncionarios } from '../services/funcionarioService';
import { Ionicons } from '@expo/vector-icons';

export default function Funcionarios({ navigation }) {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);

  useEffect(() => {
    const unsubscribe = listenFuncionarios((lista) => {
      setFuncionarios(lista);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const abrirModal = (funcionario) => {
    setFuncionarioSelecionado(funcionario);
    setModalVisible(true);
  };

  const fecharModal = () => {
    setFuncionarioSelecionado(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Header userName="Melissa" />

      <View style={styles.headerRow}>
        <Text style={styles.title}>Equipe</Text>
        <Button title="Adicionar +" small onPress={() => navigation.navigate('FuncionarioCadastro')} />
      </View>

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
                onView={() => abrirModal(f)}
                onEdit={() => navigation.navigate('FuncionariosEditar', { funcionario: f })}
              />
            ))
          )}
        </ScrollView>
      )}

      {/* --- MODAL DE VISUALIZAÇÃO --- */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={fecharModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalhes do Funcionário</Text>
              <TouchableOpacity onPress={fecharModal}>
                <Ionicons name="close" size={26} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {funcionarioSelecionado && (
              <View style={styles.modalContent}>
                <Text style={styles.info}><Text style={styles.label}>Nome:</Text> {funcionarioSelecionado.nome}</Text>
                <Text style={styles.info}><Text style={styles.label}>Cargo:</Text> {funcionarioSelecionado.cargo}</Text>
                <Text style={styles.info}><Text style={styles.label}>Telefone:</Text> {funcionarioSelecionado.telefone}</Text>
                <Text style={styles.info}><Text style={styles.label}>E-mail:</Text> {funcionarioSelecionado.email}</Text>
              </View>
            )}
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

  // --- Modal ---
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
