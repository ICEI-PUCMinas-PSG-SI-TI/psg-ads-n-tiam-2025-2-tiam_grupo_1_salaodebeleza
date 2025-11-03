import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';
import Button from '../components/Button';
import { theme } from '../styles/theme';
import { useNavigation } from '@react-navigation/native';

export default function Mais() {
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      <Header userName="Usuario" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Mais</Text>

        {/* Botões principais */}
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

        {/* Botões secundários */}
        <Button
          title="Alterar meus dados"
          onPress={() => navigation.navigate('FuncionarioEditar')}
          style={{ width: '100%' }}
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
