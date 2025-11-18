import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../styles/theme";
import { Picker } from "@react-native-picker/picker";

export default function Filter({ listItem = [], placeholder }) {
  return (
    <View style={styles.InputContainer}>
      <Picker dropdownIconColor={theme.colors.textInput} style={styles.picker}>
        <Picker.Item
          color={theme.colors.textInput}
          label={placeholder}
          value={null}
        />
        {listItem.map((i) => (
          <Picker.Item
            color={theme.colors.textInput}
            label={i.nome}
            value={null}
          />
        ))}
      </Picker>
    </View>
  );
}

// Estilos do componente Card
const styles = StyleSheet.create({
  InputContainer: {
    width: "auto",
    height: 45,
  },
  picker: {
    height: 100,
    borderRadius: 999,
    padding: 10,
    backgroundColor: "transparent",
  },
});
