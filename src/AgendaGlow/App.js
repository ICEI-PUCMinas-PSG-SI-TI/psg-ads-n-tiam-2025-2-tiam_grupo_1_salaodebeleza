import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import AppRoutes from './src/navigations/AppRoutes';

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}