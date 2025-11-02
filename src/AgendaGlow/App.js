import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/screens/Home';
import Funcionarios from './src/screens/Funcionarios';
import FuncionarioCadastro from './src/screens/FuncionarioCadastro';
import Agenda from './src/screens/Agenda';
import Clientes from './src/screens/Clientes';
import Mais from './src/screens/Mais';
import { theme } from './src/styles/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }} // usamos nosso Header personalizado
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Funcionarios" component={Funcionarios} />
        <Stack.Screen name="FuncionarioCadastro" component={FuncionarioCadastro} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}