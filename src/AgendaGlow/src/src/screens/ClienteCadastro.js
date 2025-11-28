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
import { addCliente, updateCliente, getClienteById } from '../services/clienteService';

export default function ClienteCadastro() {
  const navigation = useNavigation();
  const route = useRoute();
  const idParam = route.params?.id;

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
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
        const res = await getClienteById(idParam);
        if (res.success) {
          const c = res.data;
          setNome(c.nome || '');
          setTelefone(c.telefone || '');
          setEmail(c.email || '');
          setObservacoes(c.observacoes || '');
          setEditingId(c.cid || c.id);
        } else {
          abrirModal(res.message || 'Não foi possível carregar o cliente.');
        }
        setLoading(false);
      }
    };
    load();
  }, [idParam]);

  const salvar = async () => {
    // Validação mínima
    if (!nome.trim()) return abrirModal('O nome é obrigatório.');
    if (!telefone.trim()) return abrirModal('O telefone é obrigatório.');

    setLoading(true);
    try {
      if (editingId) {
        const result = await updateCliente(editingId, {
          nome: nome.trim(),
          telefone: telefone.trim(),
          email: email.trim(),
          observacoes: observacoes.trim(),
        });

        if (result.success) {
          abrirModal('Cliente atualizado com sucesso!');
          setTimeout(() => navigation.navigate('Clientes'), 1000);
        } else {
          abrirModal(result.message || 'Falha ao atualizar cliente.');
        }
      } else {
        const result = await addCliente({
          nome: nome.trim(),
          telefone: telefone.trim(),
          email: email.trim(),
          observacoes: observacoes.trim(),
        });

        if (result.success) {
          abrirModal('Cliente cadastrado com sucesso!');
          setTimeout(() => navigation.navigate('Clientes'), 1000);
        } else {
          abrirModal(result.message || 'Falha ao salvar cliente.');
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
      <Header pageTitle={"CADASTRAR CLIENTE"}/>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Input value={nome} onChangeText={setNome} placeholder="Nome*" />
          <Input value={telefone} onChangeText={setTelefone} placeholder="Telefone*" keyboardType="phone-pad" />
          <Input value={email} onChangeText={setEmail} placeholder="Email (opcional)" keyboardType="email-address" />
          <TextArea value={observacoes} onChangeText={setObservacoes} placeholder="Observações (opcional)" />

          <View style={{ marginTop: 20 }}>
            <Button 
              title={editingId ? 'Salvar alterações' : 'Salvar cliente'} 
              onPress={salvar} 
              loading={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* MODAL ÚNICO */}
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
