import React from "react";
import { AuthProvider } from "./src/context/AuthContext";
import AppRoutes from "./src/navigations/AppRoutes";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppRoutes />
      </GestureHandlerRootView>
    </AuthProvider>
  );
}
