// src/screens/Funcionarios.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { theme } from '../styles/theme';

export default function Sevicos({ navigation }) {
  return (
    <View style={styles.container}>
      <Header
        userName="Melissa"
        onNotificationPress={() => console.log('Notificações')}
        onProfilePress={() => console.log('Perfil')}
      />

      {/* TÍTULO E BOTÃO ADD */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Equipe</Text>
        <Button
          title="Adicionar +"
          small
          onPress={() => navigation.navigate('FuncionarioCadastro')}
        />
      </View>

      {/* LISTA DE FUNCIONÁRIOS */}
      <ScrollView contentContainerStyle={styles.listContainer}>
        <Card
          title="Joana"
          subtitle="Assistente"
          onView={() => console.log('Visualizar Joana')}
          onEdit={() => console.log('Editar Joana')}
        />
        <Card
          title="Marcos"
          subtitle="Cabeleireiro"
          onView={() => console.log('Visualizar Marcos')}
          onEdit={() => console.log('Editar Marcos')}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.large,
    paddingVertical: theme.spacing.medium,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
  },
  listContainer: {
    paddingHorizontal: theme.spacing.large,
    paddingBottom: 100,
  },
});
