import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

// Botão com título e/ou ícone, com opção de desabilitar e estilos variados
export default function Button({
  title,
  icon,
  onPress,
  disabled = false,
  style,
  textStyle,
  small = false,
  variant = 'primary', // 'primary' | 'ghost'
}) {
  const isIconOnly = !!icon && !title;

  // Definição dos estilos baseados na variante do botão, seja 'primary' (normal) ou 'ghost' (transparente)
  const variantStyles = {
    primary: {
      backgroundColor: theme.colors.primary,
      iconColor: theme.colors.white,
      textColor: theme.colors.white,
    },
    ghost: {
      backgroundColor: 'transparent',
      iconColor: theme.colors.primary,
      textColor: theme.colors.text,
    },
  }[variant];

  // Renderização do botão com título e/ou ícone conforme as props recebidas
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.button,
        small && styles.small,
        isIconOnly && styles.iconOnly,
        { backgroundColor: variantStyles.backgroundColor },
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={small ? 16 : 20}
          color={variantStyles.iconColor}
          style={title ? styles.iconWithText : null}
        />
      )}

      {title ? (
        <Text style={[styles.text, { color: variantStyles.textColor }, textStyle]}>
          {title}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

// Estilos do componente Button, variações normal, pequeno e apenas ícone
const styles = StyleSheet.create({
  // Botão padrão do App
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.large,
    borderRadius: theme.radius.large,
  },
  // Botão para usar no "Add+" das telas de Clientes, Serviços, etc...
  small: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: theme.radius.small,
  },
  // Botão usado dentro dos Cards, para Visualizar, Editar, etc...
  iconOnly: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    width: undefined,
    borderRadius: theme.radius.full,
  },
  text: {
    fontWeight: '600',
    fontSize: 16,
  },
  disabled: {
    opacity: 0.6,
  },
});
