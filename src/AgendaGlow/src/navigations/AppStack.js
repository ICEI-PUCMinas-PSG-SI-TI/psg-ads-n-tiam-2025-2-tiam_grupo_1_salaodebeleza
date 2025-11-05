import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Agenda from '../screens/Agenda';
import Clientes from '../screens/Clientes';
import Home from '../screens/Home';
import Funcionarios from '../screens/Funcionarios';
import FuncionarioCadastro from '../screens/FuncionarioCadastro';
import FuncionarioEditar from '../screens/FuncionarioEditar';
import Mais from '../screens/Mais';
import Relatorios from '../screens/Relatorios';
import VincularGoogle from '../screens/VincularGoogle';
import Servicos from '../screens/Servicos';
import ServicosCadastro from '../screens/ServicosCadastro';
import BottomTabs from '../components/BottomTabs';
import ClienteCadastro from '../screens/ClienteCadastro';

const Stack = createNativeStackNavigator();

const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="BottomTabs" component={BottomTabs} />
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Agenda" component={Agenda} />
    <Stack.Screen name="Clientes" component={Clientes} />
    <Stack.Screen name="Mais" component={Mais} />
    <Stack.Screen name="Funcionarios" component={Funcionarios} />
    <Stack.Screen name="FuncionarioCadastro" component={FuncionarioCadastro} />
    <Stack.Screen name="FuncionarioEditar" component={FuncionarioEditar} />
    <Stack.Screen name="Servicos" component={Servicos} />
    <Stack.Screen name="ServicosCadastro" component={ServicosCadastro} />
    <Stack.Screen name="ClienteCadastro" component={ClienteCadastro} />
    <Stack.Screen name="Relatorios" component={Relatorios} />
    <Stack.Screen name="VincularGoogle" component={VincularGoogle} />
  </Stack.Navigator>
);

export default AppStack;
