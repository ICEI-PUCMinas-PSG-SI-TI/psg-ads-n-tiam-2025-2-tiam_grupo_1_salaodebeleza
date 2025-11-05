import React, { useContext, useState } from 'react';
// A linha 'import' corrigida (com o 'from' e o 'Alert')
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native'; 
import Header from '../components/Header';
import Button from '../components/Button';
import { theme } from '../styles/theme';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { getFuncionarioByUid } from '../services/funcionarioService';
import { logout } from '../services/loginService'; // Importar logout

export default function Mais() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext); 
  const [loadingMeusDados, setLoadingMeusDados] = useState(false);

  // Função nova e corrigida para "Alterar meus dados"
  const handleMeusDados = async () => {
    if (!user) {
      // Lida com sessão expirada
      Alert.alert(
        'Sessão expirada',
        'Sua sessão expirou. Por favor, faça o login novamente.',
        [
          { text: 'OK', onPress: () => logout() }
        ]
      );
      return;
    }

    setLoadingMeusDados(true);
    // Busca os dados do funcionário no Firestore
    const result = await getFuncionarioByUid(user.uid);
    setLoadingMeusDados(false);

    if (result.success) {
      // Envia os dados para a tela de edição
      navigation.navigate('FuncionarioEditar', { funcionario: result.data });
    } else {
      // Mostra o erro (ex: "Dados não encontrados")
      Alert.alert('Erro', result.message || 'Não foi possível buscar seus dados.');
    }
  };
  
  return (
    <View style={styles.container}>
      <Header userName="Usuario" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Mais</Text>

        {/* --- TODOS OS 5 BOTÕES ORIGINAIS --- */}
        <Button
          title="Serviços"
          onPress={() => navigation.navigate('Servicos')}
          style={{ width: '100%' }}
        />
        <Button
          title="Relatórios"
          onPress={() => navigation.navigate('Relatorios')}
          style={{ width: '100%' }}
        />
        <Button
          title="Equipe"
          onPress={() => navigation.navigate('Funcionarios')}
          style={{ width: '100%' }}
        />
        <Button
          title={loadingMeusDados ? 'Carregando...' : 'Alterar meus dados'}
          // Usa a nova função corrigida
          onPress={handleMeusDados} 
          style={{ width: '100%' }}
          disabled={loadingMeusDados}
        />
        <Button
          title="Vincular conta Google"
          onPress={() => navigation.navigate('VincularGoogle')}
          style={{ width: '100%' }}
        />
      </ScrollView>
    </View>
  );
}

// Os seus estilos originais
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.large,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.medium,
  },
});