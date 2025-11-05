import React, { useState, useContext } from 'react';
// Removi o 'Alert' pois não vamos usá-lo para erros
import { View, StyleSheet, ScrollView, Text } from 'react-native'; 
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { theme } from '../styles/theme';
import { 
  deleteFuncionario, 
  updateFuncionarioPassword, 
  // 1. Importa a função de salvar segura
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
  // 2. Campo de senha para confirmar a EDIÇÃO DE DADOS
  const [senhaConfirmacao, setSenhaConfirmacao] = useState('');

  // Campos da seção "Alterar Senha"
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  // 3. Estados para as mensagens de erro (para mostrar na tela)
  const [errorSave, setErrorSave] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);
  const [errorDelete, setErrorDelete] = useState(null);

  // Verifica se o utilizador fez login com e-mail/senha
  const providerId = userLogado?.providerData[0]?.providerId || 'password';
  const isPasswordUser = providerId === 'password';

  // Verifica se o utilizador está a editar o próprio perfil
  const isEditingSelf = userLogado && userLogado.uid === funcionario.uid;

  // --- Função Salvar Dados ---
  const handleEditar = async () => {
    setErrorSave(null); // Limpa erros antigos
    
    // 4. VERIFICAÇÕES (Nome, E-mail, Senha)
    if (!nome || !email) {
      setErrorSave('Nome e E-mail são obrigatórios.');
      return;
    }
    // 5. CONFERE SE É UM EMAIL VÁLIDO
    if (!email.includes('@') || !email.includes('.')) {
      setErrorSave('Por favor, insira um e-mail válido.');
      return;
    }
    // 6. PEDE SENHA PRA EDITAR OS DADOS
    if (isPasswordUser && !senhaConfirmacao) {
      setErrorSave('Digite sua senha atual para confirmar as alterações.');
      return;
    }
    
    setLoadingSave(true);
    const dadosAtualizados = { nome, telefone, email: email.toLowerCase() };
    
    // 7. CHAMA A FUNÇÃO SEGURA
    const result = await updateFuncionarioComAuth(
      funcionario.id, 
      dadosAtualizados, 
      isPasswordUser ? senhaConfirmacao : null
    );
    
    setLoadingSave(false);
    setSenhaConfirmacao(''); 

    // 8. ENVIA AVISO
    if (result.success) {
      alert('Sucesso: Dados atualizados com sucesso!'); // alert() funciona na web
      navigation.goBack(); 
    } else {
      // (ex: "Senha atual incorreta", "E-mail já em uso")
      setErrorSave(result.message || 'Falha ao atualizar dados.');
    }
  };

  // --- Função Alterar Senha ---
  const handleAlterarSenha = async () => {
    setErrorPassword(null); // Limpa erros antigos
    
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
    } else {
      // 9. ENVIA AVISO DE SENHA INVÁLIDA
      setErrorPassword(result.message || 'Ocorreu uma falha.');
    }
  };

  // --- Função Excluir Conta ---
  const handleExcluir = async () => {
    setErrorDelete(null); 
    
    const deveExcluir = window.confirm(
      `Confirmar Exclusão: Tem certeza que deseja excluir ${funcionario.nome}? Esta ação é irreversível.`
    );
    
    if (deveExcluir) {
      setLoadingDelete(true);
      // Nota: Esta função precisa do 'firebase deploy' (do 'functions/index.js') para funcionar
      const result = await deleteFuncionario(funcionario.uid, funcionario.id); 
      setLoadingDelete(false);
      
      if (result.success) {
        alert('Sucesso: Funcionário excluído com sucesso.');
        if (isEditingSelf) { auth.signOut(); } 
        else { navigation.goBack(); }
      } else {
        // Mostra o erro "internal" / "CORS" se o deploy não foi feito
        setErrorDelete(result.message || 'Falha ao excluir funcionário.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Header userName={nome.split(' ')[0]} /> 
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Editar Dados</Text>
        
        <Text style={styles.sectionTitle}>Dados de Perfil</Text>
        <Text style={styles.label}>Nome Completo</Text>
        <Input placeholder="Nome completo" value={nome} onChangeText={setNome} />
        <Text style={styles.label}>Telefone</Text>
        <Input placeholder="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
        <Text style={styles.label}>E-mail</Text>
        <Input placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        
        {/* 10. CAMPO DE CARGO REMOVIDO */}

        {/* 11. CAMPO DE SENHA PARA EDITAR DADOS */}
        {isPasswordUser && (
          <>
            <Text style={styles.labelConfirm}>Senha Atual (para confirmar alterações)</Text>
            <Input placeholder="Digite sua senha atual" value={senhaConfirmacao} onChangeText={setSenhaConfirmacao} secureTextEntry />
          </>
        )}

        {/* 12. ÁREA DE MENSAGEM DE ERRO (para Salvar Dados) */}
        {errorSave && (
          <Text style={styles.errorMessage}>{errorSave}</Text>
        )}
        
        <Button
          title={loadingSave ? 'Salvando...' : 'Salvar Dados'}
          onPress={handleEditar}
          style={styles.saveButton}
          disabled={loadingSave || loadingDelete || loadingPassword}
        />
        
        {isEditingSelf && isPasswordUser && (
          <>
            <Text style={styles.sectionTitle}>Alterar Senha</Text>
            <Input placeholder="Senha Atual" value={senhaAtual} onChangeText={setSenhaAtual} secureTextEntry />
            <Input placeholder="Nova Senha (mín. 6 caracteres)" value={novaSenha} onChangeText={setNovaSenha} secureTextEntry />
            <Input placeholder="Confirmar Nova Senha" value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry />
            
            {/* 13. ÁREA DE MENSAGEM DE ERRO (para Alterar Senha) */}
            {errorPassword && (
              <Text style={styles.errorMessage}>{errorPassword}</Text>
            )}
            
            <Button
              title={loadingPassword ? 'Alterando...' : 'Alterar Senha'}
              onPress={handleAlterarSenha}
              style={styles.saveButton}
              disabled={loadingSave || loadingDelete || loadingPassword}
            />
          </>
        )}
        
        {isEditingSelf && (
           <View style={{ marginTop: theme.spacing.large, width: '100%' }}>
              <Text style={styles.deleteWarning}>Atenção: Excluir a conta é uma ação permanente.</Text>
              
              {/* 14. ÁREA DE MENSAGEM DE ERRO (para Excluir Conta) */}
              {errorDelete && (
                <Text style={styles.errorMessage}>{errorDelete}</Text>
              )}
              
              <Button
                title={loadingDelete ? 'Excluindo...' : 'Excluir Conta'}
                onPress={handleExcluir}
                style={styles.deleteButton} 
                disabled={loadingSave || loadingDelete || loadingPassword}
              />
          </View>
        )}

      </ScrollView>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.large },
  title: { fontSize: 20, fontWeight: '700', color: theme.colors.text, marginBottom: theme.spacing.medium },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.primary, marginTop: theme.spacing.large, marginBottom: theme.spacing.small, alignSelf: 'flex-start' },
  label: { fontSize: 14, color: theme.colors.text, fontWeight: '500', marginLeft: 4, marginTop: 8 },
  labelConfirm: { fontSize: 14, color: theme.colors.text, fontWeight: '700', marginLeft: 4, marginTop: 12 },
  
  // 15. ESTILO PARA A MENSAGEM DE ERRO
  errorMessage: {
    color: '#D9534F', // Vermelho
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },

  // (Estilo 'inputDisabled' mantido para referência, embora não seja usado agora)
  inputDisabled: { 
    backgroundColor: theme.colors.container3 || '#FCEDED', 
    color: theme.colors.textInput 
  },
  saveButton: { marginTop: theme.spacing.medium },
  deleteButton: { 
    marginTop: theme.spacing.small, 
    // Cor de erro do seu tema
    backgroundColor: theme.colors.error || '#D9534F' 
  },
  deleteWarning: { 
    color: theme.colors.error || '#D9534F', 
    textAlign: 'center', 
    marginBottom: 8, 
    fontSize: 12 
  }
});