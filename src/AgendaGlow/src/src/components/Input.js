import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

// Input padrão que será útilizado no App
// Obs: O ícone é opcional (pode ser usado para barra de pesquisa)
// No caso de formulário a ser preenchido, deixar sem o ícone
export default function Input({ icon, placeholder, value, onChangeText, secureTextEntry }) {
  return (
    <View style={styles.container}>
      {icon && <Ionicons name={icon} size={20} color={theme.colors.textInput} style={styles.icon} />}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textInput}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.container3,
    borderRadius: theme.radius.medium,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: 10,
    marginVertical: theme.spacing.small,
  },
  icon: {
    marginRight: theme.spacing.small,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 16,
  },
});
