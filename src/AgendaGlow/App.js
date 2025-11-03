import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth'; 
import { auth } from './src/database/firebase'; 

import Main from './src/navigations/Main'; 
import Login from './src/screens/Login'; 

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); 
    });
    return () => unsubscribe(); 
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="MainApp" component={Main} />
        ) : (
          <Stack.Screen name="LoginScreen" component={Login} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
