import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Main from './src/navigations/Main'; 
import { Provider as PaperProvider } from 'react-native-paper'; 
import { theme } from './src/styles/theme';

export default function App() {
  return (
   
      <NavigationContainer>
        <Main />  
      </NavigationContainer>
    
  );
}

