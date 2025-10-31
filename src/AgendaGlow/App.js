import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { theme } from './src/styles/theme';
import Header from './src/components/Header';
import Input from './src/components/Input';
import Card from './src/components/Card';
import Button from './src/components/Button';
import BottomTabs from './src/components/BottomTabs';
import Square from './src/components/Square';

// PESSOAL, ESSE É SÓ UM EXEMPLO UTILIZANDO OS COMPONENTES!

export default function App() {
  const [nomeBusca, setNomeBusca] = useState('');

  const clientes = [
    { id: 1, nome: 'Maria Souza', info: 'Cliente desde 2022' },
    { id: 2, nome: 'Ana Carvalho', info: 'Agendamento mensal' },
    { id: 3, nome: 'Juliana Pereira', info: 'Cabelos e unhas' },
  ];

  return (
    <View style={styles.container}>
      <Header title="Clientes" /> {}

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* --- BLOCO DE SQUARES --- */}
        <View style={styles.squaresContainer}>
          <Square icon="calendar-outline" title="Agendas" number={12} />
          <Square icon="people-outline" title="Clientes" number={41} />
          <Square icon="cash-outline" title="Receita" number="R$ 850" />
          <Square icon="bar-chart-outline" title="Relatórios" />
        </View>

        {/* --- BLOCO DE CLIENTES --- */}
        <Input
          icon="search-outline"
          placeholder="Buscar cliente..."
          value={nomeBusca}
          onChangeText={setNomeBusca}
        />

        {clientes.map((c) => (
          <Card
            key={c.id}
            title={c.nome}
            subtitle={c.info}
            icon="person-circle-outline"
            onView={() => Alert.alert('Visualizar', c.nome)}
            onEdit={() => Alert.alert('Editar', c.nome)}
          />
        ))}

        <Button title="Cadastrar novo cliente" onPress={() => Alert.alert('Novo cliente')} />
      </ScrollView>

      <BottomTabs
        navigation={{
          navigate: (route) => Alert.alert('Navegar para:', route),
        }}
        current="Início"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    padding: theme.spacing.large,
    paddingBottom: 100,
  },
  squaresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: theme.spacing.large,
  },
});
