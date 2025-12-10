// filepath: c:\Users\Melissa\Desktop\psg-ads-n-tiam-2025-2-tiam_grupo_1_salaodebeleza\src\AgendaGlow\src\screens\FuncionarioEditar.js
import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Text, Modal } from 'react-native'; 
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { theme } from '../styles/theme';
import { 
  deleteFuncionario, 
  updateFuncionarioPassword, 
  updateFuncionarioComAuth 
} from '../services/funcionarioService';
import { auth } from '../database/firebase';
import { AuthContext } from '../context/AuthContext';

export default function FuncionarioEditar({ navigation, route }) {

  const { user: userLogado } = useContext(AuthContext);

  const funcionario = route && route.params && route.params.funcionario ? route.params.funcionario : null;

  if (!funcionario) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Header userName="Usuário" />
        <Text style={{ color: theme.colors.text, fontSize: 16 }}>Nenhum funcionário selecionado para edição.</Text>
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

  const [modalVisible, setModalVisible] = useState(false);
  const [modalPasswordVisible, setModalPasswordVisible] = useState(false);

  const providerId = userLogado?.providerData[0]?.providerId || 'password';
  const isPasswordUser = providerId === 'password';
  const isEditingSelf = userLogado && userLogado.uid === funcionario.uid;

  // Função chamada ao tocar em "Salvar Dados" (abre modal se precisar confirmar senha)
  const handleSalvarPress = () => {
    setErrorSave(null);

    // Validação de campos obrigatórios e formato de e-mail
    if (!nome || !email) {
      setErrorSave('Nome e E-mail são obrigatórios.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setErrorSave('Por favor, insira um e-mail válido.');
      return;
    }

    if (isPasswordUser) {
      // Abre modal para solicitar senha de confirmação
      setModalVisible(true);
      return;
    }

    // Se não precisa de senha para confirmar, chama a função de edição diretamente
    handleEditar();
  };

  // --- Função Salvar Dados (executa atualização, espera senhaConfirmacao se aplicável) ---
  const handleEditar = async () => {
    setErrorSave(null);

    // Se for usuário com provider "password", exige senhaConfirmacao preenchida
    if (isPasswordUser && !senhaConfirmacao) {
      setErrorSave('Digite sua senha atual para confirmar as alterações.');
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
    setModalVisible(false);

    if (result.success) {
      alert('Sucesso: Dados atualizados com sucesso!');
      navigation.goBack(); 
    } else {
      setErrorSave(result.message || 'Falha ao atualizar dados.');
    }
  };

  // --- Função Alterar Senha ---
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
      alert('Sucesso: Senha alterada com sucesso!');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
      setModalPasswordVisible(false);
    } else {
      setErrorPassword(result.message || 'Ocorreu uma falha.');
    }
  };

  // --- Função Excluir Conta (A ser corrigida no servidor no futuro) ---
  const handleExcluir = async () => {
    setErrorDelete(null); 
    
    const deveExcluir = window.confirm(
      `Confirmar Exclusão: Tem certeza que deseja excluir ${funcionario.nome}? Esta ação é irreversível.`
    );
    
    if (deveExcluir) {
      setLoadingDelete(true);
      const result = await deleteFuncionario(funcionario.uid, funcionario.id); 
      setLoadingDelete(false);
      
      if (result.success) {
        alert('Sucesso: Funcionário excluído com sucesso.');
        if (isEditingSelf) { auth.signOut(); } 
        else { navigation.goBack(); }
      } else {
        setErrorDelete(result.message || 'Falha ao excluir funcionário.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Header userName={nome.split(' ')[0]} /> 
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Alterar meus dados</Text>
  
        <Input placeholder="Nome" value={nome} onChangeText={setNome} />
        <Input placeholder="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
        <Input placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        {/* REMOVIDO: campo inline de confirmação de senha.
            Agora a senha é solicitada dentro de um modal ao clicar em "Salvar Dados" */}
        
        {errorSave && (
          <Text style={styles.errorMessage}>{errorSave}</Text>
        )}
        
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
           <View style={{ marginTop: theme.spacing.large, width: '100%' }}>
              {errorDelete && (
                <Text style={styles.errorMessage}>{errorDelete}</Text>
              )}
              
              <Button
                title={loadingDelete ? 'Excluindo...' : 'Excluir Conta'}
                onPress={handleExcluir}
                style={styles.primary} 
                disabled={loadingSave || loadingDelete || loadingPassword}
              />
              <Text style={styles.deleteWarning}>Atenção: Excluir a conta é uma ação permanente.</Text>
              
          </View>
        )}

      </ScrollView>

      {/* Modal para solicitar senha de confirmação ao salvar (apenas para usuários com provider password) */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirme sua senha</Text>
            <Text style={{ color: theme.colors.text, fontSize: 13, marginBottom: 8 }}>
              Digite sua senha atual para confirmar as alterações.
            </Text>
            <Input
              placeholder="Senha Atual"
              value={senhaConfirmacao}
              onChangeText={setSenhaConfirmacao}
              secureTextEntry
            />

            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={() => {
                  setSenhaConfirmacao('');
                  setModalVisible(false);
                }}
                style={{ marginRight: 8, backgroundColor: theme.colors.container2 }}
                disabled={loadingSave}
              />
              <Button
                title={loadingSave ? 'Salvando...' : 'Confirmar'}
                onPress={handleEditar}
                disabled={loadingSave}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para alteração de senha */}
      <Modal
        visible={modalPasswordVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalPasswordVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Alterar Senha</Text>
            <Text style={{ color: theme.colors.text, fontSize: 13, marginBottom: 8 }}>
              Informe sua senha atual e a nova senha.
            </Text>

            <Input placeholder="Senha Atual" value={senhaAtual} onChangeText={setSenhaAtual} secureTextEntry />
            <Input placeholder="Nova Senha (mín. 6 caracteres)" value={novaSenha} onChangeText={setNovaSenha} secureTextEntry />
            <Input placeholder="Confirmar Nova Senha" value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry />

            {errorPassword && (
              <Text style={styles.errorMessage}>{errorPassword}</Text>
            )}

            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={() => {
                  setSenhaAtual('');
                  setNovaSenha('');
                  setConfirmarSenha('');
                  setErrorPassword(null);
                  setModalPasswordVisible(false);
                }}
                style={{ marginRight: 8, backgroundColor: theme.colors.container2 }}
                disabled={loadingPassword}
              />
              <Button
                title={loadingPassword ? 'Alterando...' : 'Confirmar'}
                onPress={handleAlterarSenha}
                disabled={loadingPassword}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.large },
  title: { fontSize: 20, fontWeight: '700', color: theme.colors.text, marginBottom: theme.spacing.medium },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.primary, marginTop: theme.spacing.large, marginBottom: theme.spacing.small, alignSelf: 'flex-start' },
  label: { fontSize: 14, color: theme.colors.text, fontWeight: '500', marginLeft: 4, marginTop: 8 },
  labelConfirm: { fontSize: 14, color: theme.colors.text, fontWeight: '700', marginLeft: 4, marginTop: 12 },
  
  errorMessage: {
    color: '#D9534F',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  inputDisabled: { 
    backgroundColor: theme.colors.container3 || '#FCEDED', 
    color: theme.colors.textInput 
  },
  saveButton: { marginTop: theme.spacing.medium },
  deleteButton: { 
    marginTop: theme.spacing.small, 
    backgroundColor: theme.colors.error || '#D9534F' 
  },
  deleteWarning: { 
    color: theme.colors.error || '#D9534F', 
    textAlign: 'center', 
    marginBottom: 8, 
    fontSize: 12 
  },

  /* Styles do modal */
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    padding: theme.spacing.large,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.small,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.medium,
  },
});