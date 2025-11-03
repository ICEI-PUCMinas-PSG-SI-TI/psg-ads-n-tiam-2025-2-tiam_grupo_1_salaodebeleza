import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from '../screens/Home';
import Agenda from '../screens/Agenda';
import Clientes from '../screens/Clientes';
import Funcionarios from '../screens/Funcionarios';
import FuncionarioCadastro from '../screens/FuncionarioCadastro';
import Login from '../screens/Login';
import Mais from '../screens/Mais';
import Servicos from '../screens/Servicos';
import ServicosCadastro from '../screens/ServicosCadastro';
import BottomTabs from '../components/BottomTabs';

const Stack = createNativeStackNavigator();

const Main = () => {
  return(
    <Stack.Navigator initialRouteName = "BottomTabs">
      <Stack.Screen
        name="BottomTabs"
        component={BottomTabs}
        options={{
          header: () => null,
        }}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          header: () => null,
        }}
      />
      <Stack.Screen
        name="Agenda"
        component={Agenda}
        options={{
          header: () => null,
        }}
      />
      <Stack.Screen
        name="Clientes"
        component={Clientes}
        options={{
          header: () => null,
        }}
      />
      <Stack.Screen
        name="Funcionarios"
        component={Funcionarios}
        options={{
          header: () => null,
        }}
      />
      <Stack.Screen
        name="FuncionarioCadastro"
        component={FuncionarioCadastro}
        options={{
          header: () => null,
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          header: () => null,
        }}
      />
      <Stack.Screen
        name="Mais"
        component={Mais}
        options={{
          header: () => null,
        }}
      />
      <Stack.Screen
        name="Servicos"
        component={Servicos}
        options={{
          header: () => null,
        }}
      />
      <Stack.Screen
        name="ServicosCadastro"
        component={ServicosCadastro}
        options={{
          header: () => null,
        }}
      />
    </Stack.Navigator>
  );
};

export default Main;