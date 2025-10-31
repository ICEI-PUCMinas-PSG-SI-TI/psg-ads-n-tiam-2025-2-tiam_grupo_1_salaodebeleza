import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

// Implementar o createBottomTabNavigator, ele substitui o BottomTabs manual e mostra as telas certinho!

export default function BottomTabs({ navigation, current }) {
  const tabs = [
    { name: 'Início', icon: 'home-outline', route: 'Home' },
    { name: 'Agenda', icon: 'calendar-outline', route: 'Agenda' },
    { name: 'Clientes', icon: 'people-outline', route: 'Clientes' },
    { name: 'Mais', icon: 'menu-outline', route: 'Mais' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.route}
          style={styles.tab}
          onPress={() => navigation.navigate(tab.route)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={tab.icon}
            size={24}
            color={current === tab.route ? theme.colors.primary : theme.colors.textInput}
          />
          <Text
            style={[
              styles.label,
              { color: current === tab.route ? theme.colors.primary : theme.colors.textInput },
            ]}
          >
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// Estilos padrão para o Bottom Tabs
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.container3,
    paddingVertical: 10,
  },
  tab: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
});
