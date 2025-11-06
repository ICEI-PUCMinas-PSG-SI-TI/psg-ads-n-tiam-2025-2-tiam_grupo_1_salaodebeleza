import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native'; 
import Header from '../components/Header';
import Button from '../components/Button';
import { theme } from '../styles/theme';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { getFuncionarioByUid } from '../services/funcionarioService';
import { logout } from '../services/loginService'; 

export default function Mais() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext); 
  const [loadingMeusDados, setLoadingMeusDados] = useState(false);

  // Lógica principal: Busca os dados antes de navegar
  const handleMeusDados = async () => {
    if (!user) {
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
    // Busca os dados no Firestore
    const result = await getFuncionarioByUid(user.uid);
    setLoadingMeusDados(false);

    if (result.success) {
      // Se encontrar, navega E ENVIA OS DADOS
      navigation.navigate('FuncionarioEditar', { funcionario: result.data });
    } else {
      // Se não encontrar dados (e.g., conta de teste sem documento), avisa
      Alert.alert('Erro', result.message || 'Não foi possível buscar seus dados.');
    }
  };
  
  return (
    <View style={styles.container}>
      <Header userName="Usuario" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Mais</Text>

        {/* Todos os 5 botões originais */}
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