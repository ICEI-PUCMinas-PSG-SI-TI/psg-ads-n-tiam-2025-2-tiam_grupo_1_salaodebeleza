import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Modal, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { theme } from '../styles/theme';
import { addFuncionario } from '../services/funcionarioService';
import { Ionicons } from '@expo/vector-icons';

export default function FuncionarioCadastro({ navigation }) {
  
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState('success'); // success | error

  const handleSalvar = async () => {
    if (!nome || !cargo || !telefone || !email) {
      setModalTitle('Atenção');
      setModalMessage('Preencha todos os campos antes de salvar.');
      setModalType('error');
      setModalVisible(true);
      return;
    }

    setLoading(true);
    const result = await addFuncionario({ nome, cargo, telefone, email });
    setLoading(false);

    if (result.success) {
      setModalTitle('Sucesso');
      setModalMessage('Profissional cadastrado com sucesso!');
      setModalType('success');
    } else {
      setModalTitle('Erro');
      setModalMessage(result.message || 'Falha ao cadastrar profissional.');
      setModalType('error');
    }
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    if (modalType === 'success') {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Header userName={nome.split(' ')[0]} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Cadastrar Profissional</Text>

        <Input placeholder="Nome*" value={nome} onChangeText={setNome} />
        <View>
          <Picker
            selectedValue={cargo}
            onValueChange={setCargo}
            style={styles.inputLike}
            dropdownIconColor={theme.colors.textInput}
          >
            <Picker.Item label="Cargo*" value="" color={theme.colors.textInput} />
            <Picker.Item label="Gestor" value="Gestor" />
            <Picker.Item label="Funcionário" value="Funcionário" />
          </Picker>
        </View>
        <Input placeholder="Telefone*" value={telefone} onChangeText={setTelefone} />
        <Input placeholder="E-mail*" value={email} onChangeText={setEmail} />

        <Text style={styles.senhaInfo}>
          A senha padrão do usuário será <Text style={styles.bold}>agendaglow12345</Text>.{"\n"}
          Ele poderá alterá-la mais tarde.
        </Text>

        <Button
          title={loading ? 'Salvando...' : 'Salvar'}
          onPress={handleSalvar}
          style={styles.saveButton}
          disabled={loading}
        />
      </ScrollView>

      {/* MODAL PADRÃO */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={fecharModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{modalTitle}</Text>
              <TouchableOpacity onPress={fecharModal}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <View style={styles.modalButtons}>
              <Button
                title="OK"
                onPress={fecharModal}
                style={{ backgroundColor: theme.colors.primary }}
              />
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
  content: { padding: theme.spacing.large },
  title: { fontSize: 20, fontWeight: '700', color: theme.colors.text, marginBottom: theme.spacing.medium },
  inputLike: {
    backgroundColor: theme.colors.container3,
    borderRadius: theme.radius.medium,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: 10,
    marginVertical: theme.spacing.small,
    color: theme.colors.textInput,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.colors.container3,
  },
  senhaInfo: {
    color: theme.colors.textSecondary || '#777',
    fontSize: 14,
    marginTop: theme.spacing.medium,
  },
  bold: { fontWeight: '700', color: theme.colors.text },
  saveButton: { marginTop: theme.spacing.large },

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
  modalMessage: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 20,
  },
  modalButtons: {
    alignItems: 'flex-end',
  },
});
