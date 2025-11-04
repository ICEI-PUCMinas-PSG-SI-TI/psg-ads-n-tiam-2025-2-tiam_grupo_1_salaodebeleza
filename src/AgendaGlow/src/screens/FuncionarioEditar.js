import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { theme } from '../styles/theme';
import { updateFuncionario, deleteFuncionario } from '../services/funcionarioService';
import { auth } from '../database/firebase';

export default function FuncionarioEditar({ navigation, route }) {
  
  const { funcionario } = route.params;

  const [nome, setNome] = useState(funcionario.nome);
  const [cargo, setCargo] = useState(funcionario.cargo);
  const [telefone, setTelefone] = useState(funcionario.telefone);
  const [email, setEmail] = useState(funcionario.email);
  
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleEditar = async () => {
    if (!nome || !telefone || !email) {
      Alert.alert('Atenção', 'Nome, E-mail e Telefone são obrigatórios.');
      return;
    }
    
    setLoadingSave(true);
    const dadosAtualizados = { 
      nome: nome, 
      telefone: telefone,
      email: email, 
    };
    
    const result = await updateFuncionario(funcionario.id, dadosAtualizados);
    setLoadingSave(false);

    if (result.success) {
      Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
      navigation.goBack(); 
    } else {
      Alert.alert('Erro', result.message || 'Falha ao atualizar dados.');
    }
  };


  const handleExcluir = async () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir ${funcionario.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive', 
          onPress: async () => {
            setLoadingDelete(true);
            const result = await deleteFuncionario(funcionario.uid, funcionario.id);
            setLoadingDelete(false);
            
            if (result.success) {
              Alert.alert('Sucesso', 'Funcionário excluído com sucesso.');
              if (auth.currentUser && auth.currentUser.uid === funcionario.uid) {
                auth.signOut(); 
              } else {
                navigation.goBack();
              }
            } else {
              Alert.alert('Erro', result.message || 'Falha ao excluir funcionário.');
            }
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header userName="Usuario" /> 
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Editar Dados</Text>

        <Text style={styles.label}>Nome Completo</Text>
        <Input placeholder="Nome completo" value={nome} onChangeText={setNome} />
        
        <Text style={styles.label}>E-mail</Text>
        <Input 
          placeholder="E-mail" value={email} onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Telefone</Text>
        <Input 
          placeholder="Telefone" value={telefone} onChangeText={setTelefone} 
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Cargo (não pode ser alterado)</Text>
        <Input 
          placeholder="Cargo" value={cargo} 
          editable={false} 
          style={styles.inputDisabled}
        />

        <Button
          title={loadingSave ? 'Salvando...' : 'Salvar Alterações'}
          onPress={handleEditar}
          style={styles.saveButton}
          disabled={loadingSave || loadingDelete}
        />
        
        <Button
          title={loadingDelete ? 'Excluindo...' : 'Excluir Conta'}
          onPress={handleExcluir}
          style={styles.deleteButton} 
          disabled={loadingSave || loadingDelete}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.large },
  title: { 
    fontSize: 20, fontWeight: '700', color: theme.colors.text, 
    marginBottom: theme.spacing.medium 
  },
  label: {
    fontSize: 14, color: theme.colors.text, fontWeight: '500',
    marginLeft: 4, marginTop: 8,
  },
  inputDisabled: {
    backgroundColor: theme.colors.container, 
    color: theme.colors.textInput,
  },
  selectContainer: { marginVertical: theme.spacing.small },
  inputLike: {
    backgroundColor: theme.colors.container3,
    borderRadius: theme.radius.medium,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: 10,
    borderColor: theme.colors.container3,
    marginVertical: theme.spacing.small,
    color: theme.colors.textInput,
    fontSize: 16,
    borderWidth: 1,
  },  
  saveButton: { marginTop: theme.spacing.large },
  deleteButton: {
    marginTop: theme.spacing.medium,
    backgroundColor: theme.colors.error, 
  },
});
