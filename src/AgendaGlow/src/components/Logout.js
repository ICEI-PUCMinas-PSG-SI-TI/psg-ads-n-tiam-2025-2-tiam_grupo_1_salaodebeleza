import React, { useState } from "react";
import { View, Modal, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../styles/theme";
import { logout } from "../services/loginService";

export default function LogoutButton({ onLogout }) {
  const [visible, setVisible] = useState(false);

  const handleConfirmLogout = () => {
    setVisible(false);
    logout(); // chama a função real de logout
  };

  return (
    <View>
      {/* Ícone de logout */}
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Ionicons name="log-out-outline" size={28} color={theme.colors.text} style={{marginInline: 12}} />
      </TouchableOpacity>

      {/* Modal de confirmação */}
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.text}>Deseja realmente sair?</Text>
            <View style={styles.buttons}>
              <TouchableOpacity onPress={() => setVisible(false)} style={styles.cancel}>
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirmLogout} style={styles.confirm}>
                <Text style={{ color: "#fff" }}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: 280,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    gap: 10,
  },
  cancel: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  confirm: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
  },
});
