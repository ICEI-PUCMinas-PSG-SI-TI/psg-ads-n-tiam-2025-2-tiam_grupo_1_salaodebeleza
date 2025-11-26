import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

export default function TextArea({
  placeholder,
  value,
  onChangeText,
  numberOfLines = 4,
}) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, { height: numberOfLines * 24 }]} // ajusta a altura com base no número de linhas
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textInput}
        value={value}
        onChangeText={onChangeText}
        multiline
        numberOfLines={numberOfLines}
        textAlignVertical="top" // importante para o texto começar do topo
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.container3,
    borderRadius: theme.radius.medium,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: 5,
    marginVertical: theme.spacing.small,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 16,
    textAlignVertical: 'top',
  },
});
