import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Funcionarios from './src/screens/Funcionarios';
import FuncionarioCadastro from './src/screens/FuncionarioCadastro';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Funcionarios"
        screenOptions={{ headerShown: false }} // usamos nosso Header personalizado
      >
        <Stack.Screen name="Funcionarios" component={Funcionarios} />
        <Stack.Screen name="FuncionarioCadastro" component={FuncionarioCadastro} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
