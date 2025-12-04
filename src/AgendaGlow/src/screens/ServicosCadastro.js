import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, KeyboardAvoidingView, Platform,
  Modal, ScrollView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import { theme } from '../styles/theme';
import { addServicos, updateServico, getServicoById } from '../services/servicoService';

export default function ServicoCadastro() {
  const navigation = useNavigation();
  const route = useRoute();
  const idParam = route.params?.id;

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Controle de Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMensagem, setModalMensagem] = useState('');

  const abrirModal = (mensagem) => {
    setModalMensagem(mensagem);
    setModalVisible(true);
  };

  const fecharModal = () => setModalVisible(false);

  useEffect(() => {
    const load = async () => {
      if (idParam) {
        setLoading(true);
        const res = await getServicoById(idParam);
        if (res.success) {
          const s = res.data;
          setNome(s.nome || '');
          setDescricao(s.descricao || '');
          setObservacoes(s.observacoes || '');
          setEditingId(s.sid || s.id);
        } else {
          abrirModal(res.message || 'Não foi possível carregar o serviço.');
        }
        setLoading(false);
      }
    };
    load();
  }, [idParam]);

  const salvar = async () => {
    if (!nome.trim()) return abrirModal('O nome é obrigatório.');
    if (!descricao.trim()) return abrirModal('A descrição é obrigatória.');

    setLoading(true);
    try {
      if (editingId) {
        const result = await updateServico(editingId, {
          nome: nome.trim(),
          descricao: descricao.trim(),
          observacoes: observacoes.trim(),
        });

        if (result.success) {
          abrirModal('Serviço atualizado com sucesso!');
          setTimeout(() => navigation.navigate('Servicos'), 1000);
        } else {
          abrirModal(result.message || 'Falha ao atualizar serviço.');
        }
      } else {
        const result = await addServicos({
          nome: nome.trim(),
          descricao: descricao.trim(),
          observacoes: observacoes.trim(),
        });

        if (result.success) {
          abrirModal('Serviço cadastrado com sucesso!');
          setTimeout(() => navigation.navigate('Servicos'), 1000);
        } else {
          abrirModal(result.message || 'Falha ao salvar serviço.');
        }
      }
    } catch (error) {
      abrirModal(error.message || 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header pageTitle={"CADASTRAR SERVIÇOS"} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Input value={nome} onChangeText={setNome} placeholder="Nome do serviço*" />
          <Input value={descricao} onChangeText={setDescricao} placeholder="Descrição*" />
          <TextArea value={observacoes} onChangeText={setObservacoes} placeholder="Observações (opcional)" />

          <View style={{ marginTop: 20 }}>
            <Button
              title={editingId ? 'Salvar alterações' : 'Salvar serviço'}
              onPress={salvar}
              loading={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* MODAL DE CONFIRMAÇÃO */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>{modalMensagem}</Text>
            <Button title="OK" onPress={fecharModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
});
