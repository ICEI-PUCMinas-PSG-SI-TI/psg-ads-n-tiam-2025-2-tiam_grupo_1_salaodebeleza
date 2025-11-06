import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Button } from 'react-native';
import Header from '../components/Header';
import Square from '../components/Square';
import Card from '../components/Card';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../styles/theme';
import BottomTabs from '../navigations/BottomTabs';

export default function Home() {
  const agenda = [
    { id: 1, name: 'Maria Silva', service: 'Corte + Escova', time: '08:00', staff: 'Bruna' },
    { id: 2, name: 'Ana Carolina', service: 'Corte + Hidratação', time: '09:30', staff: 'Bruna' },
    { id: 3, name: 'Maria Clara', service: 'Corte', time: '12:00', staff: 'Bruna' },
  ];

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <Header
          userName="Usuario"
          onNotificationPress={() => {}}
          onProfilePress={() => {}}
        />

        {/* Resumo do Dia */}
        <Text style={styles.sectionTitle}>Resumo do dia</Text>
        <View style={styles.summaryRow}>
          <Square icon="person-outline" title="Clientes hoje" number="12" color="#FFE9E0" />
          <Square icon="calendar-outline" title="Agendamentos" number="12" color="#FFE9E0" />
          <Square icon="cash-outline" title="R$ 850" number={undefined} color="#FFE9E0" />
        </View>

        {/* Agenda Rápida */}
        <Text style={styles.sectionTitle}>Agenda Rápida</Text>
        <View style={styles.agendaList}>
          {agenda.map((item) => (
            <TouchableOpacity key={item.id} activeOpacity={0.8}>
              <Card
                icon="person-outline"
                title={`${item.name} — ${item.time}`}
                subtitle={`${item.service} · ${item.staff}`}
                onView={() => navigation.navigate('DetalhesAgendamento', { id: item.id })}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Atalhos Rápidos */}
        <Text style={styles.sectionTitle}>Atalhos</Text>
        <View style={styles.shortcuts}>
          <Square
            icon="people-outline"
            title="Equipe"
            onPress={() => navigation.navigate('Funcionarios')}
            color="#FFE9E0"
          />
          <Square
            icon="cash-outline"
            title="Financeiro"
            color="#FFE9E0"
          />
          <Square
            icon="bar-chart-outline"
            title="Relatório"
            color="#FFE9E0"
          />
        </View>
      </ScrollView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  greeting: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  hello: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
  },
  subtitle: {
    color: theme.colors.textInput,
    fontSize: 14,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: 20,
    marginTop: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  agendaList: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  agendaCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.large,
    padding: 14,
    marginBottom: 10,
    ...theme.shadows.light,
  },
  agendaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profilePicPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.container3,
  },
  clientName: {
    fontWeight: '600',
    color: theme.colors.text,
    fontSize: 15,
  },
  service: {
    fontSize: 13,
    color: theme.colors.textInput,
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'right',
  },
  staff: {
    fontSize: 13,
    color: theme.colors.textInput,
    textAlign: 'right',
  },
  shortcuts: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});
