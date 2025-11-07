import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import Home from '../screens/Home';
import Agenda from '../screens/Agenda';
import Clientes from '../screens/Clientes';
import Mais from '../screens/Mais';

const BottomTabs = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'Início', icon: 'home-outline' },
    { key: 'agenda', title: 'Agenda', icon: 'calendar-outline' },
    { key: 'clientes', title: 'Clientes', icon: 'people-outline' },
    { key: 'mais', title: 'Mais', icon: 'menu-outline' },
  
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: Home,
    agenda: Agenda,
    clientes: Clientes,
    mais: Mais,
  });

   return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      sceneAnimationEnabled={false}
      labeled={false} 
      barStyle={styles.bar}
      renderIcon={({ route, focused }) => {
        return (
          <View style={[styles.tabWrapper, focused && styles.tabFocused]}>
            <Ionicons
              name={route.icon}
              size={26}
              color={focused ? theme.colors.primary : theme.colors.textInput}
            />
            <Text
              style={[
                styles.label,
                { color: focused ? theme.colors.primary : theme.colors.textInput },
              ]}
            >
              {route.title}
            </Text>
          </View>
        );
      }}
    />
  );
};

export default BottomTabs;

// --- ESTILOS personalizados ---
const styles = StyleSheet.create({
  bar: {
    backgroundColor: theme.colors.white,
    height: 65,
    elevation: 6,
    boxShadowColor: '#000',
    boxShadowOpacity: 0.1,
    boxShadowRadius: 6,
    borderTopWidth: 0,
    justifyContent: 'center',
  },
  tabWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  tabFocused: {
    backgroundColor: '#FFEBE6', 
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});

/*export default function BottomTabs({ navigation, current }) {
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
});*/
