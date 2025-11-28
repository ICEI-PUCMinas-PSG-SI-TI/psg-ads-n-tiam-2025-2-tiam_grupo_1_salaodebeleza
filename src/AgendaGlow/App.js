import React from 'react';
import { AuthProvider } from './src/src/context/AuthContext';
import AppRoutes from './src/src/navigations/AppRoutes';

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}