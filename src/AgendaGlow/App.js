import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider } from './src/context/AuthContext';
import AppRoutes from './src/navigations/AppRoutes';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes></AppRoutes>
    </AuthProvider>
  );
}
