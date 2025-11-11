import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Text, Modal, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { theme } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import {
  deleteFuncionario,
  updateFuncionarioPassword,
  updateFuncionarioComAuth,
} from '../services/funcionarioService';
import { auth } from '../database/firebase';
import { AuthContext } from '../context/AuthContext';

export default function FuncionarioEditar({ navigation, route }) {
  const { user: userLogado } = useContext(AuthContext);
  const funcionario = route?.params?.funcionario || null;

  if (!funcionario) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Header userName="Usuário" />
        <Text style={{ color: theme.colors.text, fontSize: 16 }}>
          Nenhum profissional selecionado para edição.
        </Text>
        <Button title="Voltar" onPress={() => navigation.goBack()} style={{ marginTop: 16 }} />
      </View>
    );
  }

  const [nome, setNome] = useState(funcionario.nome || '');
  const [telefone, setTelefone] = useState(funcionario.telefone || '');
  const [email, setEmail] = useState(funcionario.email || '');
  const [senhaConfirmacao, setSenhaConfirmacao] = useState('');

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const [errorSave, setErrorSave] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);
  const [errorDelete, setErrorDelete] = useState(null);
  const [errorSenhaModal, setErrorSenhaModal] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalPasswordVisible, setModalPasswordVisible] = useState(false);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);

  // Modal de feedback padrão
  const [modalFeedbackVisible, setModalFeedbackVisible] = useState(false);
  const [modalFeedbackTitle, setModalFeedbackTitle] = useState('');
  const [modalFeedbackMessage, setModalFeedbackMessage] = useState('');
  const [modalFeedbackType, setModalFeedbackType] = useState('success'); 

  const providerId = userLogado?.providerData[0]?.providerId || 'password';
  const isPasswordUser = providerId === 'password';
  const isEditingSelf = userLogado && userLogado.uid === funcionario.uid;

  const showFeedbackModal = (title, message, type = 'success') => {
    setModalFeedbackTitle(title);
    setModalFeedbackMessage(message);
    setModalFeedbackType(type);
    setModalFeedbackVisible(true);
  };

  const closeFeedbackModal = () => {
    setModalFeedbackVisible(false);
    if (modalFeedbackType === 'success') navigation.goBack();
  };

  // --- Salvar Dados ---
  const handleSalvarPress = () => {
    setErrorSave(null);
    if (!nome || !email || !telefone ) {
      setErrorSave('Preencha os campos obrigatórios.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setErrorSave('Por favor, insira um e-mail válido.');
      return;
    }

    if (isPasswordUser) setModalVisible(true);
    else handleEditar();
  };

  const handleEditar = async () => {
    setErrorSenhaModal(null);

    if (isPasswordUser && !senhaConfirmacao) {
      setErrorSenhaModal('Digite sua senha atual para confirmar.');
      return;
    }

    setLoadingSave(true);
    const dadosAtualizados = { nome, telefone, email: email.toLowerCase() };
    const result = await updateFuncionarioComAuth(
      funcionario.id,
      dadosAtualizados,
      isPasswordUser ? senhaConfirmacao : null
    );
    setLoadingSave(false);
    setSenhaConfirmacao('');

    if (result.success) {
    setModalVisible(false);
    showFeedbackModal('Sucesso', 'Dados atualizados com sucesso!', 'success');
  } else {
    showFeedbackModal('Erro', result.message || 'Falha ao atualizar dados.', 'error');
  }
};

  // --- Alterar Senha ---
  const handleAlterarSenha = async () => {
    setErrorPassword(null);
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setErrorPassword('Preencha todos os campos de senha.');
      return;
    }
    if (novaSenha.length < 6) {
      setErrorPassword('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setErrorPassword('A "Nova Senha" e a "Confirmação" não conferem.');
      return;
    }

    setLoadingPassword(true);
    const result = await updateFuncionarioPassword(senhaAtual, novaSenha);
    setLoadingPassword(false);

    if (result.success) {
      showFeedbackModal('Sucesso', 'Senha alterada com sucesso!', 'success');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
      setModalPasswordVisible(false);
    } else {
      showFeedbackModal('Erro', result.message || 'Falha ao alterar senha.', 'error');
    }
  };

  // --- Excluir Conta (soft delete) ---
  const handleExcluirConfirmado = async () => {
    setModalConfirmVisible(false);
    setErrorDelete(null);
    setLoadingDelete(true);

    const result = await deleteFuncionario(funcionario.uid, funcionario.id);
    setLoadingDelete(false);

    if (result.success) {
      showFeedbackModal('Sucesso', 'Conta excluída com sucesso.', 'success');
      if (isEditingSelf) auth.signOut();
    } else {
      showFeedbackModal('Erro', result.message || 'Falha ao excluir conta.', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <Header userName={nome.split(' ')[0]} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Alterar meus dados</Text>

        <Input placeholder="Nome" value={nome} onChangeText={setNome} />
        <Input
          placeholder="Telefone"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />
        <Input
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {errorSave && <Text style={styles.errorMessage}>{errorSave}</Text>}

        <Button
          title={loadingSave ? 'Salvando...' : 'Salvar Dados'}
          onPress={handleSalvarPress}
          style={styles.saveButton}
          disabled={loadingSave || loadingDelete || loadingPassword}
        />

        {isEditingSelf && isPasswordUser && (
          <>
            <Text style={styles.sectionTitle}>Outras Opções</Text>
            <Button
              title="Alterar Senha"
              onPress={() => {
                setErrorPassword(null);
                setModalPasswordVisible(true);
              }}
              style={styles.saveButton}
              disabled={loadingSave || loadingDelete || loadingPassword}
            />
          </>
        )}

        {isEditingSelf && (
          <View style={{ width: '100%' }}>
            {errorDelete && <Text style={styles.errorMessage}>{errorDelete}</Text>}

            <Button
              title={loadingDelete ? 'Excluindo...' : 'Excluir Conta'}
              onPress={() => setModalConfirmVisible(true)}
              style={styles.saveButton}
              disabled={loadingSave || loadingDelete || loadingPassword}
            />
            <Text style={styles.deleteWarning}>
              Atenção: Excluir a conta é uma ação permanente.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* --- Modal de confirmação de exclusão --- */}
      <Modal
        visible={modalConfirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalConfirmVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
              <TouchableOpacity onPress={() => setModalConfirmVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalMessage}>
              Tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita.
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
              <Button
                title="Cancelar"
                onPress={() => setModalConfirmVisible(false)}
                style={{ backgroundColor: theme.colors.cancel }}
              />
              <Button
                title={loadingDelete ? 'Excluindo...' : 'Confirmar'}
                onPress={handleExcluirConfirmado}
                disabled={loadingDelete}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de senha para salvar */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirme sua senha</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalMessage}>Digite sua senha atual para confirmar.</Text>
            <Input
              placeholder="Senha Atual"
              value={senhaConfirmacao}
              onChangeText={setSenhaConfirmacao}
              secureTextEntry
            />

            {/* Exibe mensagem de erro dentro do modal */}
            {errorSenhaModal && (
              <Text style={styles.errorMessage}>{errorSenhaModal}</Text>
            )}

            <View style={styles.modalButtons}>
              <Button
                title={loadingSave ? 'Salvando...' : 'Confirmar'}
                onPress={handleEditar}
                disabled={loadingSave}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de senha para alteração */}
      <Modal visible={modalPasswordVisible} transparent animationType="fade" onRequestClose={() => setModalPasswordVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Alterar Senha</Text>
              <TouchableOpacity onPress={() => setModalPasswordVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <Input placeholder="Senha Atual" value={senhaAtual} onChangeText={setSenhaAtual} secureTextEntry />
            <Input placeholder="Nova Senha (mín. 6 caracteres)" value={novaSenha} onChangeText={setNovaSenha} secureTextEntry />
            <Input placeholder="Confirmar Nova Senha" value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry />
            {errorPassword && <Text style={styles.errorMessage}>{errorPassword}</Text>}
            <View style={styles.modalButtons}>
              <Button
                title={loadingPassword ? 'Alterando...' : 'Confirmar'}
                onPress={handleAlterarSenha}
                disabled={loadingPassword}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de feedback padrão */}
      <Modal visible={modalFeedbackVisible} transparent animationType="fade" onRequestClose={closeFeedbackModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{modalFeedbackTitle}</Text>
              <TouchableOpacity onPress={closeFeedbackModal}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalMessage}>{modalFeedbackMessage}</Text>
            <View style={styles.modalButtons}>
              <Button title="OK" onPress={closeFeedbackModal} />
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
  sectionTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.primary, marginTop: theme.spacing.large, marginBottom: theme.spacing.small },
  errorMessage: { color: theme.colors.primary, fontSize: 14, fontWeight: '600', textAlign: 'center', marginTop: 8 },
  deleteWarning: { color: theme.colors.textSecondary || '#777', textAlign: 'center', fontSize: 12, marginTop: 6 },

  // Modal padrão
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  modalContainer: { backgroundColor: theme.colors.white, borderRadius: 16, width: '100%', maxWidth: 400, padding: 20, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
  modalMessage: { fontSize: 16, color: theme.colors.text, marginBottom: 20 },
  modalButtons: { alignItems: 'flex-end' },
});
